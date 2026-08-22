export type Business = {
  id: string;
  slug: string;
  name: string;
  category: string;
  emoji: string;
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

export const DELIVERY_FEE = 6000;
export const DISPATCH_WHATSAPP = "573125964567";

export const demoBusinesses: Business[] = [
  {
    id: "b1",
    slug: "burger-pitalito",
    name: "Burger Pitalito",
    category: "Hamburguesas",
    emoji: "🍔",
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
  p("p1", "b1", "Hamburguesas", "Clásica Nubex", "Carne 150g, queso, lechuga, tomate y salsa de la casa", 18000, "🍔"),
  p("p2", "b1", "Hamburguesas", "Doble Tocineta", "Doble carne, doble queso y tocineta crocante", 26000, "🥓"),
  p("p3", "b1", "Hamburguesas", "Pollo Crispy", "Pechuga apanada, queso y salsa ranch", 21000, "🍗"),
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
  p("p17", "b4", "Arepas", "Arepa de la casa", "Carne desmechada, queso y maíz tierno", 14000, "🫓"),
  p("p18", "b4", "Perros", "Perro sencillo", "Salchicha americana con papitas", 10000, "🌭"),
  p("p19", "b4", "Bebidas", "Avena helada", "Vaso 12 oz", 5000, "🥛"),
];
