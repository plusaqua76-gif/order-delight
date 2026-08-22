import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { useStore } from "@/lib/store";
import { cop } from "@/lib/format";
import { DELIVERY_FEE, type Business, type Product } from "@/data/demo";
import { NubexLogo } from "@/components/NubexLogo";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Panel de administración | Domicilios Nubex" },
      {
        name: "description",
        content:
          "Gestiona restaurantes aliados, productos y consulta estadísticas y registro de domicilios en Domicilios Nubex Pitalito.",
      },
      { property: "og:title", content: "Panel de administración | Domicilios Nubex" },
      {
        property: "og:description",
        content: "Administra negocios, menús y domicilios de la plataforma en Pitalito.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Admin,
});

const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const emptyBusiness = (): Business => ({
  id: `b${Date.now()}`,
  slug: "",
  name: "",
  category: "",
  emoji: "🍽️",
  logoUrl: "",
  color: "var(--brand-1)",
  schedule: "",
  phone: "",
  active: true,
  deliveryFee: DELIVERY_FEE,
});

const emptyProduct = (businessId: string): Product => ({
  id: `p${Date.now()}`,
  businessId,
  category: "",
  name: "",
  description: "",
  price: 0,
  emoji: "🍽️",
  active: true,
});

function Admin() {
  const {
    businesses,
    products,
    orders,
    saveBusiness,
    removeBusiness,
    toggleBusiness,
    saveProduct,
    removeProduct,
  } = useStore();
  const [tab, setTab] = useState<"domicilios" | "negocios" | "productos">("domicilios");
  const [bForm, setBForm] = useState<Business | null>(null);
  const [pForm, setPForm] = useState<Product | null>(null);
  const [selected, setSelected] = useState(businesses[0]?.id ?? "");

  // Filters for Domicilios
  const [businessFilter, setBusinessFilter] = useState<string>("all");
  const [datePreset, setDatePreset] = useState<"last-month" | "all" | "custom">("last-month");
  const [startDate, setStartDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    return d.toISOString().split("T")[0] || "";
  });
  const [endDate, setEndDate] = useState<string>(() => {
    return new Date().toISOString().split("T")[0] || "";
  });

  // Handle Preset changes
  const applyPreset = (preset: "last-month" | "all" | "custom") => {
    setDatePreset(preset);
    if (preset === "last-month") {
      const d = new Date();
      d.setDate(d.getDate() - 30);
      setStartDate(d.toISOString().split("T")[0] || "");
      setEndDate(new Date().toISOString().split("T")[0] || "");
    } else if (preset === "all") {
      setStartDate("");
      setEndDate("");
    }
  };

  // Filtered Orders Calculation
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      // Business filter
      if (businessFilter !== "all" && order.businessId !== businessFilter) {
        return false;
      }

      // Date range filter
      if (startDate) {
        const orderDateStr = order.createdAt.split("T")[0] || "";
        if (orderDateStr < startDate) return false;
      }
      if (endDate) {
        const orderDateStr = order.createdAt.split("T")[0] || "";
        if (orderDateStr > endDate) return false;
      }

      return true;
    });
  }, [orders, businessFilter, startDate, endDate]);

  // Key metrics
  const totalDeliveries = filteredOrders.length;
  const totalSubtotal = filteredOrders.reduce((acc, o) => acc + o.subtotal, 0);
  const totalDeliveryFees = filteredOrders.reduce((acc, o) => acc + o.deliveryFee, 0);
  const grandTotal = totalSubtotal + totalDeliveryFees;

  // Split calculations (80% Domiciliario / 20% Plataforma)
  const driverEarnings = Math.round(totalDeliveryFees * 0.8);
  const platformEarnings = Math.round(totalDeliveryFees * 0.2);

  // Breakdown per business
  const businessBreakdown = useMemo(() => {
    const map = new Map<
      string,
      { count: number; subtotal: number; deliveryFees: number; name: string }
    >();
    filteredOrders.forEach((o) => {
      const current = map.get(o.businessId) || {
        count: 0,
        subtotal: 0,
        deliveryFees: 0,
        name: o.businessName,
      };
      current.count += 1;
      current.subtotal += o.subtotal;
      current.deliveryFees += o.deliveryFee;
      map.set(o.businessId, current);
    });
    return Array.from(map.entries());
  }, [filteredOrders]);

  return (
    <main className="mx-auto max-w-4xl px-4 pb-16">
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <NubexLogo size="md" showSubtitle={false} />
          <div>
            <h1 className="text-2xl font-extrabold text-white">Panel de administración</h1>
            <p className="text-xs text-muted-foreground">
              Control de domicilios, restaurantes y productos de Domicilios Nubex Pitalito.
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
        {(
          [
            { id: "domicilios", label: "🛵 Domicilios y Reportes" },
            { id: "negocios", label: "🏪 Restaurantes" },
            { id: "productos", label: "🍔 Productos" },
          ] as const
        ).map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`whitespace-nowrap rounded-xl px-4 py-2.5 text-xs font-bold transition-all ${
              tab === t.id
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-secondary text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* TAB: DOMICILIOS Y REPORTES */}
      {tab === "domicilios" && (
        <section className="mt-5 space-y-5">
          {/* Filter Bar */}
          <div className="surface-card space-y-4 p-4 md:p-5">
            <h2 className="font-display text-base font-bold">Filtros de Domicilios</h2>

            {/* Presets & Business selector */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {/* Business Filter */}
              <div>
                <label className="mb-1 block text-xs font-bold text-foreground">
                  Filtrar por Negocio
                </label>
                <select
                  value={businessFilter}
                  onChange={(e) => setBusinessFilter(e.target.value)}
                  className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-xs font-semibold outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="all">🏪 Todos los negocios ({businesses.length})</option>
                  {businesses.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.emoji} {b.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Quick Period Filter */}
              <div>
                <label className="mb-1 block text-xs font-bold text-foreground">
                  Período Rápido
                </label>
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    onClick={() => applyPreset("last-month")}
                    className={`flex-1 rounded-xl px-2.5 py-2 text-xs font-bold transition-colors ${
                      datePreset === "last-month"
                        ? "bg-primary text-primary-foreground"
                        : "border border-border bg-secondary text-muted-foreground hover:bg-secondary/80"
                    }`}
                  >
                    Último mes (30d)
                  </button>
                  <button
                    type="button"
                    onClick={() => applyPreset("all")}
                    className={`flex-1 rounded-xl px-2.5 py-2 text-xs font-bold transition-colors ${
                      datePreset === "all"
                        ? "bg-primary text-primary-foreground"
                        : "border border-border bg-secondary text-muted-foreground hover:bg-secondary/80"
                    }`}
                  >
                    Histórico
                  </button>
                </div>
              </div>

              {/* Custom Date Inputs */}
              <div className="sm:col-span-2 lg:col-span-1">
                <label className="mb-1 block text-xs font-bold text-foreground">
                  Rango de Fechas
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => {
                      setStartDate(e.target.value);
                      setDatePreset("custom");
                    }}
                    className="w-1/2 rounded-xl border border-border bg-card px-2 py-2 text-xs outline-none focus:ring-2 focus:ring-ring"
                  />
                  <span className="text-xs text-muted-foreground">a</span>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => {
                      setEndDate(e.target.value);
                      setDatePreset("custom");
                    }}
                    className="w-1/2 rounded-xl border border-border bg-card px-2 py-2 text-xs outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Metric Cards Banner */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="surface-card p-4">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Domicilios Salidos
              </span>
              <p className="mt-1 font-display text-2xl font-black text-primary">
                {totalDeliveries}
              </p>
              <p className="mt-0.5 text-[11px] text-muted-foreground">
                {datePreset === "last-month" ? "En los últimos 30 días" : "En el período"}
              </p>
            </div>

            <div className="surface-card p-4">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Total Fletes
              </span>
              <p className="mt-1 font-display text-2xl font-black text-foreground">
                {cop(totalDeliveryFees)}
              </p>
              <p className="mt-0.5 text-[11px] text-muted-foreground">Recaudado en envíos</p>
            </div>

            <div className="surface-card p-4">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                🛵 Domiciliarios (80%)
              </span>
              <p className="mt-1 font-display text-2xl font-black text-foreground">
                {cop(driverEarnings)}
              </p>
              <p className="mt-0.5 text-[11px] text-muted-foreground">Pago a repartidores</p>
            </div>

            <div className="surface-card p-4">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                💼 Tu Ganancia (20%)
              </span>
              <p className="mt-1 font-display text-2xl font-black text-primary">
                {cop(platformEarnings)}
              </p>
              <p className="mt-0.5 text-[11px] text-muted-foreground">Comisión de plataforma</p>
            </div>
          </div>

          {/* Liquidación & Repartos Highlight Card */}
          <div className="surface-card p-4 md:p-5">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <h3 className="font-display text-sm font-bold text-foreground">
                  📊 Liquidación de Domicilios (Regla 80% / 20%)
                </h3>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Por cada domicilio, el repartidor recibe el <strong>80% del flete</strong> y la
                  plataforma recibe el <strong>20% de comisión</strong>.
                </p>
              </div>
              <div className="flex gap-2">
                <div className="rounded-xl border border-border bg-card px-3 py-2 text-center">
                  <p className="text-[10px] font-bold uppercase text-muted-foreground">
                    Para Domiciliarios
                  </p>
                  <p className="font-display text-base font-extrabold text-foreground">
                    {cop(driverEarnings)}
                  </p>
                </div>
                <div className="rounded-xl border border-primary/30 bg-primary/10 px-3 py-2 text-center">
                  <p className="text-[10px] font-bold uppercase text-primary">Tu Comisión Neta</p>
                  <p className="font-display text-base font-extrabold text-primary">
                    {cop(platformEarnings)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Business Breakdown Table (if looking at multiple businesses) */}
          {businessFilter === "all" && businessBreakdown.length > 0 && (
            <div className="surface-card p-4">
              <h3 className="font-display text-sm font-bold">
                Resumen y Repartos por Restaurante Aliado
              </h3>
              <div className="mt-3 overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-border text-muted-foreground">
                      <th className="pb-2 font-bold">Negocio</th>
                      <th className="pb-2 text-center font-bold">Domicilios</th>
                      <th className="pb-2 text-right font-bold">Venta Menú</th>
                      <th className="pb-2 text-right font-bold">Total Fletes</th>
                      <th className="pb-2 text-right font-bold">Domiciliarios (80%)</th>
                      <th className="pb-2 text-right font-bold text-primary">Tu Ganancia (20%)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {businessBreakdown.map(([bId, stat]) => {
                      const bDriver = Math.round(stat.deliveryFees * 0.8);
                      const bPlatform = Math.round(stat.deliveryFees * 0.2);
                      return (
                        <tr key={bId} className="hover:bg-secondary/40">
                          <td className="py-2.5 font-semibold text-foreground">{stat.name}</td>
                          <td className="py-2.5 text-center font-bold text-primary">
                            {stat.count}
                          </td>
                          <td className="py-2.5 text-right text-muted-foreground">
                            {cop(stat.subtotal)}
                          </td>
                          <td className="py-2.5 text-right font-semibold text-foreground">
                            {cop(stat.deliveryFees)}
                          </td>
                          <td className="py-2.5 text-right text-muted-foreground">
                            {cop(bDriver)}
                          </td>
                          <td className="py-2.5 text-right font-bold text-primary">
                            {cop(bPlatform)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Order Details List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-sm font-bold">
                Detalle de Pedidos y Liquidación ({filteredOrders.length})
              </h3>
              <span className="text-xs text-muted-foreground">
                Pitalito, Huila · Despachos WhatsApp
              </span>
            </div>

            {filteredOrders.length === 0 ? (
              <div className="surface-card p-8 text-center">
                <p className="text-2xl">📦</p>
                <p className="mt-2 text-sm font-bold">No hay domicilios para este filtro</p>
                <p className="text-xs text-muted-foreground">
                  Prueba cambiando el rango de fechas o seleccionando otro negocio.
                </p>
              </div>
            ) : (
              filteredOrders.map((ord) => {
                const dateObj = new Date(ord.createdAt);
                const formattedDate = dateObj.toLocaleDateString("es-CO", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                });
                const formattedTime = dateObj.toLocaleTimeString("es-CO", {
                  hour: "2-digit",
                  minute: "2-digit",
                });
                const ordDriver = Math.round(ord.deliveryFee * 0.8);
                const ordPlatform = Math.round(ord.deliveryFee * 0.2);

                return (
                  <div
                    key={ord.id}
                    className="surface-card flex flex-col justify-between gap-3 p-4 sm:flex-row sm:items-center"
                  >
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-md bg-primary/15 px-2 py-0.5 text-xs font-extrabold text-primary">
                          {ord.code}
                        </span>
                        <span className="text-xs font-bold text-foreground">
                          {ord.businessName}
                        </span>
                        <span className="text-[11px] text-muted-foreground">
                          · {formattedDate}, {formattedTime}
                        </span>
                      </div>

                      <p className="text-xs font-medium text-foreground">{ord.itemsSummary}</p>

                      <div className="flex flex-wrap items-center gap-x-3 text-[11px] text-muted-foreground">
                        <span>
                          👤 <strong>{ord.customerName}</strong> ({ord.customerPhone})
                        </span>
                        <span>
                          📍 {ord.neighborhood} - {ord.address}
                        </span>
                        <span>💳 {ord.payment}</span>
                      </div>

                      {/* Reparto breakdown pill */}
                      <div className="mt-1.5 flex flex-wrap items-center gap-2 pt-1">
                        <span className="rounded-lg bg-secondary px-2 py-0.5 text-[11px] font-semibold text-foreground">
                          🛵 Domiciliario (80%): <strong>{cop(ordDriver)}</strong>
                        </span>
                        <span className="rounded-lg bg-primary/10 px-2 py-0.5 text-[11px] font-bold text-primary">
                          💼 Tu Ganancia (20%): <strong>{cop(ordPlatform)}</strong>
                        </span>
                      </div>
                    </div>

                    <div className="flex shrink-0 flex-row items-center justify-between border-t border-border pt-2 sm:flex-col sm:items-end sm:border-t-0 sm:pt-0">
                      <div className="text-left sm:text-right">
                        <p className="text-[11px] text-muted-foreground">
                          Flete total: {cop(ord.deliveryFee)}
                        </p>
                        <p className="font-display text-sm font-extrabold text-primary">
                          Total: {cop(ord.total)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>
      )}

      {/* TAB: NEGOCIOS */}
      {tab === "negocios" && (
        <section className="mt-4 space-y-3">
          <button
            onClick={() => setBForm(emptyBusiness())}
            className="w-full rounded-xl border border-dashed border-primary py-3 text-xs font-bold text-primary"
          >
            + Crear restaurante
          </button>

          {bForm && (
            <div className="surface-card space-y-2 p-4">
              <h2 className="font-display text-sm font-bold">Datos del negocio</h2>
              <Row
                label="Nombre"
                value={bForm.name}
                onChange={(v) => setBForm({ ...bForm, name: v })}
              />
              <Row
                label="Categoría"
                value={bForm.category}
                onChange={(v) => setBForm({ ...bForm, category: v })}
              />
              <Row
                label="Horario"
                value={bForm.schedule}
                onChange={(v) => setBForm({ ...bForm, schedule: v })}
              />
              <Row
                label="WhatsApp del negocio"
                value={bForm.phone}
                onChange={(v) => setBForm({ ...bForm, phone: v })}
              />
              <Row
                label="Logo (emoji)"
                value={bForm.emoji}
                onChange={(v) => setBForm({ ...bForm, emoji: v })}
              />
              <Row
                label="URL del Logo / Imagen del Restaurante (opcional)"
                value={bForm.logoUrl || ""}
                onChange={(v) => setBForm({ ...bForm, logoUrl: v })}
              />
              {bForm.logoUrl && (
                <div className="flex items-center gap-2.5 rounded-xl border border-border/70 bg-card p-2">
                  <img
                    src={bForm.logoUrl}
                    alt="Vista previa del logo"
                    className="size-10 rounded-lg object-cover border border-border"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                  <span className="text-[11px] text-muted-foreground">
                    Vista previa del logo del restaurante
                  </span>
                </div>
              )}
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => {
                    if (!bForm.name.trim()) return toast.error("El nombre es obligatorio");
                    saveBusiness({ ...bForm, slug: bForm.slug || slugify(bForm.name) });
                    setBForm(null);
                    toast.success("Negocio guardado");
                  }}
                  className="flex-1 rounded-xl bg-primary py-2.5 text-xs font-bold text-primary-foreground"
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

          {businesses.map((b) => (
            <div key={b.id} className="surface-card flex items-center gap-3 p-4">
              {b.logoUrl ? (
                <img
                  src={b.logoUrl}
                  alt={b.name}
                  className="size-11 rounded-xl object-cover border border-border shrink-0"
                />
              ) : (
                <span className="grid size-11 place-items-center rounded-xl bg-secondary text-xl shrink-0">
                  {b.emoji}
                </span>
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold">{b.name}</p>
                <p className="text-xs text-muted-foreground">
                  {b.category} · {b.schedule || "sin horario"} · {b.active ? "Activo" : "Pausado"}
                </p>
              </div>
              <div className="flex shrink-0 gap-1">
                <IconBtn onClick={() => setBForm(b)}>✏️</IconBtn>
                <IconBtn onClick={() => toggleBusiness(b.id)}>{b.active ? "⏸️" : "▶️"}</IconBtn>
                <IconBtn
                  onClick={() => {
                    removeBusiness(b.id);
                    toast("Negocio eliminado");
                  }}
                >
                  🗑️
                </IconBtn>
              </div>
            </div>
          ))}
        </section>
      )}

      {/* TAB: PRODUCTOS */}
      {tab === "productos" && (
        <section className="mt-4 space-y-3">
          <label className="block">
            <span className="mb-1 block text-xs font-bold">Restaurante</span>
            <select
              value={selected}
              onChange={(e) => setSelected(e.target.value)}
              className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm"
            >
              {businesses.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </label>

          <button
            onClick={() => setPForm(emptyProduct(selected))}
            className="w-full rounded-xl border border-dashed border-primary py-3 text-xs font-bold text-primary"
          >
            + Cargar producto
          </button>

          {pForm && (
            <div className="surface-card space-y-2 p-4">
              <h2 className="font-display text-sm font-bold">Producto</h2>
              <Row
                label="Nombre"
                value={pForm.name}
                onChange={(v) => setPForm({ ...pForm, name: v })}
              />
              <Row
                label="Descripción"
                value={pForm.description}
                onChange={(v) => setPForm({ ...pForm, description: v })}
              />
              <Row
                label="Categoría del menú"
                value={pForm.category}
                onChange={(v) => setPForm({ ...pForm, category: v })}
              />
              <Row
                label="Precio (COP)"
                value={String(pForm.price)}
                onChange={(v) => setPForm({ ...pForm, price: Number(v.replace(/\D/g, "")) || 0 })}
              />
              <Row
                label="Foto (emoji)"
                value={pForm.emoji}
                onChange={(v) => setPForm({ ...pForm, emoji: v })}
              />
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => {
                    if (!pForm.name.trim() || !pForm.category.trim())
                      return toast.error("Nombre y categoría son obligatorios");
                    saveProduct({ ...pForm, businessId: pForm.businessId || selected });
                    setPForm(null);
                    toast.success("Producto guardado");
                  }}
                  className="flex-1 rounded-xl bg-primary py-2.5 text-xs font-bold text-primary-foreground"
                >
                  Guardar
                </button>
                <button
                  onClick={() => setPForm(null)}
                  className="rounded-xl border border-border px-4 text-xs font-bold"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}

          {products
            .filter((p) => p.businessId === selected)
            .map((p) => (
              <div key={p.id} className="surface-card flex items-center gap-3 p-4">
                <span className="grid size-11 place-items-center rounded-xl bg-secondary text-xl">
                  {p.emoji}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold">{p.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {p.category} · {cop(p.price)}
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
        </section>
      )}
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
      <span className="mb-1 block text-xs font-bold">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
      />
    </label>
  );
}

function IconBtn({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className="grid size-9 place-items-center rounded-lg border border-border text-sm"
    >
      {children}
    </button>
  );
}
