import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  demoBusinesses,
  demoProducts,
  demoOrders,
  demoUsers,
  initialSuperAdmin,
  DEFAULT_APP_CONFIG,
  type Business,
  type Product,
  type OrderLog,
  type AppConfig,
  type AppUser,
} from "@/data/demo";
import {
  initializeFirestoreSeed,
  dbResetToAdminOnly,
  subscribeToBusinesses,
  subscribeToProducts,
  subscribeToOrders,
  subscribeToUsers,
  subscribeToConfig,
  dbSaveBusiness,
  dbRemoveBusiness,
  dbSaveProduct,
  dbRemoveProduct,
  dbRecordOrder,
  dbUpdateOrder,
  dbRemoveOrder,
  dbSaveUser,
  dbRemoveUser,
  dbUpdateConfig,
} from "./firestoreService";

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
  orders: OrderLog[];
  users: AppUser[];
  currentUser: AppUser | null;
  config: AppConfig;
  cart: CartItem[];
  cartBusiness: Business | null;
  subtotal: number;
  itemCount: number;
  isSyncing: boolean;
  loginUser: (email: string) => { success: boolean; message: string };
  logoutUser: () => void;
  setCurrentUserDirectly: (user: AppUser | null) => void;
  resetDatabaseToZero: () => Promise<void>;
  saveUser: (u: AppUser) => void;
  removeUser: (id: string) => void;
  updateConfig: (cfg: Partial<AppConfig>) => void;
  saveBusiness: (b: Business) => void;
  removeBusiness: (id: string) => void;
  toggleBusiness: (id: string) => void;
  saveProduct: (p: Product) => void;
  removeProduct: (id: string) => void;
  recordOrder: (o: OrderLog) => void;
  updateOrder: (id: string, update: Partial<OrderLog>) => void;
  removeOrder: (id: string) => void;
  addToCart: (item: CartItem) => void;
  setQty: (productId: string, qty: number) => void;
  setNote: (productId: string, note: string) => void;
  clearCart: () => void;
};

const StoreContext = createContext<StoreValue | null>(null);

const CART_STORAGE_KEY = "nubex-cart-v1";
const AUTH_STORAGE_KEY = "nubex-auth-user-v1";

function loadCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

