import { collection, doc, setDoc, deleteDoc, onSnapshot, getDocs } from "firebase/firestore";
import { db } from "./firebase";
import {
  demoBusinesses,
  demoProducts,
  demoOrders,
  demoUsers,
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
 * Inicializa la base de datos con los datos iniciales si las colecciones están vacías
 */
export async function initializeFirestoreSeed() {
  try {
    const bizSnap = await getDocs(collection(db, BUSINESSES_COL));
    if (bizSnap.empty) {
      // Sembrar negocios
      for (const b of demoBusinesses) {
        await setDoc(doc(db, BUSINESSES_COL, b.id), b);
      }
      // Sembrar productos
      for (const p of demoProducts) {
        await setDoc(doc(db, PRODUCTS_COL, p.id), p);
      }
      // Sembrar pedidos iniciales
      for (const o of demoOrders) {
        await setDoc(doc(db, ORDERS_COL, o.id), o);
      }
      // Sembrar usuarios con roles
      for (const u of demoUsers) {
        await setDoc(doc(db, USERS_COL, u.id), u);
      }
      // Sembrar configuración
      await setDoc(doc(db, "config", "settings"), DEFAULT_APP_CONFIG);
    }
  } catch (err) {
    console.warn("Error sembrando datos iniciales en Firestore:", err);
  }
}

// Subscripciones en tiempo real
export function subscribeToBusinesses(callback: (data: Business[]) => void) {
  return onSnapshot(
    collection(db, BUSINESSES_COL),
    (snap) => {
      if (!snap.empty) {
        const list = snap.docs.map((d) => ({ ...d.data() }) as Business);
        callback(list);
      }
    },
    (err) => console.error("Error escuchando negocios:", err),
  );
}

export function subscribeToProducts(callback: (data: Product[]) => void) {
  return onSnapshot(
    collection(db, PRODUCTS_COL),
    (snap) => {
      if (!snap.empty) {
        const list = snap.docs.map((d) => ({ ...d.data() }) as Product);
        callback(list);
      }
    },
    (err) => console.error("Error escuchando productos:", err),
  );
}

export function subscribeToOrders(callback: (data: OrderLog[]) => void) {
  return onSnapshot(
    collection(db, ORDERS_COL),
    (snap) => {
      if (!snap.empty) {
        const list = snap.docs.map((d) => ({ ...d.data() }) as OrderLog);
        list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        callback(list);
      }
    },
    (err) => console.error("Error escuchando pedidos:", err),
  );
}

export function subscribeToUsers(callback: (data: AppUser[]) => void) {
  return onSnapshot(
    collection(db, USERS_COL),
    (snap) => {
      if (!snap.empty) {
        const list = snap.docs.map((d) => ({ ...d.data() }) as AppUser);
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
