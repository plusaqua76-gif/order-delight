import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  demoBusinesses,
  demoProducts,
  type Business,
  type Product,
} from "@/data/demo";

export type CartItem = {
  productId: string;
  businessId: string;
  name: string;
  price: number;
  qty: number;
  note: string;
};

type StoreValue = {
  businesses: Business[];
  products: Product[];
  cart: CartItem[];
  cartBusiness: Business | null;
  subtotal: number;
  itemCount: number;
  saveBusiness: (b: Business) => void;
  removeBusiness: (id: string) => void;
  toggleBusiness: (id: string) => void;
  saveProduct: (p: Product) => void;
  removeProduct: (id: string) => void;
  addToCart: (item: CartItem) => void;
  setQty: (productId: string, qty: number) => void;
  setNote: (productId: string, note: string) => void;
  clearCart: () => void;
};

const StoreContext = createContext<StoreValue | null>(null);

const KEY = "nubex-demo-v1";

type Persisted = { businesses: Business[]; products: Product[]; cart: CartItem[] };

function load(): Persisted | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Persisted) : null;
  } catch {
    return null;
  }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [businesses, setBusinesses] = useState<Business[]>(demoBusinesses);
  const [products, setProducts] = useState<Product[]>(demoProducts);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const saved = load();
    if (saved) {
      setBusinesses(saved.businesses ?? demoBusinesses);
      setProducts(saved.products ?? demoProducts);
      setCart(saved.cart ?? []);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(KEY, JSON.stringify({ businesses, products, cart }));
  }, [hydrated, businesses, products, cart]);

  const value = useMemo<StoreValue>(() => {
    const subtotal = cart.reduce((acc, i) => acc + i.price * i.qty, 0);
    const cartBusiness = cart[0]
      ? (businesses.find((b) => b.id === cart[0]!.businessId) ?? null)
      : null;

    return {
      businesses,
      products,
      cart,
      cartBusiness,
      subtotal,
      itemCount: cart.reduce((acc, i) => acc + i.qty, 0),
      saveBusiness: (b) =>
        setBusinesses((prev) =>
          prev.some((x) => x.id === b.id) ? prev.map((x) => (x.id === b.id ? b : x)) : [...prev, b],
        ),
      removeBusiness: (id) => {
        setBusinesses((prev) => prev.filter((b) => b.id !== id));
        setProducts((prev) => prev.filter((p) => p.businessId !== id));
      },
      toggleBusiness: (id) =>
        setBusinesses((prev) => prev.map((b) => (b.id === id ? { ...b, active: !b.active } : b))),
      saveProduct: (p) =>
        setProducts((prev) =>
          prev.some((x) => x.id === p.id) ? prev.map((x) => (x.id === p.id ? p : x)) : [...prev, p],
        ),
      removeProduct: (id) => setProducts((prev) => prev.filter((p) => p.id !== id)),
      addToCart: (item) =>
        setCart((prev) => {
          const differentBusiness = prev[0] && prev[0].businessId !== item.businessId;
          const base = differentBusiness ? [] : prev;
          const existing = base.find((i) => i.productId === item.productId);
          if (existing) {
            return base.map((i) =>
              i.productId === item.productId
                ? { ...i, qty: i.qty + item.qty, note: item.note || i.note }
                : i,
            );
          }
          return [...base, item];
        }),
      setQty: (productId, qty) =>
        setCart((prev) =>
          qty <= 0
            ? prev.filter((i) => i.productId !== productId)
            : prev.map((i) => (i.productId === productId ? { ...i, qty } : i)),
        ),
      setNote: (productId, note) =>
        setCart((prev) => prev.map((i) => (i.productId === productId ? { ...i, note } : i))),
      clearCart: () => setCart([]),
    };
  }, [businesses, products, cart]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore debe usarse dentro de StoreProvider");
  return ctx;
}