function loadSavedUser(): AppUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AppUser) : null;
  } catch {
    return null;
  }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [businesses, setBusinesses] = useState<Business[]>(demoBusinesses);
  const [products, setProducts] = useState<Product[]>(demoProducts);
  const [orders, setOrders] = useState<OrderLog[]>(demoOrders);
  const [users, setUsers] = useState<AppUser[]>(demoUsers);
  const [currentUser, setCurrentUser] = useState<AppUser | null>(
    () => loadSavedUser() || initialSuperAdmin,
  );
  const [config, setConfig] = useState<AppConfig>(DEFAULT_APP_CONFIG);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isSyncing, setIsSyncing] = useState(true);

  // Inicializar y sincronizar con Firestore
  useEffect(() => {
    setCart(loadCart());
    const saved = loadSavedUser();
    if (saved) {
      setCurrentUser(saved);
    } else {
      setCurrentUser(initialSuperAdmin);
    }

    // Inicializar semillas en Firestore
    initializeFirestoreSeed().finally(() => {
      setIsSyncing(false);
    });

    // Suscribir en tiempo real a los cambios en Firestore
    const unsubBiz = subscribeToBusinesses((data) => {
      // Si recibimos datos residuales de demo como 'b1', limpiamos automáticamente
      if (data.some((b) => b.id === "b1" || b.id === "b2")) {
        dbResetToAdminOnly().catch(console.error);
        return;
      }
      setBusinesses(data);
    });

    const unsubProd = subscribeToProducts((data) => {
      if (data.some((p) => p.id === "p1-1" || p.id === "p2-1")) {
        return;
      }
      setProducts(data);
    });

    const unsubOrders = subscribeToOrders((data) => {
      if (data.some((o) => o.id === "ord-1" || o.id === "ord-2")) {
        return;
      }
      setOrders(data);
    });

    const unsubUsers = subscribeToUsers((data) => {
      const sanitized = data.length > 0 ? data : [initialSuperAdmin];
      setUsers(sanitized);

      setCurrentUser((prev) => {
        if (!prev) return initialSuperAdmin;
        const fresh = sanitized.find(
          (u) => u.id === prev.id || u.email.toLowerCase() === prev.email.toLowerCase(),
        );
        return fresh ?? prev;
      });
    });

    const unsubConfig = subscribeToConfig((data) => setConfig(data));

    return () => {
      unsubBiz();
      unsubProd();
      unsubOrders();
      unsubUsers();
      unsubConfig();
    };
  }, []);

  // Guardar carrito localmente
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    }
  }, [cart]);

  // Guardar sesión de usuario localmente
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (currentUser) {
        window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(currentUser));
      } else {
        window.localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    }
  }, [currentUser]);

  const value = useMemo<StoreValue>(() => {
    const subtotal = cart.reduce((acc, i) => acc + i.price * i.qty, 0);
    const cartBusiness = cart[0]
      ? (businesses.find((b) => b.id === cart[0]!.businessId) ?? null)
      : null;

    return {
      businesses,
      products,
      orders,
      users,
      currentUser,
      config,
      cart,
      cartBusiness,
      subtotal,
      itemCount: cart.reduce((acc, i) => acc + i.qty, 0),
      isSyncing,
      loginUser: (email: string) => {
        const clean = email.trim().toLowerCase();
        const found = users.find((u) => u.email.toLowerCase() === clean);
        if (found) {
          if (!found.active) {
            return {
              success: false,
              message: "Este usuario ha sido desactivado por la administración central.",
            };
          }
          setCurrentUser(found);
          return { success: true, message: `Bienvenido, ${found.name}` };
        }
        return {
          success: false,
          message: "Correo no registrado en el sistema. Contacta al Super Administrador.",
        };
      },
      logoutUser: () => {
        setCurrentUser(null);
      },
      setCurrentUserDirectly: (u) => {
        setCurrentUser(u);
      },
      resetDatabaseToZero: async () => {
        setIsSyncing(true);
        await dbResetToAdminOnly();
        setBusinesses([]);
        setProducts([]);
        setOrders([]);
        setUsers([initialSuperAdmin]);
        setCurrentUser(initialSuperAdmin);
        setCart([]);
        setIsSyncing(false);
      },
      saveUser: (u) => {
        setUsers((prev) =>
          prev.some((x) => x.id === u.id) ? prev.map((x) => (x.id === u.id ? u : x)) : [...prev, u],
        );
        dbSaveUser(u);
      },
      removeUser: (id) => {
        setUsers((prev) => prev.filter((u) => u.id !== id));
        dbRemoveUser(id);
      },
      updateConfig: (cfg) => {
        setConfig((prev) => ({ ...prev, ...cfg }));
        dbUpdateConfig(cfg);
      },
      saveBusiness: (b) => {
        setBusinesses((prev) =>
          prev.some((x) => x.id === b.id) ? prev.map((x) => (x.id === b.id ? b : x)) : [...prev, b],
        );
        dbSaveBusiness(b);
      },
      removeBusiness: (id) => {
        setBusinesses((prev) => prev.filter((b) => b.id !== id));
        setProducts((prev) => prev.filter((p) => p.businessId !== id));
        dbRemoveBusiness(id);
      },
      toggleBusiness: (id) => {
        const target = businesses.find((b) => b.id === id);
        if (target) {
          const updated = { ...target, active: !target.active };
          setBusinesses((prev) => prev.map((b) => (b.id === id ? updated : b)));
          dbSaveBusiness(updated);
        }
      },
      saveProduct: (p) => {
        setProducts((prev) =>
          prev.some((x) => x.id === p.id) ? prev.map((x) => (x.id === p.id ? p : x)) : [...prev, p],
        );
        dbSaveProduct(p);
      },
      removeProduct: (id) => {
        setProducts((prev) => prev.filter((p) => p.businessId !== id));
        dbRemoveProduct(id);
      },
      recordOrder: (o) => {
        setOrders((prev) => [o, ...prev]);
        dbRecordOrder(o);
      },
      updateOrder: (id, update) => {
        setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, ...update } : o)));
        dbUpdateOrder(id, update);
      },
      removeOrder: (id) => {
        setOrders((prev) => prev.filter((o) => o.id !== id));
        dbRemoveOrder(id);
      },
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
  }, [businesses, products, orders, users, currentUser, config, cart, isSyncing]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore debe usarse dentro de StoreProvider");
  return ctx;
}
