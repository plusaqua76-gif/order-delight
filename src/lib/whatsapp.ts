import { cop } from "./format";
import type { CartItem } from "./store";
import type { Business, PaymentMethod, DeliveryZoneType } from "@/data/demo";

export type CheckoutData = {
  name: string;
  address: string;
  neighborhood: string;
  phone: string;
  zone: DeliveryZoneType;
  manualDeliveryFee?: number;
  payment: PaymentMethod;
  cashAmount?: number;
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
  recipientType: "central" | "restaurante";
}) {
  const { code, business, items, subtotal, deliveryFee, data, recipientType } = opts;
  const total = subtotal + deliveryFee;
  const changeNeeded =
    data.payment === "Efectivo" && data.cashAmount && data.cashAmount > total
      ? data.cashAmount - total
      : 0;

  const lines = items.map(
    (i) =>
      `  ▫️ ${i.qty}x ${i.name} — ${cop(i.price * i.qty)}${i.note ? `\n     ↳ 📝 Nota: ${i.note}` : ""}`,
  );

  const headerTitle =
    recipientType === "central"
      ? `🛵 *CENTRAL DOMICILIOS NUBEX* · Pitalito\n⚡ _Asignar domiciliario & Coordinar despacho_`
      : `👨‍🍳 *ORDEN PARA COCINA / RESTAURANTE*\n⚡ _Alistar pedido para despacho Nubex_`;

  return [
    `━━━━━━━━━━━━━━━━━━━━━━━━━━`,
    headerTitle,
    `━━━━━━━━━━━━━━━━━━━━━━━━━━`,
    `📌 *PEDIDO:* *${code}*`,
    ``,
    `🏪 *RESTAURANTE:*`,
    `*${business.emoji || "🍽️"} ${business.name}*`,
    `🏷️ Categoría: ${business.category}`,
    business.phone ? `📞 WhatsApp Restaurante: ${business.phone}` : undefined,
    ``,
    `━━━━━━━━━━━━━━━━━━━━━━━━━━`,
    `🧾 *PRODUCTOS A ALISTAR:*`,
    ...lines,
    ``,
    `💰 Subtotal comida: ${cop(subtotal)}`,
    `🛵 Domicilio (${data.zone === "afueras" ? "Afueras / Especial" : "Casco Urbano"}): ${cop(deliveryFee)}`,
    `💵 *TOTAL A COBRAR: ${cop(total)}*`,
    `━━━━━━━━━━━━━━━━━━━━━━━━━━`,
    ``,
    `📍 *DATOS DE ENTREGA:*`,
    `• Cliente: ${data.name}`,
    `• Teléfono: ${data.phone}`,
    `• Dirección: ${data.address}`,
    `• Barrio/Sector: ${data.neighborhood} (${data.zone === "afueras" ? "Afueras" : "Urbano"})`,
    data.reference ? `• Punto de referencia: ${data.reference}` : undefined,
    ``,
    `💳 *MÉTODO DE PAGO:* ${data.payment}`,
    data.payment === "Efectivo" && data.cashAmount
      ? `💵 Paga con: ${cop(data.cashAmount)}${changeNeeded > 0 ? ` (Llevar cambio de ${cop(changeNeeded)})` : " (Pago exacto)"}`
      : undefined,
    ``,
    `━━━━━━━━━━━━━━━━━━━━━━━━━━`,
    recipientType === "central"
      ? `🚨 *ACCIÓN CENTRAL:* Notificar al restaurante para cocción y asignar domiciliario.`
      : `👨‍🍳 *ACCIÓN RESTAURANTE:* Empezar preparación. Un domiciliario Nubex recogerá el pedido.`,
  ]
    .filter((l): l is string => l !== undefined)
    .join("\n");
}

export const waLink = (phone: string, message: string) => {
  const cleanPhone = phone.replace(/\D/g, "");
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
};
