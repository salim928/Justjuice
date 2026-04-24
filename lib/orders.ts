import "server-only";
import crypto from "node:crypto";
import { readJson, writeJson } from "./storage";
import type {
  Order,
  OrderItem,
  OrderSource,
  OrderStatus,
  OrderStore,
} from "./types";

const KEY = "orders";
const EMPTY: OrderStore = { orders: [], updatedAt: new Date(0).toISOString() };

const VALID_STATUSES: OrderStatus[] = [
  "new",
  "confirmed",
  "delivered",
  "cancelled",
];
const VALID_SOURCES: OrderSource[] = ["whatsapp", "email", "web"];

async function readStore(): Promise<OrderStore> {
  const store = await readJson<OrderStore>(KEY, EMPTY);
  if (!Array.isArray(store.orders)) {
    return { orders: [], updatedAt: new Date().toISOString() };
  }
  return store;
}

async function writeStore(orders: Order[]): Promise<OrderStore> {
  const store: OrderStore = {
    orders,
    updatedAt: new Date().toISOString(),
  };
  await writeJson<OrderStore>(KEY, store);
  return store;
}

export async function listOrders(): Promise<Order[]> {
  const store = await readStore();
  return [...store.orders].sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt)
  );
}

export async function getOrder(id: string): Promise<Order | null> {
  const store = await readStore();
  return store.orders.find((o) => o.id === id) ?? null;
}

export function sanitizeIncomingOrder(input: unknown): {
  customer: Order["customer"];
  items: OrderItem[];
  source: OrderSource;
} {
  if (typeof input !== "object" || input === null) {
    throw new Error("Order payload must be an object");
  }
  const obj = input as Record<string, unknown>;

  const rawSource = obj.source;
  const source: OrderSource = VALID_SOURCES.includes(rawSource as OrderSource)
    ? (rawSource as OrderSource)
    : "web";

  const rawCustomer =
    typeof obj.customer === "object" && obj.customer !== null
      ? (obj.customer as Record<string, unknown>)
      : {};
  const customer: Order["customer"] = {
    name: String(rawCustomer.name ?? "").slice(0, 120).trim(),
    area: String(rawCustomer.area ?? "").slice(0, 200).trim(),
    notes: String(rawCustomer.notes ?? "").slice(0, 500).trim(),
  };

  const rawItems = obj.items;
  if (!Array.isArray(rawItems) || rawItems.length === 0) {
    throw new Error("Order must contain at least one item");
  }
  const items: OrderItem[] = rawItems.map((raw, idx) => {
    if (typeof raw !== "object" || raw === null) {
      throw new Error(`Item ${idx} is not an object`);
    }
    const it = raw as Record<string, unknown>;
    const ml = Number(it.ml);
    const price = Number(it.price);
    const qty = Number(it.qty);
    if (!Number.isFinite(ml) || ml <= 0) {
      throw new Error(`Item ${idx}: invalid ml`);
    }
    if (!Number.isFinite(price) || price < 0) {
      throw new Error(`Item ${idx}: invalid price`);
    }
    if (!Number.isFinite(qty) || qty <= 0 || qty > 500) {
      throw new Error(`Item ${idx}: invalid qty`);
    }
    return {
      productId: String(it.productId ?? "").slice(0, 64),
      name: String(it.name ?? "").slice(0, 200),
      ml: Math.round(ml),
      price: Math.round(price * 100) / 100,
      qty: Math.round(qty),
    };
  });
  if (items.length > 50) {
    throw new Error("Too many items");
  }

  return { customer, items, source };
}

export async function createOrder(input: {
  customer: Order["customer"];
  items: OrderItem[];
  source: OrderSource;
}): Promise<Order> {
  const store = await readStore();
  const subtotal =
    Math.round(
      input.items.reduce((sum, it) => sum + it.price * it.qty, 0) * 100
    ) / 100;
  const order: Order = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    status: "new",
    source: input.source,
    customer: input.customer,
    items: input.items,
    subtotal,
  };
  await writeStore([order, ...store.orders]);
  return order;
}

export async function updateOrderStatus(
  id: string,
  status: OrderStatus
): Promise<Order | null> {
  if (!VALID_STATUSES.includes(status)) {
    throw new Error("Invalid status");
  }
  const store = await readStore();
  let updated: Order | null = null;
  const next = store.orders.map((o) => {
    if (o.id !== id) return o;
    updated = { ...o, status };
    return updated;
  });
  if (!updated) return null;
  await writeStore(next);
  return updated;
}

export async function deleteOrder(id: string): Promise<boolean> {
  const store = await readStore();
  const next = store.orders.filter((o) => o.id !== id);
  if (next.length === store.orders.length) return false;
  await writeStore(next);
  return true;
}

export function orderStats(orders: Order[]) {
  const now = new Date();
  const startOfDay = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  ).getTime();
  const sevenDaysAgo = now.getTime() - 7 * 24 * 60 * 60 * 1000;

  let today = 0;
  let todayRevenue = 0;
  let week = 0;
  let weekRevenue = 0;
  let pending = 0;
  let delivered = 0;

  for (const o of orders) {
    const t = new Date(o.createdAt).getTime();
    if (t >= startOfDay) {
      today += 1;
      if (o.status !== "cancelled") todayRevenue += o.subtotal;
    }
    if (t >= sevenDaysAgo) {
      week += 1;
      if (o.status !== "cancelled") weekRevenue += o.subtotal;
    }
    if (o.status === "new" || o.status === "confirmed") pending += 1;
    if (o.status === "delivered") delivered += 1;
  }

  return {
    total: orders.length,
    today,
    todayRevenue: Math.round(todayRevenue * 100) / 100,
    week,
    weekRevenue: Math.round(weekRevenue * 100) / 100,
    pending,
    delivered,
  };
}
