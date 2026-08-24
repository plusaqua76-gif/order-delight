export type UserRole = "superadmin" | "restaurante" | "domiciliario";

export type AppUser = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phone?: string;
  businessId?: string; // Si es rol restaurante, a qué negocio está asociado
  active: boolean;
  createdAt: string;
};

export type PaymentMethod = "Efectivo" | "Nequi" | "Daviplata" | "Bancolombia";

export type DeliveryZoneType = "urbano" | "afueras";

export type Business = {
  id: string;
  slug: string;
  name: string;
  category: string;
  emoji: string;
  logoUrl?: string;
  color: string;
  schedule: string; // e.g. "7:00 am - 11:00 pm"
  openTime?: string; // "07:00"
  closeTime?: string; // "23:00"
  phone: string; // WhatsApp del restaurante para que reciba el pedido directo
  active: boolean;
  deliveryFee: number;
};

export type Product = {
  id: string;
  businessId: string;
  category: string;
  name: string;
  description: string;
  price: number;
  emoji: string;
  active: boolean;
};

export type OrderStatus = "recibido" | "en_preparacion" | "en_camino" | "entregado" | "cancelado";

export type OrderLog = {
  id: string;
  code: string;
  businessId: string;
  businessName: string;
  customerName: string;
  customerPhone: string;
  neighborhood: string;
  address: string;
  zone: DeliveryZoneType;
  payment: PaymentMethod;
  cashAmount?: number; // Con cuánto paga si es efectivo
  changeNeeded?: number; // Cuánto cambio necesita
  itemsSummary: string;
  subtotal: number;
  deliveryFee: number;
  total: number;
  status?: OrderStatus;
  assignedDriver?: string; // Nombre del domiciliario asignado desde central
  driverPhone?: string;
  createdAt: string; // ISO date string
};

export type AppConfig = {
  centralWhatsapp: string;
  centralSchedule: string;
  defaultUrbanDeliveryFee: number;
  defaultOutskirtsDeliveryFee: number;
  nequiNumber?: string;
  daviplataNumber?: string;
  bancolombiaNumber?: string;
};

export const DEFAULT_APP_CONFIG: AppConfig = {
  centralWhatsapp: "573125964567",
  centralSchedule: "7:00 am - 11:00 pm",
  defaultUrbanDeliveryFee: 6000,
  defaultOutskirtsDeliveryFee: 8000,
  nequiNumber: "312 596 4567",
  daviplataNumber: "312 596 4567",
  bancolombiaNumber: "Ahorros 123-456789-01",
};

export const DELIVERY_FEE = 6000;
export const DISPATCH_WHATSAPP = "573125964567";

export const initialSuperAdmin: AppUser = {
  id: "usr-superadmin",
  email: "plusaqua76@gmail.com",
  name: "Super Administrador",
  role: "superadmin",
  phone: "3125964567",
  active: true,
  createdAt: "2026-08-23T12:00:00.000Z",
};

export const demoUsers: AppUser[] = [initialSuperAdmin];

export const demoBusinesses: Business[] = [];

export const demoProducts: Product[] = [];

export const demoOrders: OrderLog[] = [];
