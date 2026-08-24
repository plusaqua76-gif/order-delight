import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { toast } from "sonner";
import { useStore } from "@/lib/store";
import { cop, slugify, formatOrderDate, formatOrderTime } from "@/lib/format";
import { waLink } from "@/lib/whatsapp";
import { RoleAuthModal } from "@/components/RoleAuthModal";
import type { Business, Product, OrderLog, OrderStatus, AppUser, UserRole } from "@/data/demo";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Panel Modular por Roles | Domicilios Nubex Pitalito" },
      {
        name: "description",
        content:
          "Módulos para Super Administrador, Restaurantes Aliados y Domiciliarios con sincronización en tiempo real.",
      },
    ],
  }),
  component: Admin,
});

const emptyBusiness = (): Business => ({
  id: `b-${Date.now()}`,
  slug: "",
  name: "",
  category: "",
  emoji: "🍽️",
  logoUrl: "",
  color: "var(--brand-1)",
  schedule: "7:00 am - 11:00 pm",
  openTime: "07:00",
  closeTime: "23:00",
  phone: "573001112233",
  active: true,
  deliveryFee: 6000,
});

const emptyProduct = (businessId: string): Product => ({
  id: `p-${Date.now()}`,
  businessId,
  category: "Platos",
  name: "",
  description: "",
  price: 15000,
  emoji: "🍲",
  active: true,
});

const emptyUser = (): AppUser => ({
  id: `usr-${Date.now()}`,
  email: "",
  name: "",
  role: "restaurante",
  phone: "",
  businessId: "",
  active: true,
  createdAt: new Date().toISOString(),
});

type DateRangeFilter = "all" | "today" | "week" | "month";

