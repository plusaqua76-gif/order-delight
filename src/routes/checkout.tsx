import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { useStore } from "@/lib/store";
import { cop } from "@/lib/format";
import { DELIVERY_FEE, DISPATCH_WHATSAPP } from "@/data/demo";
import { buildOrderMessage, orderCode, waLink, type CheckoutData } from "@/lib/whatsapp";

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
    businessName: string;
    waUrl: string;
    total: number;
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
      businessName: cartBusiness.name,
      waUrl,
      total,
    });
    toast.success(`¡Pedido ${code} enviado! Tu carrito ha sido limpiado.`);
  };

  if (sentOrder) {
    return (
      <main className="mx-auto max-w-md px-4 py-16 text-center">
        <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-success/20 text-3xl">
          ✅
        </div>
        <h1 className="mt-4 text-2xl font-extrabold">¡Pedido Enviado!</h1>
        <p className="mt-1 text-sm font-semibold text-primary">Código: {sentOrder.code}</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Tu pedido en <strong>{sentOrder.businessName}</strong> por valor de{" "}
          <strong>{cop(sentOrder.total)}</strong> fue enviado a la central de despacho por WhatsApp.
        </p>
        <div className="mt-6 flex flex-col gap-3">
          <Link
            to="/"
            onClick={() => setSentOrder(null)}
            className="inline-block rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground shadow-sm transition-opacity hover:opacity-90"
          >
            Hacer un nuevo pedido
          </Link>
          <a
            href={sentOrder.waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block rounded-xl border border-border bg-card px-5 py-2.5 text-xs font-semibold text-foreground transition-colors hover:bg-muted"
          >
            Reabrir WhatsApp del pedido
          </a>
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
      <p className="text-sm text-muted-foreground">
        Pedido en <strong>{cartBusiness?.name}</strong>
      </p>

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
        className="mt-4 w-full rounded-2xl bg-success py-4 text-base font-extrabold text-success-foreground shadow-[var(--shadow-lift)] transition-opacity hover:opacity-90"
      >
        Pedir por WhatsApp · {cop(total)}
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
