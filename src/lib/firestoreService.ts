import { collection, doc, setDoc, deleteDoc, onSnapshot, getDocs } from "firebase/firestore";
import { db } from "./firebase";
import {
  initialSuperAdmin,
  DEFAULT_APP_CONFIG,
  type Business,
  type Product,
  type OrderLog,
  type AppConfig,
  type AppUser,
} from "@/data/demo";

// Colecciones en Firestore
const BUSINESSES_COL = "businesses";
const PRODUCTS_COL = "products";
const ORDERS_COL = "orders";
const USERS_COL = "users";

/**
 * Inicializa la base de datos dejando solo el Super Administrador y configuración base
 */
export async function initializeFirestoreSeed() {
  try {
    // Asegurar que exista el Super Administrador
    await setDoc(doc(db, USERS_COL, initialSuperAdmin.id), initialSuperAdmin, { merge: true });

    // Asegurar que exista la configuración básica
    await setDoc(doc(db, "config", "settings"), DEFAULT_APP_CONFIG, { merge: true });
  } catch (err) {
    console.warn("Error inicializando superadministrador en Firestore:", err);
  }
}

/**
 * Limpia totalmente la base de datos de Firestore dejando la empresa en cero
 * y conservando únicamente el rol de Super Administrador.
 */
export async function dbResetToAdminOnly(): Promise<void> {
  try {
    // 1. Borrar todos los negocios
    const bizSnap = await getDocs(collection(db, BUSINESSES_COL));
    for (const d of bizSnap.docs) {
      await deleteDoc(d.ref);
    }

    // 2. Borrar todos los productos
    const prodSnap = await getDocs(collection(db, PRODUCTS_COL));
    for (const d of prodSnap.docs) {
      await deleteDoc(d.ref);
    }

    // 3. Borrar todos los pedidos
    const ordersSnap = await getDocs(collection(db, ORDERS_COL));
    for (const d of ordersSnap.docs) {
      await deleteDoc(d.ref);
    }

    // 4. Borrar todos los usuarios excepto el superadministrador
    const usersSnap = await getDocs(collection(db, USERS_COL));
    for (const d of usersSnap.docs) {
      if (d.id !== initialSuperAdmin.id) {
        await deleteDoc(d.ref);
      }
    }

    // 5. Garantizar superadmin activo
    await setDoc(doc(db, USERS_COL, initialSuperAdmin.id), initialSuperAdmin, { merge: true });

    // 6. Restablecer configuración estándar
    await setDoc(doc(db, "config", "settings"), DEFAULT_APP_CONFIG, { merge: true });
  } catch (err) {
    console.error("Error al restablecer la base de datos:", err);
    throw err;
  }
}

// Subscripciones en tiempo real
export function subscribeToBusinesses(callback: (data: Business[]) => void) {
  return onSnapshot(
    collection(db, BUSINESSES_COL),
    (snap) => {
      const list = snap.docs.map((d) => ({ ...d.data() }) as Business);
      callback(list);
    },
    (err) => console.error("Error escuchando negocios:", err),
  );
}

export function subscribeToProducts(callback: (data: Product[]) => void) {
  return onSnapshot(
    collection(db, PRODUCTS_COL),
    (snap) => {
      const list = snap.docs.map((d) => ({ ...d.data() }) as Product);
      callback(list);
    },
    (err) => console.error("Error escuchando productos:", err),
  );
}

export function subscribeToOrders(callback: (data: OrderLog[]) => void) {
  return onSnapshot(
    collection(db, ORDERS_COL),
    (snap) => {
      const list = snap.docs.map((d) => ({ ...d.data() }) as OrderLog);
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      callback(list);
    },
    (err) => console.error("Error escuchando pedidos:", err),
  );
}

export function subscribeToUsers(callback: (data: AppUser[]) => void) {
  return onSnapshot(
    collection(db, USERS_COL),
    (snap) => {
      const list = snap.docs.map((d) => ({ ...d.data() }) as AppUser);
      // Si la lista está vacía, al menos proveer el superadmin
      if (list.length === 0) {
        callback([initialSuperAdmin]);
      } else {
        callback(list);
      }
    },
    (err) => console.error("Error escuchando usuarios:", err),
  );
}

export function subscribeToConfig(callback: (data: AppConfig) => void) {
  return onSnapshot(
    doc(db, "config", "settings"),
    (snap) => {
      if (snap.exists()) {
        callback(snap.data() as AppConfig);
      }
    },
    (err) => console.error("Error escuchando configuración:", err),
  );
}

// Operaciones de escritura persistentes en Firestore
export async function dbSaveBusiness(b: Business) {
  await setDoc(doc(db, BUSINESSES_COL, b.id), b, { merge: true });
}

export async function dbRemoveBusiness(id: string) {
  await deleteDoc(doc(db, BUSINESSES_COL, id));
}

export async function dbSaveProduct(p: Product) {
  await setDoc(doc(db, PRODUCTS_COL, p.id), p, { merge: true });
}

export async function dbRemoveProduct(id: string) {
  await deleteDoc(doc(db, PRODUCTS_COL, id));
}

export async function dbRecordOrder(o: OrderLog) {
  await setDoc(doc(db, ORDERS_COL, o.id), o);
}

export async function dbUpdateOrder(id: string, update: Partial<OrderLog>) {
  await setDoc(doc(db, ORDERS_COL, id), update, { merge: true });
}

export async function dbRemoveOrder(id: string) {
  await deleteDoc(doc(db, ORDERS_COL, id));
}

export async function dbSaveUser(u: AppUser) {
  await setDoc(doc(db, USERS_COL, u.id), u, { merge: true });
}

export async function dbRemoveUser(id: string) {
  await deleteDoc(doc(db, USERS_COL, id));
}

export async function dbUpdateConfig(cfg: Partial<AppConfig>) {
  await setDoc(doc(db, "config", "settings"), cfg, { merge: true });
}
