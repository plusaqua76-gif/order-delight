import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { useStore } from "@/lib/store";
import { cop } from "@/lib/format";
import { DELIVERY_FEE, DISPATCH_WHATSAPP } from "@/data/demo";
import { buildOrderMessage, orderCode, waLink, type CheckoutData } from "@/lib/whatsapp";
import { NubexLogo } from "@/components/NubexLogo";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Confirmar pedido | Domicilios Nubex Pitalito" },
      {
        name: "description",
        content:
          "Completa tus datos de entrega y envía tu pedido por WhatsApp a la central de despacho de Domicilios Nubex.",
      },
      { property: "og:title", content: "Confirmar pedido | Domicilios Nubex" },
      {
        property: "og:description",
        content: "Datos de entrega, método de pago y envío del pedido por WhatsApp.",
      },
    ],
  }),
  component: Checkout,
});

function Checkout() {
  const { cart, cartBusiness, subtotal, setQty, setNote, clearCart, recordOrder } = useStore();
  const [data, setData] = useState<CheckoutData>({
    name: "",
    address: "",
    neighborhood: "",
    phone: "",
    payment: "Efectivo",
    reference: "",
  });
  const [sentOrder, setSentOrder] = useState<{
    code: string;
    business: typeof cartBusiness;
    waUrl: string;
    message: string;
    itemsSummary: string;
    subtotal: number;
    deliveryFee: number;
    total: number;
    customerData: CheckoutData;
  } | null>(null);

  const deliveryFee = cartBusiness?.deliveryFee ?? DELIVERY_FEE;
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
      toast.error("Completa nombre, dirección, barrio y teléfono.");
      return;
    }
    const code = orderCode();
    const message = buildOrderMessage({
      code,
      business: cartBusiness,
      items: cart,
      subtotal,
      deliveryFee,
      data,
    });
    const waUrl = waLink(DISPATCH_WHATSAPP, message);

    // Save order in history log
    const itemsSummary = cart.map((i) => `${i.qty} x ${i.name}`).join(", ");
    recordOrder({
      id: `ord-${Date.now()}`,
      code,
      businessId: cartBusiness.id,
      businessName: cartBusiness.name,
      customerName: data.name,
      customerPhone: data.phone,
      neighborhood: data.neighborhood,
      address: data.address,
      payment: data.payment,
      itemsSummary,
      subtotal,
      deliveryFee,
      total,
      createdAt: new Date().toISOString(),
    });

    window.open(waUrl, "_blank", "noopener");

    // Clear cart immediately so the user can place a new order
    clearCart();
    setSentOrder({
      code,
      business: cartBusiness,
      waUrl,
      message,
      itemsSummary,
      subtotal,
      deliveryFee,
      total,
      customerData: { ...data },
    });
    toast.success(`¡Pedido ${code} generado para WhatsApp!`);
  };

  const copyMessage = (msg: string) => {
    navigator.clipboard.writeText(msg);
    toast.success("Mensaje del pedido copiado al portapapeles");
  };

  if (sentOrder) {
    return (
      <main className="mx-auto max-w-lg px-4 py-8">
        {/* Success Notice */}
        <div className="text-center">
          <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 text-2xl">
            ✓
          </div>
          <h1 className="mt-3 text-2xl font-extrabold text-white">
            ¡Pedido Preparado para WhatsApp!
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Se ha generado el mensaje oficial con los logos y detalles del pedido.
          </p>
        </div>

        {/* Digital Official Receipt Card with both logos */}
        <div className="surface-card mt-6 overflow-hidden rounded-2xl border border-cyan-500/30 p-5 shadow-2xl bg-gradient-to-b from-card via-card to-secondary/30">
          {/* Header with both Platform and Restaurant logos */}
          <div className="flex items-center justify-between gap-3 border-b border-border/80 pb-4">
            {/* Nubex Platform Logo */}
            <div className="flex flex-col items-start">
              <span className="text-[9px] font-bold uppercase tracking-wider text-cyan-400">
                Plataforma Oficial
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
                  Método
                </span>
                <p className="text-xs font-bold text-white">{sentOrder.customerData.payment}</p>
              </div>
            </div>

            <div className="rounded-xl bg-background/50 p-3 text-xs space-y-1.5 border border-border/40">
              <div className="flex justify-between text-muted-foreground">
                <span>Cliente:</span>
                <span className="font-semibold text-white">{sentOrder.customerData.name}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Entrega:</span>
                <span className="font-semibold text-white text-right max-w-[200px] truncate">
                  {sentOrder.customerData.address} ({sentOrder.customerData.neighborhood})
                </span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Productos:</span>
                <span className="font-semibold text-white">{sentOrder.itemsSummary}</span>
              </div>
              <div className="border-t border-border/60 pt-2 flex justify-between text-xs text-muted-foreground">
                <span>Subtotal:</span>
                <span>{cop(sentOrder.subtotal)}</span>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Domicilio fijo:</span>
                <span>{cop(sentOrder.deliveryFee)}</span>
              </div>
              <div className="flex justify-between text-sm font-extrabold text-white pt-1 border-t border-border/80">
                <span className="text-cyan-300">Total a Pagar:</span>
                <span className="text-cyan-300 font-black">{cop(sentOrder.total)}</span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="mt-5 space-y-2">
            <a
              href={sentOrder.waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-5 py-3.5 text-sm font-black text-black shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.99]"
            >
              <span>Abrir WhatsApp con el Pedido</span>
              <span className="text-base">💬</span>
            </a>

            <button
              onClick={() => copyMessage(sentOrder.message)}
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
          Elige un restaurante aliado y arma tu pedido.
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

      <section className="surface-card mt-4 divide-y divide-border p-4">
        <h2 className="pb-3 font-display text-sm font-bold uppercase tracking-wide text-muted-foreground">
          Tu carrito
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
        <div className="space-y-1 pt-3 text-sm">
          <div className="flex justify-between text-muted-foreground">
            <span>Subtotal productos</span>
            <span>{cop(subtotal)}</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>Domicilio</span>
            <span>{cop(deliveryFee)}</span>
          </div>
          <div className="flex justify-between text-base font-extrabold">
            <span>Total</span>
            <span className="text-primary">{cop(total)}</span>
          </div>
        </div>
      </section>

      <section className="surface-card mt-4 space-y-3 p-4">
        <h2 className="font-display text-sm font-bold uppercase tracking-wide text-muted-foreground">
          Datos de entrega
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
          label="Barrio"
          value={data.neighborhood}
          onChange={field("neighborhood")}
          placeholder="Ej. Solarte, Pitalito"
        />
        <Field
          label="Teléfono / WhatsApp"
          value={data.phone}
          onChange={field("phone")}
          placeholder="3123456789"
        />
        <Field
          label="Punto de referencia (opcional)"
          value={data.reference}
          onChange={field("reference")}
          placeholder="Casa de dos pisos, portón blanco"
        />

        <div>
          <p className="mb-2 text-xs font-bold">Método de pago</p>
          <div className="grid grid-cols-3 gap-2">
            {(["Efectivo", "Nequi", "Daviplata"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setData((d) => ({ ...d, payment: m }))}
                className={`rounded-xl border px-2 py-3 text-xs font-bold transition-colors ${
                  data.payment === m
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-muted-foreground"
                }`}
              >
                {m === "Efectivo" ? "💵 Efectivo" : m === "Nequi" ? "📲 Nequi" : "📲 Daviplata"}
              </button>
            ))}
          </div>
        </div>
      </section>

      <button
        onClick={submit}
        className="mt-4 w-full rounded-2xl bg-success py-4 text-base font-extrabold text-success-foreground shadow-[var(--shadow-lift)] transition-opacity hover:opacity-90 flex items-center justify-center gap-2"
      >
        <span>Enviar Pedido por WhatsApp</span>
        <span>·</span>
        <span>{cop(total)}</span>
      </button>
      <button
        onClick={() => {
          clearCart();
          toast("Carrito vaciado");
        }}
        className="mt-2 w-full rounded-xl py-3 text-xs font-semibold text-muted-foreground"
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
        className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
      />
    </label>
  );
}