export function Admin() {
  const {
    businesses,
    products,
    orders,
    users,
    currentUser,
    config,
    updateConfig,
    saveBusiness,
    removeBusiness,
    toggleBusiness,
    saveProduct,
    removeProduct,
    updateOrder,
    removeOrder,
    saveUser,
    removeUser,
    logoutUser,
    setCurrentUserDirectly,
  } = useStore();

  const [tab, setTab] = useState<"despacho" | "negocios" | "productos" | "usuarios" | "ajustes">(
    "despacho",
  );
  const [selected, setSelected] = useState(businesses[0]?.id ?? "");
  const [bForm, setBForm] = useState<Business | null>(null);
  const [pForm, setPForm] = useState<Product | null>(null);
  const [uForm, setUForm] = useState<AppUser | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Filters for orders
  const [dateFilter, setDateFilter] = useState<DateRangeFilter>("all");
  const [businessFilter, setBusinessFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Editing order modal for dispatch
  const [editingOrder, setEditingOrder] = useState<OrderLog | null>(null);

  // Effective role: If no user logged in, default to superadmin view with a banner
  const role: UserRole = currentUser?.role || "superadmin";

  // Filtered orders according to role and active filters
  const filteredOrders = useMemo(() => {
    const now = new Date();
    return orders.filter((ord) => {
      // If role is restaurante, ONLY see orders of their business
      if (role === "restaurante" && currentUser?.businessId) {
        if (ord.businessId !== currentUser.businessId) return false;
      }

      // If role is domiciliario, ONLY see orders assigned to them
      if (role === "domiciliario") {
        if (
          ord.assignedDriver?.toLowerCase() !== currentUser?.name.toLowerCase() &&
          ord.driverPhone !== currentUser?.phone
        ) {
          // If not assigned to him, only show unassigned if status is 'en_preparacion' or 'recibido'
          if (ord.assignedDriver) return false;
        }
      }

      // Filter by Business
      if (businessFilter !== "all" && ord.businessId !== businessFilter) {
        return false;
      }

      // Filter by Status
      if (statusFilter !== "all" && (ord.status || "recibido") !== statusFilter) {
        return false;
      }

      // Filter by Date
      const orderDate = new Date(ord.createdAt);
      if (dateFilter === "today") {
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        return orderDate >= startOfDay;
      }
      if (dateFilter === "week") {
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - 7);
        return orderDate >= startOfWeek;
      }
      if (dateFilter === "month") {
        const startOfMonth = new Date(now);
        startOfMonth.setDate(now.getDate() - 30);
        return orderDate >= startOfMonth;
      }

      return true;
    });
  }, [orders, businessFilter, statusFilter, dateFilter, role, currentUser]);

  // Statistics calculation based on filtered orders
  const totalOrdersCount = filteredOrders.length;
  const totalDeliveryFees = filteredOrders.reduce((sum, o) => sum + (o.deliveryFee || 0), 0);
  const driverEarnings = Math.round(totalDeliveryFees * 0.8);
  const platformEarnings = Math.round(totalDeliveryFees * 0.2);

  // Quick WhatsApp notify to driver
  const sendDriverWhatsApp = (ord: OrderLog, driverPhone: string, driverName: string) => {
    const text = [
      `🛵 *ASIGNACIÓN DE DOMICILIO NUBEX*`,
      `Hola *${driverName}*, tienes un nuevo servicio asignado:`,
      ``,
      `📌 *Pedido:* ${ord.code}`,
      `🏪 *Restaurante:* ${ord.businessName}`,
      `📍 *Entregar en:* ${ord.address} (${ord.neighborhood})`,
      `👤 *Cliente:* ${ord.customerName} (${ord.customerPhone})`,
      `💵 *Valor Domicilio a cobrar/ganar:* ${cop(ord.deliveryFee)} (Tu pago 80%: ${cop(Math.round(ord.deliveryFee * 0.8))})`,
      `💳 *Pago:* ${ord.payment}${ord.payment === "Efectivo" && ord.cashAmount ? ` (Paga con ${cop(ord.cashAmount)}, cambio ${cop(ord.changeNeeded || 0)})` : ""}`,
      `🧾 *Total a recaudar del pedido:* ${cop(ord.total)}`,
      ``,
      `¡Por favor confirma recibido para coordinar con el restaurante! 🚀`,
    ].join("\n");

    const url = waLink(driverPhone, text);
    window.open(url, "_blank");
  };

  // My business if logged in as restaurant
  const myBusiness = businesses.find((b) => b.id === currentUser?.businessId);

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      {/* Role Banner / Active Session */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-cyan-500/30 bg-cyan-950/30 p-4">
        <div className="flex items-center gap-3">
          <div className="grid size-10 place-items-center rounded-xl bg-cyan-500/20 text-xl font-black text-cyan-300">
            {role === "superadmin" ? "👑" : role === "restaurante" ? "👨‍🍳" : "🛵"}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                Módulo Activo:
              </span>
              <span className="rounded-md bg-cyan-500/20 px-2 py-0.5 text-xs font-black uppercase text-cyan-300">
                {role === "superadmin"
                  ? "Super Administrador"
                  : role === "restaurante"
                    ? `Restaurante (${myBusiness?.name || "Aliado"})`
                    : "Domiciliario Repartidor"}
              </span>
            </div>
            <p className="text-xs font-medium text-white">
              {currentUser
                ? `Conectado como ${currentUser.name} (${currentUser.email})`
                : "Modo Super Administrador Maestro"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick role switcher for testing convenience */}
          <div className="flex items-center gap-1 rounded-xl border border-border bg-card p-1">
            <span className="px-2 text-[10px] font-bold text-muted-foreground uppercase">
              Probar:
            </span>
            {users.slice(0, 3).map((u) => (
              <button
                key={u.id}
                onClick={() => {
                  setCurrentUserDirectly(u);
                  toast.success(`Cambiado a rol: ${u.role.toUpperCase()}`);
                }}
                className={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition-colors ${
                  currentUser?.id === u.id
                    ? "bg-cyan-500 text-black font-black"
                    : "text-muted-foreground hover:text-white"
                }`}
              >
                {u.role === "superadmin"
                  ? "Admin"
                  : u.role === "restaurante"
                    ? "Cocina"
                    : "Repartidor"}
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="rounded-xl border border-cyan-500/40 bg-cyan-950/60 px-3.5 py-2 text-xs font-bold text-cyan-300 hover:bg-cyan-900/50"
          >
            {currentUser ? "Mi Cuenta" : "Acceso por Correo"}
          </button>
        </div>
      </div>

      {/* Header */}
      <div className="flex flex-col justify-between gap-4 border-b border-border/80 pb-6 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-cyan-500/20 px-2 py-0.5 text-xs font-black text-cyan-400">
              CENTRAL NUBEX
            </span>
            <span className="text-xs text-muted-foreground">Pitalito, Huila</span>
          </div>
          <h1 className="mt-1 text-2xl font-black text-white">
            {role === "superadmin"
              ? "Panel Central de Despacho & Administración"
              : role === "restaurante"
                ? `Gestión de Pedidos & Menú · ${myBusiness?.name || "Restaurante"}`
                : "Módulo de Rutas & Entregas Domiciliario"}
          </h1>
          <p className="text-xs text-muted-foreground">
            {role === "superadmin"
              ? "Control total de despachos, restaurantes, catálogo de platos, creación de roles y liquidación 80/20."
              : role === "restaurante"
                ? "Atiende los pedidos de tu cocina, actualiza tus precios y activa o pausa tus platos."
                : "Revisa tus pedidos asignados, marca 'En camino' y confirma entregas para liquidar tu pago del 80%."}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-950/40 px-3 py-2 text-xs font-bold text-emerald-400">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
            </span>
            <span>Firestore En Vivo</span>
          </div>
        </div>
      </div>

      {/* Tabs Navigation (Adapted by Role) */}
      <div className="mt-6 flex flex-wrap border-b border-border text-xs font-bold">
        {/* Superadmin sees all tabs */}
        {role === "superadmin" && (
          <>
            <button
              onClick={() => setTab("despacho")}
              className={`border-b-2 px-4 py-3 transition-colors ${
                tab === "despacho"
                  ? "border-cyan-400 text-cyan-400"
                  : "border-transparent text-muted-foreground hover:text-white"
              }`}
            >
              🛵 Central de Despacho ({orders.length})
            </button>
            <button
              onClick={() => setTab("negocios")}
              className={`border-b-2 px-4 py-3 transition-colors ${
                tab === "negocios"
                  ? "border-cyan-400 text-cyan-400"
                  : "border-transparent text-muted-foreground hover:text-white"
              }`}
            >
              🏪 Restaurantes ({businesses.length})
            </button>
            <button
              onClick={() => setTab("productos")}
              className={`border-b-2 px-4 py-3 transition-colors ${
                tab === "productos"
                  ? "border-cyan-400 text-cyan-400"
                  : "border-transparent text-muted-foreground hover:text-white"
              }`}
            >
              🍔 Menú & Platos ({products.length})
            </button>
            <button
              onClick={() => setTab("usuarios")}
              className={`border-b-2 px-4 py-3 transition-colors ${
                tab === "usuarios"
                  ? "border-cyan-400 text-cyan-400"
                  : "border-transparent text-muted-foreground hover:text-white"
              }`}
            >
              👥 Roles & Accesos ({users.length})
            </button>
            <button
              onClick={() => setTab("ajustes")}
              className={`border-b-2 px-4 py-3 transition-colors ${
                tab === "ajustes"
                  ? "border-cyan-400 text-cyan-400"
                  : "border-transparent text-muted-foreground hover:text-white"
              }`}
            >
              ⚙️ Configuración & Tarifas
            </button>
          </>
        )}

        {/* Restaurant sees only their Orders and their Products */}
        {role === "restaurante" && (
          <>
            <button
              onClick={() => setTab("despacho")}
              className={`border-b-2 px-4 py-3 transition-colors ${
                tab === "despacho"
                  ? "border-cyan-400 text-cyan-400"
                  : "border-transparent text-muted-foreground hover:text-white"
              }`}
            >
              👨‍🍳 Comandas de Cocina ({filteredOrders.length})
            </button>
            <button
              onClick={() => {
                if (myBusiness) setSelected(myBusiness.id);
                setTab("productos");
              }}
              className={`border-b-2 px-4 py-3 transition-colors ${
                tab === "productos"
                  ? "border-cyan-400 text-cyan-400"
                  : "border-transparent text-muted-foreground hover:text-white"
              }`}
            >
              🍔 Administrar Mi Menú
            </button>
          </>
        )}

        {/* Domiciliario sees only delivery route and earnings */}
        {role === "domiciliario" && (
          <button
            onClick={() => setTab("despacho")}
            className="border-b-2 border-cyan-400 px-4 py-3 text-cyan-400"
          >
            🛵 Mis Entregas & Ganancias ({filteredOrders.length})
          </button>
        )}
      </div>

      {/* TAB 1: DESPACHO / COMANDAS / ENTREGAS */}
      {tab === "despacho" && (
        <section className="mt-6 space-y-6">
          {/* Summary Metric Cards */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="surface-card p-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                📦 Pedidos Filtrados
              </span>
              <p className="mt-1 font-display text-2xl font-black text-white">{totalOrdersCount}</p>
              <p className="mt-0.5 text-[10px] text-muted-foreground">
                {role === "superadmin"
                  ? "Filtro global"
                  : role === "restaurante"
                    ? "Tu negocio"
                    : "Tus entregas"}
              </p>
            </div>

            <div className="surface-card p-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                🛵 Total Fletes
              </span>
              <p className="mt-1 font-display text-2xl font-black text-cyan-300">
                {cop(totalDeliveryFees)}
              </p>
              <p className="mt-0.5 text-[10px] text-muted-foreground">Tarifas domicilios</p>
            </div>

            <div className="surface-card p-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                🛵 Domiciliarios (80%)
              </span>
              <p className="mt-1 font-display text-2xl font-black text-emerald-400">
                {cop(driverEarnings)}
              </p>
              <p className="mt-0.5 text-[10px] text-muted-foreground">
                {role === "domiciliario" ? "Tu ganancia estimada" : "A repartir"}
              </p>
            </div>

            <div className="surface-card p-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                💼 Comisión Nubex (20%)
              </span>
              <p className="mt-1 font-display text-2xl font-black text-cyan-400">
                {cop(platformEarnings)}
              </p>
              <p className="mt-0.5 text-[10px] text-muted-foreground">Central Pitalito</p>
            </div>
          </div>

          {/* Filters Bar (Only for superadmin or general view) */}
          {role === "superadmin" && (
            <div className="surface-card flex flex-wrap items-center justify-between gap-3 p-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-muted-foreground">Restaurante:</span>
                <select
                  value={businessFilter}
                  onChange={(e) => setBusinessFilter(e.target.value)}
                  className="rounded-lg border border-border bg-card px-2.5 py-1.5 text-xs text-white"
                >
                  <option value="all">Todos los restaurantes</option>
                  {businesses.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>

                <span className="text-xs font-bold text-muted-foreground ml-2">Estado:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="rounded-lg border border-border bg-card px-2.5 py-1.5 text-xs text-white"
                >
                  <option value="all">Todos los estados</option>
                  <option value="recibido">🟡 Recibido / Por Asignar</option>
                  <option value="en_preparacion">👨‍🍳 En Preparación</option>
                  <option value="en_camino">🛵 En Camino</option>
                  <option value="entregado">🟢 Entregado</option>
                  <option value="cancelado">🔴 Cancelado</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-muted-foreground">Periodo:</span>
                {(["all", "today", "week", "month"] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => setDateFilter(r)}
                    className={`rounded-lg px-2.5 py-1 text-xs font-bold transition-colors ${
                      dateFilter === r
                        ? "bg-cyan-500 text-black"
                        : "bg-secondary text-muted-foreground hover:text-white"
                    }`}
                  >
                    {r === "all"
                      ? "Todo"
                      : r === "today"
                        ? "Hoy"
                        : r === "week"
                          ? "7 días"
                          : "30 días"}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Orders Dispatch List */}
          <div className="space-y-3">
            <h3 className="font-display text-sm font-bold text-white flex items-center justify-between">
              <span>Órdenes Activas & Liquidación ({filteredOrders.length})</span>
              <span className="text-xs font-normal text-muted-foreground">
                Actualizaciones automáticas sincronizadas con Firestore
              </span>
            </h3>

            {filteredOrders.length === 0 ? (
              <div className="surface-card p-12 text-center">
                <p className="text-3xl">📦</p>
                <p className="mt-2 text-sm font-bold text-white">No hay pedidos disponibles</p>
                <p className="text-xs text-muted-foreground">
                  {role === "domiciliario"
                    ? "No tienes pedidos asignados actualmente."
                    : "Los nuevos pedidos aparecerán aquí al instante."}
                </p>
              </div>
            ) : (
              filteredOrders.map((ord) => {
                const timeStr = formatOrderTime(ord.createdAt);
                const dateStr = formatOrderDate(ord.createdAt);
                const driverCut = Math.round(ord.deliveryFee * 0.8);
                const nubexCut = Math.round(ord.deliveryFee * 0.2);

                const statusColor =
                  ord.status === "entregado"
                    ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                    : ord.status === "en_camino"
                      ? "bg-blue-500/20 text-blue-300 border-blue-500/30"
                      : ord.status === "en_preparacion"
                        ? "bg-amber-500/20 text-amber-300 border-amber-500/30"
                        : "bg-cyan-500/20 text-cyan-300 border-cyan-500/30";

                return (
                  <div
                    key={ord.id}
                    className="surface-card rounded-xl border border-border p-4 transition-all hover:border-cyan-500/40"
                  >
                    <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                      {/* Left: Info */}
                      <div className="space-y-1.5 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-xs font-black text-cyan-300">
                            {ord.code}
                          </span>
                          <span className="font-bold text-white">{ord.businessName}</span>
                          <span className="text-xs text-muted-foreground" suppressHydrationWarning>
                            · {dateStr}, {timeStr}
                          </span>

                          <span
                            className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${statusColor}`}
                          >
                            {ord.status ? ord.status.replace("_", " ").toUpperCase() : "RECIBIDO"}
                          </span>

                          <span
                            className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${
                              ord.zone === "afueras"
                                ? "bg-amber-500/20 text-amber-300"
                                : "bg-secondary text-muted-foreground"
                            }`}
                          >
                            {ord.zone === "afueras" ? "🌾 Afueras" : "🏙️ Urbano"}
                          </span>
                        </div>

                        <p className="text-xs font-medium text-white">{ord.itemsSummary}</p>

                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground pt-1">
                          <span>
                            👤 <strong>{ord.customerName}</strong> ({ord.customerPhone})
                          </span>
                          <span>
                            📍 {ord.address} — <strong>{ord.neighborhood}</strong>
                          </span>
                          <span>
                            💳 {ord.payment}{" "}
                            {ord.payment === "Efectivo" && ord.cashAmount
                              ? `(Paga con ${cop(ord.cashAmount)} · Cambio: ${cop(ord.changeNeeded || 0)})`
                              : ""}
                          </span>
                        </div>

                        {/* Driver & Split info */}
                        <div className="flex flex-wrap items-center gap-2 pt-2">
                          {ord.assignedDriver ? (
                            <span className="rounded-lg bg-cyan-950/60 border border-cyan-500/30 px-2.5 py-1 text-xs font-bold text-cyan-300">
                              🛵 Repartidor: <strong>{ord.assignedDriver}</strong>
                            </span>
                          ) : (
                            <span className="rounded-lg bg-amber-950/50 border border-amber-500/30 px-2 py-0.5 text-xs font-bold text-amber-400">
                              ⚠️ Sin domiciliario asignado
                            </span>
                          )}

                          <span className="text-[11px] text-muted-foreground">
                            Flete {cop(ord.deliveryFee)} → Domiciliario (80%):{" "}
                            <strong className="text-emerald-400">{cop(driverCut)}</strong> · Central
                            (20%): <strong className="text-cyan-400">{cop(nubexCut)}</strong>
                          </span>
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex flex-col items-end gap-2 border-t border-border pt-3 sm:border-t-0 sm:pt-0 shrink-0">
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">
                            Subtotal: {cop(ord.subtotal)} + Flete: {cop(ord.deliveryFee)}
                          </p>
                          <p className="font-display text-base font-black text-cyan-400">
                            Total: {cop(ord.total)}
                          </p>
                        </div>

                        {/* Role-Specific Action Buttons */}
                        <div className="flex flex-wrap gap-1.5">
                          {role === "superadmin" && (
                            <>
                              <button
                                onClick={() => setEditingOrder(ord)}
                                className="rounded-lg bg-cyan-500/20 border border-cyan-500/40 px-2.5 py-1 text-xs font-bold text-cyan-300 hover:bg-cyan-500 hover:text-black transition-colors"
                              >
                                ⚙️ Asignar / Ajustar
                              </button>
                              <button
                                onClick={() => {
                                  removeOrder(ord.id);
                                  toast("Orden eliminada");
                                }}
                                className="rounded-lg border border-border px-2 py-1 text-xs text-muted-foreground hover:text-rose-400"
                                title="Eliminar"
                              >
                                🗑️
                              </button>
                            </>
                          )}

                          {role === "restaurante" && (
                            <>
                              {ord.status === "recibido" && (
                                <button
                                  onClick={() => {
                                    updateOrder(ord.id, { status: "en_preparacion" });
                                    toast.success("Comanda puesta en preparación");
                                  }}
                                  className="rounded-lg bg-amber-500 px-3 py-1 text-xs font-black text-black"
                                >
                                  👨‍🍳 Poner en Preparación
                                </button>
                              )}
                              {ord.status === "en_preparacion" && (
                                <button
                                  onClick={() => {
                                    updateOrder(ord.id, { status: "en_camino" });
                                    toast.success("Marcado como listo para despacho");
                                  }}
                                  className="rounded-lg bg-blue-500 px-3 py-1 text-xs font-black text-white"
                                >
                                  📦 Listo para Despacho
                                </button>
                              )}
                            </>
                          )}

                          {role === "domiciliario" && (
                            <>
                              {ord.status !== "en_camino" && ord.status !== "entregado" && (
                                <button
                                  onClick={() => {
                                    updateOrder(ord.id, {
                                      status: "en_camino",
                                      assignedDriver: currentUser?.name || "Repartidor Nubex",
                                      driverPhone: currentUser?.phone || "",
                                    });
                                    toast.success("¡Pedido tomado! Estás en camino");
                                  }}
                                  className="rounded-lg bg-blue-500 px-3 py-1 text-xs font-black text-white"
                                >
                                  🛵 Tomar & Ir en Camino
                                </button>
                              )}
                              {ord.status === "en_camino" && (
                                <button
                                  onClick={() => {
                                    updateOrder(ord.id, { status: "entregado" });
                                    toast.success("¡Pedido entregado con éxito! Comisión sumada.");
                                  }}
                                  className="rounded-lg bg-emerald-500 px-3 py-1 text-xs font-black text-black"
                                >
                                  ✅ Confirmar Entregado
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>
      )}

      {/* TAB: ROLES & USUARIOS (SUPERADMIN EXCLUSIVE) */}
      {tab === "usuarios" && role === "superadmin" && (
        <section className="mt-6 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
            <div>
              <h3 className="font-display text-sm font-bold text-white">
                👥 Gestión de Usuarios & Roles de Nubex
              </h3>
              <p className="text-xs text-muted-foreground">
                Crea los accesos por correo para Restaurantes Aliados y Domiciliarios. A cada uno le
                llegará la invitación a su correo.
              </p>
            </div>
            <button
              onClick={() => setUForm(emptyUser())}
              className="rounded-xl bg-cyan-500 px-4 py-2 text-xs font-black text-black hover:bg-cyan-400 transition-colors"
            >
              + Crear Nuevo Usuario / Rol
            </button>
          </div>

          {/* Form Create / Edit User */}
          {uForm && (
            <div className="surface-card space-y-4 rounded-2xl border border-cyan-500/40 p-5 bg-card">
              <h4 className="font-display text-sm font-bold text-white">
                {uForm.id.startsWith("usr-")
                  ? "Nuevo Usuario y Asignación de Rol"
                  : "Editar Usuario"}
              </h4>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Row
                  label="Nombre Completo / Razón Social"
                  value={uForm.name}
                  onChange={(v) => setUForm({ ...uForm, name: v })}
                />
                <Row
                  label="Correo Electrónico (para inicio de sesión)"
                  value={uForm.email}
                  onChange={(v) => setUForm({ ...uForm, email: v })}
                />
                <label className="block">
                  <span className="mb-1 block text-xs font-bold text-muted-foreground">
                    Rol en la Plataforma
                  </span>
                  <select
                    value={uForm.role}
                    onChange={(e) => setUForm({ ...uForm, role: e.target.value as UserRole })}
                    className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm text-white"
                  >
                    <option value="superadmin">👑 Super Administrador (Acceso Total)</option>
                    <option value="restaurante">
                      👨‍🍳 Restaurante Aliado (Ver solo sus pedidos y menú)
                    </option>
                    <option value="domiciliario">
                      🛵 Domiciliario (Ver solo sus rutas y ganancias)
                    </option>
                  </select>
                </label>

                {uForm.role === "restaurante" ? (
                  <label className="block">
                    <span className="mb-1 block text-xs font-bold text-muted-foreground">
                      Restaurante Asociado
                    </span>
                    <select
                      value={uForm.businessId || ""}
                      onChange={(e) => setUForm({ ...uForm, businessId: e.target.value })}
                      className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm text-white"
                    >
                      <option value="">Selecciona el restaurante...</option>
                      {businesses.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.name} ({b.category})
                        </option>
                      ))}
                    </select>
                  </label>
                ) : (
                  <Row
                    label="Teléfono / WhatsApp"
                    value={uForm.phone || ""}
                    onChange={(v) => setUForm({ ...uForm, phone: v })}
                  />
                )}
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => {
                    if (!uForm.name.trim() || !uForm.email.trim()) {
                      return toast.error("Nombre y correo son obligatorios");
                    }
                    if (uForm.role === "restaurante" && !uForm.businessId) {
                      return toast.error("Debes asociar un restaurante al rol");
                    }
                    saveUser(uForm);
                    toast.success(
                      `Usuario ${uForm.name} guardado. Se ha habilitado su acceso por correo.`,
                    );
                    setUForm(null);
                  }}
                  className="rounded-xl bg-cyan-500 px-5 py-2.5 text-xs font-black text-black"
                >
                  Guardar & Enviar Acceso
                </button>
                <button
                  onClick={() => setUForm(null)}
                  className="rounded-xl border border-border px-4 text-xs font-bold text-white"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}

          {/* User List */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {users.map((u) => {
              const biz = businesses.find((b) => b.id === u.businessId);
              return (
                <div
                  key={u.id}
                  className="surface-card space-y-2 p-4 rounded-xl border border-border"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="grid size-8 place-items-center rounded-lg bg-cyan-500/20 text-sm">
                        {u.role === "superadmin" ? "👑" : u.role === "restaurante" ? "👨‍🍳" : "🛵"}
                      </span>
                      <div>
                        <p className="text-sm font-bold text-white">{u.name}</p>
                        <p className="text-xs text-muted-foreground">{u.email}</p>
                      </div>
                    </div>

                    <span className="rounded-full bg-secondary px-2.5 py-0.5 text-[10px] font-extrabold uppercase text-cyan-300">
                      {u.role}
                    </span>
                  </div>

                  {biz && (
                    <p className="text-xs text-cyan-400 font-medium">
                      🏪 Asignado a: <strong>{biz.name}</strong>
                    </p>
                  )}
                  {u.phone && (
                    <p className="text-xs text-muted-foreground">
                      📱 WhatsApp: <strong>{u.phone}</strong>
                    </p>
                  )}

                  <div className="flex items-center justify-between border-t border-border/70 pt-2 text-xs">
                    <span
                      className={
                        u.active ? "text-emerald-400 font-bold" : "text-rose-400 font-bold"
                      }
                    >
                      {u.active ? "● Activo" : "○ Inactivo"}
                    </span>

                    <div className="flex gap-1">
                      <button
                        onClick={() => {
                          setCurrentUserDirectly(u);
                          toast.success(`Probando vista como: ${u.name}`);
                        }}
                        className="rounded-md border border-cyan-500/30 bg-cyan-950/40 px-2 py-1 text-[11px] font-bold text-cyan-300 hover:bg-cyan-900/50"
                      >
                        Simular Vista
                      </button>
                      <IconBtn onClick={() => setUForm(u)}>✏️</IconBtn>
                      {u.id !== "usr-superadmin" && (
                        <IconBtn
                          onClick={() => {
                            removeUser(u.id);
                            toast("Usuario eliminado");
                          }}
                        >
                          🗑️
                        </IconBtn>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* TAB 2: NEGOCIOS / RESTAURANTES */}
      {tab === "negocios" && role === "superadmin" && (
        <section className="mt-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-sm font-bold text-white">
              Restaurantes Aliados de Pitalito ({businesses.length})
            </h3>
            <button
              onClick={() => setBForm(emptyBusiness())}
              className="rounded-xl bg-cyan-500 px-4 py-2 text-xs font-black text-black"
            >
              + Nuevo Restaurante
            </button>
          </div>

          {bForm && (
            <div className="surface-card space-y-4 rounded-2xl border border-cyan-500/40 p-5 bg-card">
              <h4 className="font-display text-sm font-bold text-white">
                {bForm.id.startsWith("b-") ? "Nuevo Restaurante" : "Editar Restaurante"}
              </h4>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Row
                  label="Nombre del Negocio"
                  value={bForm.name}
                  onChange={(v) => setBForm({ ...bForm, name: v, slug: bForm.slug || slugify(v) })}
                />
                <Row
                  label="Slug URL (ej: burger-pitalito)"
                  value={bForm.slug}
                  onChange={(v) => setBForm({ ...bForm, slug: slugify(v) })}
                />
                <Row
                  label="Categoría (ej: Hamburguesas, Pizzas, Pollo)"
                  value={bForm.category}
                  onChange={(v) => setBForm({ ...bForm, category: v })}
                />
                <Row
                  label="WhatsApp directo para comandas"
                  value={bForm.phone}
                  onChange={(v) => setBForm({ ...bForm, phone: v })}
                />
                <Row
                  label="Horario (ej: 11:30 am - 10:30 pm)"
                  value={bForm.schedule}
                  onChange={(v) => setBForm({ ...bForm, schedule: v })}
                />
                <Row
                  label="Logo URL (imagen)"
                  value={bForm.logoUrl || ""}
                  onChange={(v) => setBForm({ ...bForm, logoUrl: v })}
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => {
                    if (!bForm.name.trim() || !bForm.slug.trim())
                      return toast.error("Nombre y slug son obligatorios");
                    saveBusiness(bForm);
                    setBForm(null);
                    toast.success("Restaurante guardado en Firestore");
                  }}
                  className="rounded-xl bg-cyan-500 px-5 py-2.5 text-xs font-black text-black"
                >
                  Guardar
                </button>
                <button
                  onClick={() => setBForm(null)}
                  className="rounded-xl border border-border px-4 text-xs font-bold"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {businesses.map((b) => (
              <div
                key={b.id}
                className="surface-card flex items-center gap-3 p-4 rounded-xl border border-border"
              >
                <span className="grid size-12 place-items-center rounded-xl bg-secondary text-2xl">
                  {b.emoji}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-white">{b.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {b.category} · 📱 {b.phone}
                  </p>
                  <p className="text-[11px] text-cyan-400">🕒 {b.schedule}</p>
                </div>
                <div className="flex shrink-0 gap-1">
                  <IconBtn onClick={() => setBForm(b)}>✏️</IconBtn>
                  <IconBtn onClick={() => toggleBusiness(b.id)}>{b.active ? "🟢" : "🔴"}</IconBtn>
                  <IconBtn
                    onClick={() => {
                      removeBusiness(b.id);
                      toast("Restaurante eliminado");
                    }}
                  >
                    🗑️
                  </IconBtn>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* TAB 3: PRODUCTOS & MENÚ */}
      {tab === "productos" && (
        <section className="mt-6 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
            {role === "superadmin" ? (
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-muted-foreground">Restaurante:</span>
                <select
                  value={selected}
                  onChange={(e) => setSelected(e.target.value)}
                  className="rounded-xl border border-border bg-card px-3 py-2 text-xs text-white"
                >
                  {businesses.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <p className="text-sm font-bold text-white">
                Menú de:{" "}
                <strong className="text-cyan-400">{myBusiness?.name || "Tu Restaurante"}</strong>
              </p>
            )}

            <button
              onClick={() =>
                setPForm(
                  emptyProduct(
                    role === "restaurante" ? currentUser?.businessId || selected : selected,
                  ),
                )
              }
              className="rounded-xl bg-cyan-500 px-4 py-2 text-xs font-black text-black"
            >
              + Agregar Plato al Menú
            </button>
          </div>

          {pForm && (
            <div className="surface-card space-y-4 rounded-2xl border border-cyan-500/40 p-5 bg-card">
              <h4 className="font-display text-sm font-bold text-white">
                {pForm.id.startsWith("p-") ? "Nuevo Plato" : "Editar Plato"}
              </h4>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Row
                  label="Nombre del Plato / Producto"
                  value={pForm.name}
                  onChange={(v) => setPForm({ ...pForm, name: v })}
                />
                <Row
                  label="Categoría del Plato (ej: Hamburguesas, Bebidas)"
                  value={pForm.category}
                  onChange={(v) => setPForm({ ...pForm, category: v })}
                />
                <Row
                  label="Descripción / Ingredientes"
                  value={pForm.description}
                  onChange={(v) => setPForm({ ...pForm, description: v })}
                />
                <Row
                  label="Precio (COP)"
                  value={String(pForm.price)}
                  onChange={(v) => setPForm({ ...pForm, price: Number(v.replace(/\D/g, "")) || 0 })}
                />
                <Row
                  label="Emoji / Icono"
                  value={pForm.emoji}
                  onChange={(v) => setPForm({ ...pForm, emoji: v })}
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => {
                    if (!pForm.name.trim() || !pForm.category.trim())
                      return toast.error("Nombre y categoría son obligatorios");
                    saveProduct({
                      ...pForm,
                      businessId:
                        role === "restaurante"
                          ? currentUser?.businessId || selected
                          : pForm.businessId || selected,
                    });
                    setPForm(null);
                    toast.success("Plato guardado en Firestore");
                  }}
                  className="rounded-xl bg-cyan-500 px-5 py-2.5 text-xs font-black text-black"
                >
                  Guardar Plato
                </button>
                <button
                  onClick={() => setPForm(null)}
                  className="rounded-xl border border-border px-4 text-xs font-bold text-white"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {products
              .filter(
                (p) =>
                  p.businessId === (role === "restaurante" ? currentUser?.businessId : selected),
              )
              .map((p) => (
                <div
                  key={p.id}
                  className="surface-card flex items-center gap-3 p-4 rounded-xl border border-border"
                >
                  <span className="grid size-10 place-items-center rounded-xl bg-secondary text-xl">
                    {p.emoji}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-white">{p.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {p.category} · <strong className="text-cyan-300">{cop(p.price)}</strong>
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-1">
                    <IconBtn onClick={() => setPForm(p)}>✏️</IconBtn>
                    <IconBtn onClick={() => saveProduct({ ...p, active: !p.active })}>
                      {p.active ? "⏸️" : "▶️"}
                    </IconBtn>
                    <IconBtn
                      onClick={() => {
                        removeProduct(p.id);
                        toast("Producto eliminado");
                      }}
                    >
                      🗑️
                    </IconBtn>
                  </div>
                </div>
              ))}
          </div>
        </section>
      )}

      {/* TAB 4: AJUSTES & HORARIOS (SUPERADMIN ONLY) */}
      {tab === "ajustes" && role === "superadmin" && (
        <section className="mt-6 max-w-xl space-y-5">
          <div className="surface-card space-y-4 p-5 rounded-2xl border border-border">
            <h3 className="font-display text-sm font-bold text-white">
              ⚙️ Parámetros Globales de Central Nubex
            </h3>

            <Row
              label="WhatsApp de la Central Nubex (Receptor de Despachos)"
              value={config.centralWhatsapp}
              onChange={(v) => updateConfig({ centralWhatsapp: v })}
            />

            <Row
              label="Horario General de la Plataforma (Ej: 7:00 am a 11:00 pm)"
              value={config.centralSchedule}
              onChange={(v) => updateConfig({ centralSchedule: v })}
            />

            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="mb-1 block text-xs font-bold text-muted-foreground">
                  Tarifa Urbana Pitalito
                </span>
                <input
                  type="number"
                  value={config.defaultUrbanDeliveryFee}
                  onChange={(e) =>
                    updateConfig({ defaultUrbanDeliveryFee: Number(e.target.value) || 0 })
                  }
                  className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm text-white"
                />
              </label>

              <label className="block">
                <span className="mb-1 block text-xs font-bold text-muted-foreground">
                  Tarifa Base Afueras
                </span>
                <input
                  type="number"
                  value={config.defaultOutskirtsDeliveryFee}
                  onChange={(e) =>
                    updateConfig({ defaultOutskirtsDeliveryFee: Number(e.target.value) || 0 })
                  }
                  className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm text-white"
                />
              </label>
            </div>

            <div className="border-t border-border pt-4 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                💳 Cuentas para Transferencias
              </h4>
              <Row
                label="Número Nequi"
                value={config.nequiNumber || ""}
                onChange={(v) => updateConfig({ nequiNumber: v })}
              />
              <Row
                label="Número Daviplata"
                value={config.daviplataNumber || ""}
                onChange={(v) => updateConfig({ daviplataNumber: v })}
              />
              <Row
                label="Cuenta Bancolombia"
                value={config.bancolombiaNumber || ""}
                onChange={(v) => updateConfig({ bancolombiaNumber: v })}
              />
            </div>

            <button
              onClick={() => toast.success("Configuración actualizada con éxito")}
              className="w-full rounded-xl bg-cyan-500 py-3 text-xs font-black text-black"
            >
              Guardar Configuración
            </button>
          </div>
        </section>
      )}

      {/* MODAL GESTIONAR DESPACHO */}
      {editingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="surface-card w-full max-w-lg space-y-4 rounded-2xl border border-cyan-500/40 p-6 shadow-2xl bg-card">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <span className="font-mono text-xs font-black text-cyan-300">
                  {editingOrder.code}
                </span>
                <h3 className="font-display text-base font-black text-white">
                  Gestionar Despacho & Domiciliario
                </h3>
              </div>
              <button
                onClick={() => setEditingOrder(null)}
                className="rounded-lg border border-border px-2 py-1 text-xs text-muted-foreground hover:bg-secondary"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="mb-1 block text-xs font-bold text-muted-foreground">
                    Estado del Pedido
                  </span>
                  <select
                    value={editingOrder.status || "recibido"}
                    onChange={(e) =>
                      setEditingOrder({
                        ...editingOrder,
                        status: e.target.value as OrderStatus,
                      })
                    }
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-white"
                  >
                    <option value="recibido">🟡 Recibido</option>
                    <option value="en_preparacion">👨‍🍳 En Preparación</option>
                    <option value="en_camino">🛵 En Camino</option>
                    <option value="entregado">🟢 Entregado</option>
                    <option value="cancelado">🔴 Cancelado</option>
                  </select>
                </label>

                <label className="block">
                  <span className="mb-1 block text-xs font-bold text-muted-foreground">
                    Tarifa Flete (COP)
                  </span>
                  <input
                    type="number"
                    value={editingOrder.deliveryFee}
                    onChange={(e) => {
                      const fee = Number(e.target.value) || 0;
                      setEditingOrder({
                        ...editingOrder,
                        deliveryFee: fee,
                        total: editingOrder.subtotal + fee,
                      });
                    }}
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-white"
                  />
                </label>
              </div>

              <div className="space-y-1">
                <span className="text-xs font-bold text-muted-foreground">
                  Asignar Domiciliario Registrado
                </span>
                <select
                  value={editingOrder.assignedDriver || ""}
                  onChange={(e) => {
                    const selUser = users.find((u) => u.name === e.target.value);
                    setEditingOrder({
                      ...editingOrder,
                      assignedDriver: e.target.value,
                      driverPhone: selUser?.phone || editingOrder.driverPhone,
                    });
                  }}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-white"
                >
                  <option value="">-- Sin asignar --</option>
                  {users
                    .filter((u) => u.role === "domiciliario")
                    .map((d) => (
                      <option key={d.id} value={d.name}>
                        🛵 {d.name} {d.phone ? `(${d.phone})` : ""}
                      </option>
                    ))}
                </select>
              </div>

              <Row
                label="Nombre Manual Repartidor"
                value={editingOrder.assignedDriver || ""}
                onChange={(v) => setEditingOrder({ ...editingOrder, assignedDriver: v })}
              />

              <Row
                label="Teléfono WhatsApp Repartidor"
                value={editingOrder.driverPhone || ""}
                onChange={(v) => setEditingOrder({ ...editingOrder, driverPhone: v })}
              />
            </div>

            <div className="flex gap-2 pt-3 border-t border-border">
              <button
                onClick={() => {
                  updateOrder(editingOrder.id, {
                    status: editingOrder.status,
                    deliveryFee: editingOrder.deliveryFee,
                    total: editingOrder.total,
                    assignedDriver: editingOrder.assignedDriver,
                    driverPhone: editingOrder.driverPhone,
                  });
                  toast.success("Despacho actualizado en Firestore");

                  if (editingOrder.driverPhone && editingOrder.assignedDriver) {
                    sendDriverWhatsApp(
                      editingOrder,
                      editingOrder.driverPhone,
                      editingOrder.assignedDriver,
                    );
                  }

                  setEditingOrder(null);
                }}
                className="flex-1 rounded-xl bg-cyan-500 py-2.5 text-xs font-black text-black"
              >
                Guardar & Notificar Domiciliario
              </button>
              <button
                onClick={() => setEditingOrder(null)}
                className="rounded-xl border border-border px-4 text-xs font-bold text-white"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      <RoleAuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </main>
  );
}

function Row({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-bold text-muted-foreground">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm text-white outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
      />
    </label>
  );
}

function IconBtn({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className="grid size-9 place-items-center rounded-lg border border-border text-sm hover:bg-secondary text-white"
    >
      {children}
    </button>
  );
}

export default Admin;
