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

export const demoUsers: AppUser[] = [
  initialSuperAdmin,
  {
    id: "usr-rest-1",
    email: "burgerpitalito@nubex.app",
    name: "Administrador Burger Pitalito",
    role: "restaurante",
    businessId: "b1",
    phone: "3158901234",
    active: true,
    createdAt: "2026-08-23T12:00:00.000Z",
  },
  {
    id: "usr-dom-1",
    email: "fabian.domicilios@nubex.app",
    name: "Fabián Rojas (Domiciliario 01)",
    role: "domiciliario",
    phone: "3119876543",
    active: true,
    createdAt: "2026-08-23T12:00:00.000Z",
  },
  {
    id: "usr-dom-2",
    email: "camilo.domicilios@nubex.app",
    name: "Camilo Torres (Domiciliario 02)",
    role: "domiciliario",
    phone: "3145678901",
    active: true,
    createdAt: "2026-08-23T12:00:00.000Z",
  },
];

export const demoBusinesses: Business[] = [
  {
    id: "b1",
    slug: "burger-pitalito",
    name: "Burger Pitalito",
    category: "Hamburguesas & Grill",
    emoji: "🍔",
    logoUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80",
    color: "#f97316",
    schedule: "11:30 am - 10:30 pm",
    openTime: "11:30",
    closeTime: "22:30",
    phone: "573158901234",
    active: true,
    deliveryFee: 6000,
  },
  {
    id: "b2",
    slug: "pizzeria-laboyana",
    name: "Pizzería La Laboyana",
    category: "Pizzas Artesanales",
    emoji: "🍕",
    logoUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
    color: "#ef4444",
    schedule: "12:00 pm - 11:00 pm",
    openTime: "12:00",
    closeTime: "23:00",
    phone: "573167890123",
    active: true,
    deliveryFee: 6000,
  },
  {
    id: "b3",
    slug: "asados-del-valle",
    name: "Asados Del Valle",
    category: "Carnes & Parrilla",
    emoji: "🥩",
    logoUrl: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&q=80",
    color: "#b91c1c",
    schedule: "11:00 am - 9:30 pm",
    openTime: "11:00",
    closeTime: "21:30",
    phone: "573176543210",
    active: true,
    deliveryFee: 6000,
  },
  {
    id: "b4",
    slug: "el-buen-cafe",
    name: "El Buen Café Laboyano",
    category: "Cafetería & Repostería",
    emoji: "☕",
    logoUrl: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400&q=80",
    color: "#854d0e",
    schedule: "7:00 am - 8:00 pm",
    openTime: "07:00",
    closeTime: "20:00",
    phone: "573187654321",
    active: true,
    deliveryFee: 6000,
  },
  {
    id: "b5",
    slug: "pollo-sabroso",
    name: "Pollo Sabroso Real",
    category: "Pollo Broaster & Asado",
    emoji: "🍗",
    logoUrl: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=400&q=80",
    color: "#eab308",
    schedule: "11:00 am - 10:00 pm",
    openTime: "11:00",
    closeTime: "22:00",
    phone: "573198765432",
    active: true,
    deliveryFee: 6000,
  },
];

