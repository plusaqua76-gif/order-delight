export type Business = {
  id: string;
  slug: string;
  name: string;
  category: string;
  emoji: string;
  logoUrl?: string;
  color: string;
  schedule: string;
  phone: string;
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

export type OrderLog = {
  id: string;
  code: string;
  businessId: string;
  businessName: string;
  customerName: string;
  customerPhone: string;
  neighborhood: string;
  address: string;
  payment: "Efectivo" | "Nequi" | "Daviplata";
  itemsSummary: string;
  subtotal: number;
  deliveryFee: number;
  total: number;
  createdAt: string; // ISO date string
};

export const DELIVERY_FEE = 6000;
export const DISPATCH_WHATSAPP = "573125964567";

// Helper to generate seed dates relative to current date
const daysAgoIso = (days: number, hoursOffset: number = 0) => {
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(d.getHours() - hoursOffset);
  return d.toISOString();
};

export const demoOrders: OrderLog[] = [
  {
    id: "ord-1",
    code: "NBX-260822-4821",
    businessId: "b1",
    businessName: "Burger Pitalito",
    customerName: "Carlos Méndez",
    customerPhone: "3104567890",
    neighborhood: "Centro",
    address: "Cra 4 # 7-20",
    payment: "Nequi",
    itemsSummary: "2 x Doble Tocineta, 1 x Papas a la francesa",
    subtotal: 60000,
    deliveryFee: 6000,
    total: 66000,
    createdAt: daysAgoIso(0, 2),
  },
  {
    id: "ord-2",
    code: "NBX-260821-3912",
    businessId: "b2",
    businessName: "Pollo Dorado Huila",
    customerName: "Mariana Rojas",
    customerPhone: "3159876543",
    neighborhood: "Aguablanca",
    address: "Calle 10 # 3-15",
    payment: "Efectivo",
    itemsSummary: "1 x Pollo entero, 1 x Jugo natural en agua",
    subtotal: 61500,
    deliveryFee: 6000,
    total: 67500,
    createdAt: daysAgoIso(1, 4),
  },
  {
    id: "ord-3",
    code: "NBX-260820-8192",
    businessId: "b3",
    businessName: "Pizzería La Esquina",
    customerName: "Andrés Silva",
    customerPhone: "3123456789",
    neighborhood: "Valvanera",
    address: "Cl 5 # 12-45",
    payment: "Daviplata",
    itemsSummary: "1 x Pizza Pepperoni grande, 1 x Gaseosa 1.5L",
    subtotal: 54500,
    deliveryFee: 6000,
    total: 60500,
    createdAt: daysAgoIso(3, 1),
  },
  {
    id: "ord-4",
    code: "NBX-260818-1923",
    businessId: "b1",
    businessName: "Burger Pitalito",
    customerName: "Luisa Fernanda",
    customerPhone: "3201234567",
    neighborhood: "Los Pinos",
    address: "Cra 2 # 15-08",
    payment: "Nequi",
    itemsSummary: "1 x Clásica Nubex, 1 x Limonada natural",
    subtotal: 24000,
    deliveryFee: 6000,
    total: 30000,
    createdAt: daysAgoIso(7, 3),
  },
  {
    id: "ord-5",
    code: "NBX-260815-5128",
    businessId: "b4",
    businessName: "Arepas del Sur",
    customerName: "Jorge Ortiz",
    customerPhone: "3189998877",
    neighborhood: "Cálamo",
    address: "Calle 8 # 20-14",
    payment: "Efectivo",
    itemsSummary: "2 x Arepa de la casa, 2 x Avena helada",
    subtotal: 38000,
    deliveryFee: 6000,
    total: 44000,
    createdAt: daysAgoIso(12, 5),
  },
  {
    id: "ord-6",
    code: "NBX-260810-7412",
    businessId: "b2",
    businessName: "Pollo Dorado Huila",
    customerName: "Camila Sterling",
    customerPhone: "3112233445",
    neighborhood: "Libertadores",
    address: "Cra 6 # 9-50",
    payment: "Nequi",
    itemsSummary: "1 x 1/2 pollo, 1 x Porción de papa criolla",
    subtotal: 36000,
    deliveryFee: 6000,
    total: 42000,
    createdAt: daysAgoIso(18, 2),
  },
  {
    id: "ord-7",
    code: "NBX-260805-6291",
    businessId: "b3",
    businessName: "Pizzería La Esquina",
    customerName: "Felipe Garzón",
    customerPhone: "3145566778",
    neighborhood: "Centro",
    address: "Calle 6 # 5-22",
    payment: "Efectivo",
    itemsSummary: "2 x Pizza Hawaiana mediana, 1 x Pan de ajo",
    subtotal: 80000,
    deliveryFee: 6000,
    total: 86000,
    createdAt: daysAgoIso(24, 6),
  },
  {
    id: "ord-8",
    code: "NBX-260728-3401",
    businessId: "b1",
    businessName: "Burger Pitalito",
    customerName: "Diana Morales",
    customerPhone: "3178899001",
    neighborhood: "Paraíso",
    address: "Mz 4 Cs 12",
    payment: "Daviplata",
    itemsSummary: "3 x Pollo Crispy, 3 x Gaseosa 400ml",
    subtotal: 76500,
    deliveryFee: 6000,
    total: 82500,
    createdAt: daysAgoIso(38, 4), // Older than 1 month for testing date filter
  },
];

export const demoBusinesses: Business[] = [
  {
    id: "b1",
    slug: "burger-pitalito",
    name: "Burger Pitalito",
    category: "Hamburguesas",
    emoji: "🍔",
    logoUrl:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&auto=format&fit=crop&q=80",
    color: "var(--brand-1)",
    schedule: "5:00 p.m. - 11:30 p.m.",
    phone: "573001112233",
    active: true,
    deliveryFee: DELIVERY_FEE,
  },
  {
    id: "b2",
    slug: "pollo-dorado-huila",
    name: "Pollo Dorado Huila",
    category: "Asados",
    emoji: "🍗",
    logoUrl:
      "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=200&auto=format&fit=crop&q=80",
    color: "var(--brand-2)",
    schedule: "11:00 a.m. - 9:00 p.m.",
    phone: "573002223344",
    active: true,
    deliveryFee: DELIVERY_FEE,
  },
  {
    id: "b3",
    slug: "pizzeria-la-esquina",
    name: "Pizzería La Esquina",
    category: "Pizzas",
    emoji: "🍕",
    logoUrl:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200&auto=format&fit=crop&q=80",
    color: "var(--brand-3)",
    schedule: "4:00 p.m. - 11:00 p.m.",
    phone: "573003334455",
    active: true,
    deliveryFee: DELIVERY_FEE,
  },
  {
    id: "b4",
    slug: "arepas-del-sur",
    name: "Arepas del Sur",
    category: "Comidas rápidas",
    emoji: "🌮",
    logoUrl:
      "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=200&auto=format&fit=crop&q=80",
    color: "var(--brand-4)",
    schedule: "6:00 p.m. - 12:00 a.m.",
    phone: "573004445566",
    active: true,
    deliveryFee: DELIVERY_FEE,
  },
  {
    id: "b5",
    slug: "cafe-nubex",
    name: "Café Nubex",
    category: "Cafetería",
    emoji: "☕",
    logoUrl:
      "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=200&auto=format&fit=crop&q=80",
    color: "var(--brand-2)",
    schedule: "7:00 a.m. - 8:00 p.m.",
    phone: "573005556677",
    active: false,
    deliveryFee: DELIVERY_FEE,
  },
];

const p = (
  id: string,
  businessId: string,
  category: string,
  name: string,
  description: string,
  price: number,
  emoji: string,
): Product => ({ id, businessId, category, name, description, price, emoji, active: true });

export const demoProducts: Product[] = [
  // Burger Pitalito
  p(
    "p1",
    "b1",
    "Hamburguesas",
    "Clásica Nubex",
    "Carne 150g, queso, lechuga, tomate y salsa de la casa",
    18000,
    "🍔",
  ),
  p(
    "p2",
    "b1",
    "Hamburguesas",
    "Doble Tocineta",
    "Doble carne, doble queso y tocineta crocante",
    26000,
    "🥓",
  ),
  p(
    "p3",
    "b1",
    "Hamburguesas",
    "Pollo Crispy",
    "Pechuga apanada, queso y salsa ranch",
    21000,
    "🍗",
  ),
  p("p4", "b1", "Adicionales", "Papas a la francesa", "Porción personal con salsas", 8000, "🍟"),
  p("p5", "b1", "Adicionales", "Queso extra", "Loncha de queso mozzarella", 3000, "🧀"),
  p("p6", "b1", "Bebidas", "Gaseosa 400ml", "Personal fría", 4500, "🥤"),
  p("p7", "b1", "Bebidas", "Limonada natural", "Vaso 16 oz", 6000, "🍋"),
  // Pollo Dorado
  p("p8", "b2", "Asados", "1/4 de pollo", "Con papa criolla y ensalada", 16000, "🍗"),
  p("p9", "b2", "Asados", "1/2 pollo", "Con papa criolla, arepa y ensalada", 29000, "🍗"),
  p("p10", "b2", "Asados", "Pollo entero", "Ideal para 4 personas", 55000, "🍗"),
  p("p11", "b2", "Adicionales", "Porción de papa criolla", "Porción generosa", 7000, "🥔"),
  p("p12", "b2", "Bebidas", "Jugo natural en agua", "Mora, lulo o maracuyá", 6500, "🧃"),
  // Pizzería
  p("p13", "b3", "Pizzas", "Pizza Hawaiana mediana", "Jamón, piña y mozzarella", 34000, "🍕"),
  p("p14", "b3", "Pizzas", "Pizza Pepperoni grande", "Doble pepperoni y orégano", 46000, "🍕"),
  p("p15", "b3", "Adicionales", "Pan de ajo", "6 unidades con salsa", 12000, "🥖"),
  p("p16", "b3", "Bebidas", "Gaseosa 1.5L", "Botella familiar", 8500, "🥤"),
  // Arepas del Sur
  p(
    "p17",
    "b4",
    "Arepas",
    "Arepa de la casa",
    "Carne desmechada, queso y maíz tierno",
    14000,
    "🫓",
  ),
  p("p18", "b4", "Perros", "Perro sencillo", "Salchicha americana con papitas", 10000, "🌭"),
  p("p19", "b4", "Bebidas", "Avena helada", "Vaso 12 oz", 5000, "🥛"),
];
