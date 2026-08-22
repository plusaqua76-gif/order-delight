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
      `  ▫️ ${i.qty}x ${i.name} — ${cop(i.price * i.qty)}${i.note ? `\n     ↳ 📝 Nota: ${i.note}` : ""}`,
  );

  return [
    `━━━━━━━━━━━━━━━━━━━━━━━━━━`,
    `☁️ 🛵 *DOMICILIOS NUBEX* · Pitalito`,
    `⚡ _Plataforma Oficial de Domicilios_`,
    `━━━━━━━━━━━━━━━━━━━━━━━━━━`,
    `📌 *PEDIDO:* *${code}*`,
    ``,
    `🏪 *RESTAURANTE EMISOR:*`,
    `*${business.emoji || "🍽️"} ${business.name}*`,
    `🏷️ Categoría: ${business.category}`,
    business.logoUrl ? `🖼️ Logo Restaurante: ${business.logoUrl}` : undefined,
    ``,
    `━━━━━━━━━━━━━━━━━━━━━━━━━━`,
    `🧾 *DETALLE DE PRODUCTOS:*`,
    ...lines,
    ``,
    `💰 Subtotal: ${cop(subtotal)}`,
    `🛵 Domicilio: ${cop(deliveryFee)}`,
    `💵 *TOTAL A PAGAR: ${cop(total)}*`,
    `━━━━━━━━━━━━━━━━━━━━━━━━━━`,
    ``,
    `👤 *DATOS DEL CLIENTE:*`,
    `• Nombre: ${data.name}`,
    `• Teléfono: ${data.phone}`,
    `• Dirección: ${data.address}`,
    `• Barrio: ${data.neighborhood}`,
    data.reference ? `• Referencia: ${data.reference}` : undefined,
    ``,
    `💳 *MÉTODO DE PAGO:* ${data.payment}`,
    ``,
    `━━━━━━━━━━━━━━━━━━━━━━━━━━`,
    `🛵 _Despacho gestionado por Domicilios Nubex Pitalito_`,
  ]
    .filter((l): l is string => l !== undefined)
    .join("\n");
}

export const waLink = (phone: string, message: string) =>
  `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