export const demoProducts: Product[] = [
  // Burger Pitalito
  {
    id: "p1-1",
    businessId: "b1",
    category: "Hamburguesas",
    name: "Hamburguesa Doble Tocineta",
    description:
      "Doble carne artesanal (300g), queso cheddar, tocineta ahumada crujiente y salsa especial de la casa.",
    price: 26000,
    emoji: "🍔",
    active: true,
  },
  {
    id: "p1-2",
    businessId: "b1",
    category: "Hamburguesas",
    name: "Burger Clásica Laboyana",
    description:
      "150g de carne de res, queso mozzarella, lechuga fresca, tomate, ripio de papa y salsa de piña.",
    price: 19000,
    emoji: "🍔",
    active: true,
  },
  {
    id: "p1-3",
    businessId: "b1",
    category: "Acompañamientos",
    name: "Papas Rústicas con Queso y Tocineta",
    description:
      "Porción generosa de papas con piel sazonadas, bañadas en queso cheddar fundido y bits de tocineta.",
    price: 14000,
    emoji: "🍟",
    active: true,
  },
  {
    id: "p1-4",
    businessId: "b1",
    category: "Bebidas",
    name: "Gaseosa Postobón 400ml",
    description: "Manzana, Colombiana o Pepsi bien fría.",
    price: 4500,
    emoji: "🥤",
    active: true,
  },

  // Pizzería La Laboyana
  {
    id: "p2-1",
    businessId: "b2",
    category: "Pizzas Medianas",
    name: "Pizza Hawaiana Especial (Mediana)",
    description:
      "Masa madurada 48h, pasta de tomate natural, doble queso mozzarella, jamón seleccionado y piña caramelizada.",
    price: 32000,
    emoji: "🍕",
    active: true,
  },
  {
    id: "p2-2",
    businessId: "b2",
    category: "Pizzas Medianas",
    name: "Pizza Carnes Bravas (Mediana)",
    description:
      "Pepperoni, tocineta, carne molida especiada y salchicha italiana con toque de orégano fresco.",
    price: 36000,
    emoji: "🍕",
    active: true,
  },
  {
    id: "p2-3",
    businessId: "b2",
    category: "Entradas",
    name: "Palitroques de Ajo y Queso (6 unidades)",
    description:
      "Deliciosos bastones de masa crocante rellenos de queso con mantequilla de ajo y perejil.",
    price: 13000,
    emoji: "🥖",
    active: true,
  },

  // Asados Del Valle
  {
    id: "p3-1",
    businessId: "b3",
    category: "Parrilla",
    name: "Punta de Anca (350g)",
    description:
      "Corte jugoso a la brasa con papa salada, plátano asado con queso y ensalada de la casa.",
    price: 38000,
    emoji: "🥩",
    active: true,
  },
  {
    id: "p3-2",
    businessId: "b3",
    category: "Parrilla",
    name: "Pechuga a la Plancha Gratinada",
    description:
      "Filete de pechuga tierna cubierta con queso mozzarella fundido, arepa boyacense y guacamole.",
    price: 29000,
    emoji: "🍗",
    active: true,
  },
  {
    id: "p3-3",
    businessId: "b3",
    category: "Parrilla",
    name: "Picada Mixta Familiar (2 personas)",
    description:
      "Carne de res, cerdo, chicharrón crocante, chorizo de la casa, papa criolla, patacones y ají laboyano.",
    price: 52000,
    emoji: "🍲",
    active: true,
  },

  // El Buen Café Laboyano
  {
    id: "p4-1",
    businessId: "b4",
    category: "Bebidas Calientes",
    name: "Cappuccino Especial Huilense",
    description: "Café de origen Pitalito con leche texturizada cremosa y toque sutil de canela.",
    price: 7500,
    emoji: "☕",
    active: true,
  },
  {
    id: "p4-2",
    businessId: "b4",
    category: "Repostería",
    name: "Tarta de Queso con Frutos Rojos",
    description:
      "Porción de tarta horneada suave acompañada de reducción artesanal de mora y agraz.",
    price: 11000,
    emoji: "🍰",
    active: true,
  },
  {
    id: "p4-3",
    businessId: "b4",
    category: "Desayunos & Tardes",
    name: "Croissant de Jamón y Queso Horneado",
    description: "Hojaldre 100% mantequilla recién horneado y doradito.",
    price: 8000,
    emoji: "🥐",
    active: true,
  },

  // Pollo Sabroso Real
  {
    id: "p5-1",
    businessId: "b5",
    category: "Pollo Broaster",
    name: "Combo Medio Pollo Broaster",
    description:
      "4 presas crujientes y jugosas, porción de papas a la francesa, 2 arepitas y miel.",
    price: 24000,
    emoji: "🍗",
    active: true,
  },
  {
    id: "p5-2",
    businessId: "b5",
    category: "Pollo Asado",
    name: "Combo Pollo Asado Entero Familiar",
    description:
      "Pollo asado con adobo tradicional, 8 papas saladas, 4 arepas, plátano maduro y gaseosa 1.5L.",
    price: 42000,
    emoji: "🍗",
    active: true,
  },
];

export const demoOrders: OrderLog[] = [
  {
    id: "ord-1",
    code: "NBX-260823-4821",
    businessId: "b1",
    businessName: "Burger Pitalito",
    customerName: "Carlos Méndez",
    customerPhone: "3104567890",
    neighborhood: "Centro",
    address: "Cra 4 # 7-20",
    zone: "urbano",
    payment: "Nequi",
    itemsSummary: "2 x Doble Tocineta, 1 x Papas a la francesa",
    subtotal: 60000,
    deliveryFee: 6000,
    total: 66000,
    status: "entregado",
    assignedDriver: "Fabián Rojas (Domiciliario 01)",
    driverPhone: "3119876543",
    createdAt: "2026-08-23T19:30:00.000Z",
  },
  {
    id: "ord-2",
    code: "NBX-260823-4822",
    businessId: "b2",
    businessName: "Pizzería La Laboyana",
    customerName: "Valentina Gómez",
    customerPhone: "3159871122",
    neighborhood: "Nogales",
    address: "Calle 10 # 3-45",
    zone: "urbano",
    payment: "Efectivo",
    cashAmount: 50000,
    changeNeeded: 8000,
    itemsSummary: "1 x Pizza Carnes Bravas (Mediana), 1 x Palitroques",
    subtotal: 42000,
    deliveryFee: 6000,
    total: 48000,
    status: "en_camino",
    assignedDriver: "Camilo Torres (Domiciliario 02)",
    driverPhone: "3145678901",
    createdAt: "2026-08-23T20:15:00.000Z",
  },
  {
    id: "ord-3",
    code: "NBX-260823-4823",
    businessId: "b3",
    businessName: "Asados Del Valle",
    customerName: "Jorge Ramírez",
    customerPhone: "3208765432",
    neighborhood: "Cálamo",
    address: "Vía Cálamo Km 1 Casa 4",
    zone: "afueras",
    payment: "Bancolombia",
    itemsSummary: "1 x Picada Mixta Familiar (2 personas)",
    subtotal: 52000,
    deliveryFee: 8000,
    total: 60000,
    status: "en_preparacion",
    assignedDriver: "Fabián Rojas (Domiciliario 01)",
    driverPhone: "3119876543",
    createdAt: "2026-08-23T20:45:00.000Z",
  },
  {
    id: "ord-4",
    code: "NBX-260823-4824",
    businessId: "b5",
    businessName: "Pollo Sabroso Real",
    customerName: "Diana Marcela Ortiz",
    customerPhone: "3134567812",
    neighborhood: "Venecia",
    address: "Manzana C Casa 12",
    zone: "urbano",
    payment: "Daviplata",
    itemsSummary: "1 x Combo Pollo Asado Entero Familiar",
    subtotal: 42000,
    deliveryFee: 6000,
    total: 48000,
    status: "recibido",
    createdAt: "2026-08-23T21:05:00.000Z",
  },
];
