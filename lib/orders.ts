import "server-only";
import crypto from "node:crypto";
import { readJson, writeJson } from "./storage";
import { readCatalog, writeCatalog } from "./products";
import type {
  Catalog,
  Order,
  OrderItem,
  OrderSource,
  OrderStatus,
  OrderStore,
  Product,
} from "./types";

/**
 * Thrown when an incoming order can't be filled because one or more items
 * don't have enough stock. `shortages` lists each blocked item so the
 * customer sees exactly what's missing.
 */
export class InsufficientStockError extends Error {
  shortages: { productId: string; ml: number; name: string; available: number; requested: number }[];
  constructor(
    shortages: InsufficientStockError["shortages"]
  ) {
    const names = shortages
      .map((s) => `${s.name} ${s.ml}ml (only ${s.available} left)`)
      .join(", ");
    super(`Insufficient stock: ${names}`);
    this.name = "InsufficientStockError";
    this.shortages = shortages;
  }
}

function adjustCatalogStock(
  catalog: Catalog,
  adjustments: { productId: string; ml: number; delta: number }[]
): Catalog {
  const products: Product[] = catalog.products.map((p) => {
    const changes = adjustments.filter((a) => a.productId === p.id);
    if (changes.length === 0) return p;
    return {
      ...p,
      sizes: p.sizes.map((s) => {
        const match = changes.find((c) => c.ml === s.ml);
        if (!match) return s;
        return { ...s, qty: Math.max(0, s.qty + match.delta) };
      }),
    };
  });
  return { products, updatedAt: new Date().toISOString() };
}

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
  // Stock check + decrement happens before the order is persisted so an
  // overbooked order never lands in the list. Not truly atomic across the
  // two Redis keys — two simultaneous orders could oversell by 1 for the
  // last unit. Acceptable at juice-shop volume; the owner can cancel to
  // restore stock if it happens.
  const catalog = await readCatalog();

  const shortages: InsufficientStockError["shortages"] = [];
  const adjustments: { productId: string; ml: number; delta: number }[] = [];
  for (const it of input.items) {
    const product = catalog.products.find((p) => p.id === it.productId);
    const size = product?.sizes.find((s) => s.ml === it.ml);
    const available = size?.qty ?? 0;
    const productAvailable = product?.available !== false;
    if (!product || !size || !productAvailable || available < it.qty) {
      shortages.push({
        productId: it.productId,
        ml: it.ml,
        name: product?.name ?? it.name,
        available: productAvailable ? available : 0,
        requested: it.qty,
      });
    } else {
      adjustments.push({ productId: it.productId, ml: it.ml, delta: -it.qty });
    }
  }
  if (shortages.length > 0) {
    throw new InsufficientStockError(shortages);
  }

  const next = adjustCatalogStock(catalog, adjustments);
  await writeCatalog(next.products);

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
  const existing = store.orders.find((o) => o.id === id);
  if (!existing) return null;
  if (existing.status === status) return existing;

  // Cancellation returns stock; un-cancelling removes it again.
  const wasCancelled = existing.status === "cancelled";
  const nowCancelled = status === "cancelled";
  if (wasCancelled !== nowCancelled) {
    const catalog = await readCatalog();
    const adjustments = existing.items.map((it) => ({
      productId: it.productId,
      ml: it.ml,
      delta: nowCancelled ? it.qty : -it.qty,
    }));
    const next = adjustCatalogStock(catalog, adjustments);
    await writeCatalog(next.products);
  }

  const updated: Order = { ...existing, status };
  await writeStore(
    store.orders.map((o) => (o.id === id ? updated : o))
  );
  return updated;
}

export async function deleteOrder(id: string): Promise<boolean> {
  const store = await readStore();
  const target = store.orders.find((o) => o.id === id);
  if (!target) return false;

  // Deleting a non-cancelled order returns its units to stock so the
  // catalog doesn't drift from reality.
  if (target.status !== "cancelled") {
    const catalog = await readCatalog();
    const adjustments = target.items.map((it) => ({
      productId: it.productId,
      ml: it.ml,
      delta: it.qty,
    }));
    const next = adjustCatalogStock(catalog, adjustments);
    await writeCatalog(next.products);
  }

  await writeStore(store.orders.filter((o) => o.id !== id));
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
