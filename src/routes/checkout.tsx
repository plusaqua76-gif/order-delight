import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { useStore } from "@/lib/store";
import { cop } from "@/lib/format";
import { buildOrderMessage, orderCode, waLink, type CheckoutData } from "@/lib/whatsapp";
import { NubexLogo } from "@/components/NubexLogo";
import type { PaymentMethod, DeliveryZoneType } from "@/data/demo";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Confirmar pedido | Domicilios Nubex Pitalito" },
      {
        name: "description",
        content:
          "Completa tus datos de entrega y envía tu pedido por WhatsApp a la central de despacho de Domicilios Nubex y al restaurante.",
      },
      { property: "og:title", content: "Confirmar pedido | Domicilios Nubex" },
      {
        property: "og:description",
        content:
          "Datos de entrega, métodos de pago (Efectivo, Nequi, Daviplata, Bancolombia) y despacho oficial.",
      },
    ],
  }),
  component: Checkout,
});

export function Checkout() {
  const { cart, cartBusiness, subtotal, setQty, setNote, clearCart, recordOrder, config } =
    useStore();

  const [data, setData] = useState<CheckoutData>({
    name: "",
    address: "",
    neighborhood: "",
    phone: "",
    zone: "urbano",
    manualDeliveryFee: undefined,
    payment: "Efectivo",
    cashAmount: undefined,
    reference: "",
  });

  const [sentOrder, setSentOrder] = useState<{
    code: string;
    business: typeof cartBusiness;
    centralWaUrl: string;
    restaurantWaUrl?: string;
    messageCentral: string;
    messageRestaurant?: string;
    itemsSummary: string;
    subtotal: number;
    deliveryFee: number;
    total: number;
    customerData: CheckoutData;
  } | null>(null);

  // Delivery Fee Calculation based on zone
  const defaultFee =
    data.zone === "afueras"
      ? config.defaultOutskirtsDeliveryFee
      : (cartBusiness?.deliveryFee ?? config.defaultUrbanDeliveryFee);

  const deliveryFee = data.manualDeliveryFee !== undefined ? data.manualDeliveryFee : defaultFee;
  const total = subtotal + deliveryFee;

  const field = (k: keyof CheckoutData) => (e: { target: { value: string } }) =>
    setData((d) => ({ ...d, [k]: e.target.value }));

  const submit = () => {
    if (!cartBusiness || cart.length === 0) return;
    if (
      !data.name.trim() ||
      !data.address.trim() ||
      !data.neighborhood.trim() ||
      !data.phone.trim()
    ) {
      toast.error("Por favor completa nombre, dirección, barrio y teléfono.");
      return;
    }

    if (data.payment === "Efectivo" && data.cashAmount && data.cashAmount < total) {
      toast.error(
        `El monto con el que pagas (${cop(data.cashAmount)}) no puede ser menor al total (${cop(total)}).`,
      );
      return;
    }

    const code = orderCode();

    // Message for central dispatch
    const messageCentral = buildOrderMessage({
      code,
      business: cartBusiness,
      items: cart,
      subtotal,
      deliveryFee,
      data,
      recipientType: "central",
    });

    const centralWaUrl = waLink(config.centralWhatsapp, messageCentral);

    // Message for restaurant if restaurant has phone
    let messageRestaurant = "";
    let restaurantWaUrl = "";
    if (cartBusiness.phone) {
      messageRestaurant = buildOrderMessage({
        code,
        business: cartBusiness,
        items: cart,
        subtotal,
        deliveryFee,
        data,
        recipientType: "restaurante",
      });
      restaurantWaUrl = waLink(cartBusiness.phone, messageRestaurant);
    }

    // Save order in history log
    const itemsSummary = cart.map((i) => `${i.qty} x ${i.name}`).join(", ");
    const changeNeeded =
      data.payment === "Efectivo" && data.cashAmount && data.cashAmount > total
        ? data.cashAmount - total
        : 0;

    recordOrder({
      id: `ord-${Date.now()}`,
      code,
      businessId: cartBusiness.id,
      businessName: cartBusiness.name,
      customerName: data.name,
      customerPhone: data.phone,
      neighborhood: data.neighborhood,
      address: data.address,
      zone: data.zone,
      payment: data.payment,
      cashAmount: data.cashAmount,
      changeNeeded,
      itemsSummary,
      subtotal,
      deliveryFee,
      total,
      status: "recibido",
      createdAt: new Date().toISOString(),
    });

    // Open WhatsApp with Central
    window.open(centralWaUrl, "_blank", "noopener");

    // Clear cart & show receipt screen with both WhatsApp buttons
    clearCart();
    setSentOrder({
      code,
      business: cartBusiness,
      centralWaUrl,
      restaurantWaUrl: restaurantWaUrl || undefined,
      messageCentral,
      messageRestaurant: messageRestaurant || undefined,
      itemsSummary,
      subtotal,
      deliveryFee,
      total,
      customerData: { ...data },
    });

    toast.success(`¡Pedido ${code} generado con éxito!`);
  };

  const copyText = (txt: string, label: string) => {
    navigator.clipboard.writeText(txt);
    toast.success(`${label} copiado al portapapeles`);
  };

  if (sentOrder) {
    const changeAmount =
      sentOrder.customerData.payment === "Efectivo" &&
      sentOrder.customerData.cashAmount &&
      sentOrder.customerData.cashAmount > sentOrder.total
        ? sentOrder.customerData.cashAmount - sentOrder.total
        : 0;

    return (
      <main className="mx-auto max-w-lg px-4 py-8">
        {/* Success Notice */}
        <div className="text-center">
          <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 text-2xl">
            ✓
          </div>
          <h1 className="mt-3 text-2xl font-extrabold text-white">¡Pedido Generado!</h1>
          <p className="text-xs text-muted-foreground mt-1">
            Se abrió el chat con la <strong>Central Nubex</strong>. También puedes avisar a la
            cocina del restaurante.
          </p>
        </div>

        {/* Digital Official Receipt Card with both logos */}
        <div className="surface-card mt-6 overflow-hidden rounded-2xl border border-cyan-500/30 p-5 shadow-2xl bg-gradient-to-b from-card via-card to-secondary/30">
          {/* Header with both Platform and Restaurant logos */}
          <div className="flex items-center justify-between gap-3 border-b border-border/80 pb-4">
            {/* Nubex Platform Logo */}
            <div className="flex flex-col items-start">
              <span className="text-[9px] font-bold uppercase tracking-wider text-cyan-400">
                Central de Despacho
              </span>
              <NubexLogo size="sm" subtitleText="Pitalito, Huila" />
            </div>

            {/* Connection spark icon */}
            <div className="flex flex-col items-center justify-center px-1">
              <span className="text-xs text-cyan-400 font-black">⚡</span>
              <span className="text-[9px] font-bold text-muted-foreground uppercase">alianza</span>
            </div>

            {/* Restaurant Logo & Badge */}
            {sentOrder.business && (
              <div className="flex flex-col items-end text-right">
                <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
                  Restaurante Emisor
                </span>
                <div className="flex items-center gap-2 mt-1">
                  <div className="text-right">
                    <p className="font-display text-xs font-black text-white leading-tight">
                      {sentOrder.business.name}
                    </p>
                    <p className="text-[10px] text-cyan-200/70">{sentOrder.business.category}</p>
                  </div>
                  {sentOrder.business.logoUrl ? (
                    <img
                      src={sentOrder.business.logoUrl}
                      alt={sentOrder.business.name}
                      className="size-9 rounded-xl object-cover border border-border shadow-sm shrink-0"
                    />
                  ) : (
                    <span
                      className="grid size-9 place-items-center rounded-xl text-lg shrink-0"
                      style={{ backgroundColor: sentOrder.business.color }}
                    >
                      {sentOrder.business.emoji}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Ticket Body */}
          <div className="pt-4 space-y-3">
            <div className="flex items-center justify-between rounded-xl bg-background/80 px-3 py-2 border border-border/60">
              <div>
                <span className="text-[10px] font-bold uppercase text-muted-foreground">
                  Código de Pedido
                </span>
                <p className="font-mono text-sm font-extrabold text-cyan-300">{sentOrder.code}</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold uppercase text-muted-foreground">
                  Método de Pago
                </span>
                <p className="text-xs font-bold text-white">{sentOrder.customerData.payment}</p>
              </div>
            </div>

            <div className="rounded-xl bg-background/50 p-3 text-xs space-y-1.5 border border-border/40">
              <div className="flex justify-between text-muted-foreground">
                <span>Cliente:</span>
                <span className="font-semibold text-white">
                  {sentOrder.customerData.name} ({sentOrder.customerData.phone})
                </span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Zona / Dirección:</span>
                <span className="font-semibold text-white text-right max-w-[210px] truncate">
                  {sentOrder.customerData.address} ({sentOrder.customerData.neighborhood}) -{" "}
                  {sentOrder.customerData.zone === "afueras" ? "Afueras" : "Urbano"}
                </span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Productos:</span>
                <span className="font-semibold text-white text-right max-w-[210px] truncate">
                  {sentOrder.itemsSummary}
                </span>
              </div>
              <div className="border-t border-border/60 pt-2 flex justify-between text-xs text-muted-foreground">
                <span>Subtotal productos:</span>
                <span>{cop(sentOrder.subtotal)}</span>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>
                  Domicilio ({sentOrder.customerData.zone === "afueras" ? "Afueras" : "Urbano"}):
                </span>
                <span>{cop(sentOrder.deliveryFee)}</span>
              </div>
              <div className="flex justify-between text-sm font-extrabold text-white pt-1 border-t border-border/80">
                <span className="text-cyan-300">Total a Cobrar:</span>
                <span className="text-cyan-300 font-black">{cop(sentOrder.total)}</span>
              </div>

              {sentOrder.customerData.payment === "Efectivo" &&
                sentOrder.customerData.cashAmount && (
                  <div className="mt-2 rounded-lg bg-secondary/80 p-2 text-[11px] space-y-1 border border-border/60">
                    <div className="flex justify-between">
                      <span>Paga con billete de:</span>
                      <span className="font-bold text-white">
                        {cop(sentOrder.customerData.cashAmount)}
                      </span>
                    </div>
                    <div className="flex justify-between text-emerald-400 font-bold">
                      <span>Cambio a llevar:</span>
                      <span>{cop(changeAmount)}</span>
                    </div>
                  </div>
                )}
            </div>

            {/* Bank details if electronic payment */}
            {sentOrder.customerData.payment !== "Efectivo" && (
              <div className="rounded-xl border border-cyan-500/20 bg-cyan-950/30 p-3 text-xs space-y-1.5">
                <p className="font-bold text-cyan-300">💳 Cuentas para transferencia:</p>
                {sentOrder.customerData.payment === "Nequi" && config.nequiNumber && (
                  <div className="flex items-center justify-between text-white">
                    <span>
                      Nequi: <strong>{config.nequiNumber}</strong>
                    </span>
                    <button
                      onClick={() => copyText(config.nequiNumber!, "Número de Nequi")}
                      className="rounded bg-cyan-500/20 px-2 py-0.5 text-[10px] font-bold text-cyan-300"
                    >
                      Copiar
                    </button>
                  </div>
                )}
                {sentOrder.customerData.payment === "Daviplata" && config.daviplataNumber && (
                  <div className="flex items-center justify-between text-white">
                    <span>
                      Daviplata: <strong>{config.daviplataNumber}</strong>
                    </span>
                    <button
                      onClick={() => copyText(config.daviplataNumber!, "Número de Daviplata")}
                      className="rounded bg-cyan-500/20 px-2 py-0.5 text-[10px] font-bold text-cyan-300"
                    >
                      Copiar
                    </button>
                  </div>
                )}
                {sentOrder.customerData.payment === "Bancolombia" && config.bancolombiaNumber && (
                  <div className="flex items-center justify-between text-white">
                    <span>
                      Bancolombia: <strong>{config.bancolombiaNumber}</strong>
                    </span>
                    <button
                      onClick={() => copyText(config.bancolombiaNumber!, "Cuenta Bancolombia")}
                      className="rounded bg-cyan-500/20 px-2 py-0.5 text-[10px] font-bold text-cyan-300"
                    >
                      Copiar
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Action buttons (Dual Dispatch: Central & Restaurant) */}
          <div className="mt-5 space-y-2">
            <a
              href={sentOrder.centralWaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-5 py-3.5 text-sm font-black text-black shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.99]"
            >
              <span>1. Enviar a Central Nubex (Despacho)</span>
              <span className="text-base">🛵</span>
            </a>

            {sentOrder.restaurantWaUrl && (
              <a
                href={sentOrder.restaurantWaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-cyan-500/40 bg-cyan-500/10 px-5 py-3 text-xs font-bold text-cyan-300 hover:bg-cyan-500 hover:text-black transition-all"
              >
                <span>2. Avisar a Cocina ({sentOrder.business?.name})</span>
                <span className="text-sm">👨‍🍳</span>
              </a>
            )}

            <button
              onClick={() => copyText(sentOrder.messageCentral, "Mensaje del pedido")}
              className="w-full rounded-xl border border-border bg-card py-2.5 text-xs font-semibold text-foreground transition-colors hover:bg-muted"
            >
              Copiar texto del pedido
            </button>

            <Link
              to="/"
              onClick={() => setSentOrder(null)}
              className="block w-full rounded-xl py-2.5 text-center text-xs font-bold text-muted-foreground hover:text-white"
            >
              ← Volver al inicio / Hacer otro pedido
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (cart.length === 0) {
    return (
      <main className="mx-auto max-w-md px-4 py-20 text-center">
        <p className="text-5xl">🛒</p>
        <h1 className="mt-4 text-xl font-bold">Tu carrito está vacío</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Elige un restaurante aliado en Pitalito y arma tu pedido.
        </p>
        <Link
          to="/"
          className="mt-6 inline-block rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground"
        >
          Ver restaurantes
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-2xl px-4 pb-16">
      <h1 className="mt-6 text-2xl font-extrabold">Confirmar pedido</h1>

      {/* Co-Branded Platform & Restaurant Banner */}
      {cartBusiness && (
        <div className="surface-card mt-3 flex items-center justify-between gap-3 p-3.5 border border-cyan-500/20 bg-gradient-to-r from-card via-card to-cyan-950/20">
          <div className="flex items-center gap-2">
            <NubexLogo size="sm" subtitleText="Pitalito" />
          </div>
          <div className="text-xs font-bold text-cyan-400">✕</div>
          <div className="flex items-center gap-2.5 text-right">
            <div className="min-w-0">
              <p className="truncate text-xs font-extrabold text-white">{cartBusiness.name}</p>
              <p className="text-[10px] text-muted-foreground">{cartBusiness.category}</p>
            </div>
            {cartBusiness.logoUrl ? (
              <img
                src={cartBusiness.logoUrl}
                alt={cartBusiness.name}
                className="size-8 rounded-lg object-cover border border-border shadow-sm shrink-0"
              />
            ) : (
              <span
                className="grid size-8 place-items-center rounded-lg text-sm shrink-0"
                style={{ backgroundColor: cartBusiness.color }}
              >
                {cartBusiness.emoji}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Cart Items List */}
      <section className="surface-card mt-4 divide-y divide-border p-4">
        <h2 className="pb-3 font-display text-sm font-bold uppercase tracking-wide text-muted-foreground">
          Tu carrito ({cartBusiness?.name})
        </h2>
        {cart.map((item) => (
          <div key={item.productId} className="py-3">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-bold">{item.name}</p>
                <p className="text-xs text-muted-foreground">{cop(item.price)} c/u</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setQty(item.productId, item.qty - 1)}
                  className="size-7 rounded-lg border border-border font-bold"
                >
                  −
                </button>
                <span className="w-5 text-center text-sm font-bold">{item.qty}</span>
                <button
                  onClick={() => setQty(item.productId, item.qty + 1)}
                  className="size-7 rounded-lg border border-border font-bold"
                >
                  +
                </button>
                <span className="w-20 text-right text-sm font-extrabold">
                  {cop(item.price * item.qty)}
                </span>
              </div>
            </div>
            <input
              value={item.note}
              onChange={(e) => setNote(item.productId, e.target.value)}
              placeholder="Nota especial para este producto"
              className="mt-2 w-full rounded-lg border border-border bg-card px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        ))}
        <div className="space-y-1.5 pt-3 text-sm">
          <div className="flex justify-between text-muted-foreground">
            <span>Subtotal productos</span>
            <span>{cop(subtotal)}</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>
              Domicilio ({data.zone === "afueras" ? "Afueras / Especial" : "Casco Urbano"})
            </span>
            <span>{cop(deliveryFee)}</span>
          </div>
          <div className="flex justify-between text-base font-extrabold">
            <span>Total a pagar</span>
            <span className="text-primary">{cop(total)}</span>
          </div>
        </div>
      </section>

      {/* Delivery Zone Selector & Client Details */}
      <section className="surface-card mt-4 space-y-4 p-4">
        <div>
          <h2 className="font-display text-sm font-bold uppercase tracking-wide text-muted-foreground mb-2">
            1. Sector de Entrega (Pitalito)
          </h2>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() =>
                setData((d) => ({ ...d, zone: "urbano", manualDeliveryFee: undefined }))
              }
              className={`rounded-xl border p-3 text-left transition-all ${
                data.zone === "urbano"
                  ? "border-cyan-400 bg-cyan-500/15 text-white"
                  : "border-border bg-card text-muted-foreground hover:text-white"
              }`}
            >
              <p className="text-xs font-black">🏙️ Casco Urbano</p>
              <p className="text-[11px] text-cyan-300 font-semibold mt-0.5">
                Tarifa fija {cop(config.defaultUrbanDeliveryFee)}
              </p>
            </button>

            <button
              type="button"
              onClick={() =>
                setData((d) => ({ ...d, zone: "afueras", manualDeliveryFee: undefined }))
              }
              className={`rounded-xl border p-3 text-left transition-all ${
                data.zone === "afueras"
                  ? "border-amber-400 bg-amber-500/15 text-white"
                  : "border-border bg-card text-muted-foreground hover:text-white"
              }`}
            >
              <p className="text-xs font-black">🌾 Afueras / Veredas</p>
              <p className="text-[11px] text-amber-300 font-semibold mt-0.5">
                Desde {cop(config.defaultOutskirtsDeliveryFee)} (Ajustable)
              </p>
            </button>
          </div>
          {data.zone === "afueras" && (
            <p className="mt-2 text-[11px] text-amber-200/90 bg-amber-500/10 p-2.5 rounded-lg border border-amber-500/20">
              💡 Para zonas como Bruselas, Criollo, Regueros o fincas, la tarifa base es{" "}
              {cop(config.defaultOutskirtsDeliveryFee)}. Desde la central de Nubex se confirmará el
              valor exacto según la distancia.
            </p>
          )}
        </div>

        <div className="space-y-3">
          <h2 className="font-display text-sm font-bold uppercase tracking-wide text-muted-foreground">
            2. Datos del Cliente
          </h2>
          <Field
            label="Nombre del cliente"
            value={data.name}
            onChange={field("name")}
            placeholder="Ej. Laura Gómez"
          />
          <Field
            label="Dirección exacta"
            value={data.address}
            onChange={field("address")}
            placeholder="Calle 5 # 4-32, apto 201"
          />
          <Field
            label="Barrio o Sector"
            value={data.neighborhood}
            onChange={field("neighborhood")}
            placeholder="Ej. Centro, Solarte, Cálamo, Bruselas..."
          />
          <Field
            label="Teléfono / WhatsApp de contacto"
            value={data.phone}
            onChange={field("phone")}
            placeholder="3123456789"
          />
          <Field
            label="Punto de referencia (opcional)"
            value={data.reference}
            onChange={field("reference")}
            placeholder="Casa de dos pisos, portón blanco, frente al parque"
          />
        </div>

        {/* Payment Options */}
        <div className="space-y-3 pt-2">
          <h2 className="font-display text-sm font-bold uppercase tracking-wide text-muted-foreground">
            3. Método de Pago
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {(["Efectivo", "Nequi", "Daviplata", "Bancolombia"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setData((d) => ({ ...d, payment: m }))}
                className={`rounded-xl border px-2 py-3 text-xs font-bold transition-colors ${
                  data.payment === m
                    ? "border-primary bg-primary text-primary-foreground shadow-md"
                    : "border-border bg-card text-muted-foreground hover:text-white"
                }`}
              >
                {m === "Efectivo"
                  ? "💵 Efectivo"
                  : m === "Nequi"
                    ? "📲 Nequi"
                    : m === "Daviplata"
                      ? "📲 Daviplata"
                      : "🏦 Bancolombia"}
              </button>
            ))}
          </div>

          {/* Cash Change Input */}
          {data.payment === "Efectivo" && (
            <div className="rounded-xl bg-background/80 p-3 border border-border/80 space-y-2">
              <label className="block">
                <span className="text-xs font-bold text-white">
                  ¿Con cuánto billete vas a pagar? (Opcional)
                </span>
                <input
                  type="number"
                  placeholder={`Ej. 50000 o 100000 (Total pedido: ${cop(total)})`}
                  value={data.cashAmount || ""}
                  onChange={(e) =>
                    setData((d) => ({
                      ...d,
                      cashAmount: e.target.value ? Number(e.target.value) : undefined,
                    }))
                  }
                  className="mt-1 w-full rounded-lg border border-border bg-card px-3 py-2 text-xs outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </label>

              {data.cashAmount && data.cashAmount > total ? (
                <p className="text-xs text-emerald-400 font-bold">
                  💰 El domiciliario llevará cambio de:{" "}
                  <strong>{cop(data.cashAmount - total)}</strong>
                </p>
              ) : data.cashAmount && data.cashAmount === total ? (
                <p className="text-xs text-cyan-300 font-semibold">
                  ✓ Pago con monto exacto. No requiere cambio.
                </p>
              ) : data.cashAmount && data.cashAmount < total ? (
                <p className="text-xs text-rose-400 font-bold">
                  ⚠️ El billete ingresado es menor al total ({cop(total)}).
                </p>
              ) : null}
            </div>
          )}

          {/* Electronic Payment Notice */}
          {data.payment !== "Efectivo" && (
            <div className="rounded-xl bg-cyan-950/30 p-3 border border-cyan-500/20 text-xs text-cyan-200">
              ℹ️ Al enviar el pedido por WhatsApp se te compartirán los datos de cuenta de{" "}
              <strong>{data.payment}</strong> para enviar el comprobante de transferencia.
            </div>
          )}
        </div>
      </section>

      {/* Submit Button */}
      <button
        onClick={submit}
        className="mt-5 w-full rounded-2xl bg-cyan-500 py-4 text-base font-black text-black shadow-lg shadow-cyan-500/25 transition-transform hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2"
      >
        <span>Enviar Pedido a Central Nubex</span>
        <span>·</span>
        <span>{cop(total)}</span>
      </button>

      <button
        onClick={() => {
          clearCart();
          toast("Carrito vaciado");
        }}
        className="mt-2 w-full rounded-xl py-3 text-xs font-semibold text-muted-foreground hover:text-white"
      >
        Vaciar carrito
      </button>
    </main>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (e: { target: { value: string } }) => void;
  placeholder: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-bold">{label}</span>
      <input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
      />
    </label>
  );
}

export default Checkout;
