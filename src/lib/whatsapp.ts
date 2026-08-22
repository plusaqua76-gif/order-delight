import { cop } from "./format";
import type { CartItem } from "./store";
import type { Business } from "@/data/demo";

export type CheckoutData = {
  name: string;
  address: string;
  neighborhood: string;
  phone: string;
  payment: "Efectivo" | "Nequi" | "Daviplata";
  reference: string;
};

export const orderCode = () =>
  `NBX-${new Date().toISOString().slice(2, 10).replace(/-/g, "")}-${Math.floor(
    Math.random() * 9000 + 1000,
  )}`;

export function buildOrderMessage(opts: {
  code: string;
  business: Business;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  data: CheckoutData;
}) {
  const { code, business, items, subtotal, deliveryFee, data } = opts;
  const total = subtotal + deliveryFee;
  const lines = items.map(
    (i) =>
      `• ${i.qty} x ${i.name} — ${cop(i.price * i.qty)}${i.note ? `\n   ↳ Nota: ${i.note}` : ""}`,
  );

  return [
    `*🛵 NUEVO PEDIDO — DOMICILIOS NUBEX*`,
    `Pedido: *${code}*`,
    `Ciudad: Pitalito, Huila`,
    ``,
    `*🏪 Negocio:* ${business.name} (${business.category})`,
    ``,
    `*🧾 Detalle del pedido*`,
    ...lines,
    ``,
    `Subtotal productos: ${cop(subtotal)}`,
    `Domicilio: ${cop(deliveryFee)}`,
    `*TOTAL A PAGAR: ${cop(total)}*`,
    ``,
    `*👤 Cliente*`,
    `Nombre: ${data.name}`,
    `Teléfono: ${data.phone}`,
    `Dirección: ${data.address}`,
    `Barrio: ${data.neighborhood}`,
    data.reference ? `Referencia: ${data.reference}` : ``,
    ``,
    `*💳 Método de pago:* ${data.payment}`,
    ``,
    `_Enviado automáticamente desde la web de Domicilios Nubex_`,
  ]
    .filter((l) => l !== undefined)
    .join("\n");
}

export const waLink = (phone: string, message: string) =>
  `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
