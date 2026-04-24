"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronDown,
  ChevronUp,
  MessageCircle,
  Mail,
  Globe,
  Trash2,
  RefreshCw,
  Copy,
  Check,
} from "lucide-react";
import type { Order, OrderStatus } from "@/lib/types";
import { CURRENCY, OWNER_EMAIL, waLink } from "@/lib/config";

type FilterKey = "all" | OrderStatus;

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "new", label: "New" },
  { key: "confirmed", label: "Confirmed" },
  { key: "delivered", label: "Delivered" },
  { key: "cancelled", label: "Cancelled" },
];

const STATUS_TONE: Record<OrderStatus, string> = {
  new: "bg-[var(--color-mango)] text-[var(--color-ink)]",
  confirmed: "bg-[var(--color-leaf)] text-white",
  delivered: "bg-[var(--color-ink)] text-[var(--color-mango)]",
  cancelled: "bg-[var(--color-ink-soft)]/20 text-[var(--color-ink-soft)]",
};

const SOURCE_ICON = {
  whatsapp: MessageCircle,
  email: Mail,
  web: Globe,
} as const;

export default function OrdersList({
  initialOrders,
}: {
  initialOrders: Order[];
}) {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [filter, setFilter] = useState<FilterKey>("all");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (filter === "all") return orders;
    return orders.filter((o) => o.status === filter);
  }, [orders, filter]);

  const counts = useMemo(() => {
    const map: Record<FilterKey, number> = {
      all: orders.length,
      new: 0,
      confirmed: 0,
      delivered: 0,
      cancelled: 0,
    };
    for (const o of orders) map[o.status] += 1;
    return map;
  }, [orders]);

  const changeStatus = async (id: string, status: OrderStatus) => {
    const prev = orders;
    setOrders((os) => os.map((o) => (o.id === id ? { ...o, status } : o)));
    setPendingId(id);
    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Status update failed");
      router.refresh();
    } catch {
      setOrders(prev);
      alert("Could not update status. Try again.");
    } finally {
      setPendingId(null);
    }
  };

  const removeOrder = async (id: string) => {
    if (!confirm("Delete this order? This can’t be undone.")) return;
    const prev = orders;
    setOrders((os) => os.filter((o) => o.id !== id));
    setPendingId(id);
    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");
      router.refresh();
    } catch {
      setOrders(prev);
      alert("Could not delete. Try again.");
    } finally {
      setPendingId(null);
    }
  };

  const copyOrder = async (o: Order) => {
    const lines: string[] = [];
    lines.push(`Order ${o.id.slice(0, 8)}`);
    lines.push(new Date(o.createdAt).toLocaleString());
    if (o.customer.name) lines.push(`Name: ${o.customer.name}`);
    if (o.customer.area) lines.push(`Area: ${o.customer.area}`);
    if (o.customer.notes) lines.push(`Notes: ${o.customer.notes}`);
    lines.push("");
    for (const it of o.items) {
      lines.push(
        `• ${it.name} — ${it.ml}ml × ${it.qty} = ${CURRENCY}${(
          it.price * it.qty
        ).toFixed(2)}`
      );
    }
    lines.push("");
    lines.push(`Subtotal: ${CURRENCY}${o.subtotal.toFixed(2)}`);
    try {
      await navigator.clipboard.writeText(lines.join("\n"));
      setCopiedId(o.id);
      setTimeout(() => setCopiedId((c) => (c === o.id ? null : c)), 1600);
    } catch {
      alert("Could not copy.");
    }
  };

  return (
    <main className="pb-24">
      <section className="mx-auto max-w-5xl px-5 py-6 md:px-8 md:py-10">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p
              className="text-[10px] uppercase tracking-[0.3em] text-[var(--color-ink-soft)]"
              style={{ fontFamily: "var(--font-jakarta)" }}
            >
              Orders
            </p>
            <h1
              className="text-3xl leading-none md:text-4xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              All orders
            </h1>
          </div>
          <button
            type="button"
            onClick={() => router.refresh()}
            className="inline-flex items-center gap-1.5 rounded-full border-2 border-[var(--color-ink)] px-3 py-2 text-xs"
            style={{ fontFamily: "var(--font-jakarta)" }}
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Refresh
          </button>
        </div>

        <div
          className="mb-5 flex flex-wrap gap-2"
          style={{ fontFamily: "var(--font-jakarta)" }}
        >
          {FILTERS.map((f) => {
            const active = filter === f.key;
            return (
              <button
                key={f.key}
                type="button"
                onClick={() => setFilter(f.key)}
                className={`inline-flex items-center gap-1.5 rounded-full border-2 px-3 py-1.5 text-xs ${
                  active
                    ? "border-[var(--color-ink)] bg-[var(--color-ink)] text-[var(--color-mango)]"
                    : "border-[var(--color-ink)]/30 bg-white text-[var(--color-ink)] hover:border-[var(--color-ink)]"
                }`}
              >
                {f.label}
                <span
                  className={`rounded-full px-1.5 text-[10px] ${
                    active
                      ? "bg-[var(--color-mango)] text-[var(--color-ink)]"
                      : "bg-[var(--color-ink)]/10 text-[var(--color-ink-soft)]"
                  }`}
                >
                  {counts[f.key]}
                </span>
              </button>
            );
          })}
        </div>

        {filtered.length === 0 ? (
          <div
            className="rounded-[24px] border-2 border-dashed border-[var(--color-ink)]/30 bg-white p-10 text-center text-sm text-[var(--color-ink-soft)]"
            style={{ fontFamily: "var(--font-jakarta)" }}
          >
            No orders in this view yet.
          </div>
        ) : (
          <ul className="space-y-3">
            {filtered.map((o) => {
              const Icon = SOURCE_ICON[o.source] ?? Globe;
              const isOpen = expanded === o.id;
              const itemCount = o.items.reduce((n, it) => n + it.qty, 0);
              const busy = pendingId === o.id;

              return (
                <li
                  key={o.id}
                  className="rounded-2xl border-2 border-[var(--color-ink)] bg-white"
                >
                  <button
                    type="button"
                    onClick={() => setExpanded(isOpen ? null : o.id)}
                    className="flex w-full flex-wrap items-center gap-3 px-4 py-3 text-left md:px-5"
                    style={{ fontFamily: "var(--font-jakarta)" }}
                  >
                    <span
                      className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${STATUS_TONE[o.status]}`}
                      aria-hidden
                    >
                      <Icon className="h-3.5 w-3.5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-base text-[var(--color-ink)]">
                        {o.customer.name || "Unnamed customer"}
                        {o.customer.area && (
                          <span className="text-[var(--color-ink-soft)]">
                            {" "}
                            · {o.customer.area}
                          </span>
                        )}
                      </p>
                      <p className="truncate text-xs text-[var(--color-ink-soft)]">
                        {itemCount} item{itemCount === 1 ? "" : "s"} ·{" "}
                        {new Date(o.createdAt).toLocaleString()} · via{" "}
                        {o.source}
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-2.5 py-1 text-[10px] uppercase tracking-wider ${STATUS_TONE[o.status]}`}
                    >
                      {o.status}
                    </span>
                    <span className="text-base font-semibold text-[var(--color-ink)]">
                      {CURRENCY}
                      {o.subtotal.toFixed(2)}
                    </span>
                    {isOpen ? (
                      <ChevronUp className="h-4 w-4 text-[var(--color-ink-soft)]" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-[var(--color-ink-soft)]" />
                    )}
                  </button>

                  {isOpen && (
                    <div
                      className="border-t-2 border-[var(--color-ink)]/10 px-4 py-4 md:px-5"
                      style={{ fontFamily: "var(--font-jakarta)" }}
                    >
                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <p className="text-[10px] uppercase tracking-[0.25em] text-[var(--color-ink-soft)]">
                            Customer
                          </p>
                          <p className="mt-1 text-sm">
                            {o.customer.name || "—"}
                          </p>
                          {o.customer.area && (
                            <p className="text-xs text-[var(--color-ink-soft)]">
                              {o.customer.area}
                            </p>
                          )}
                          {o.customer.notes && (
                            <p className="mt-2 rounded-lg bg-[var(--color-cream-deep)] p-2 text-xs text-[var(--color-ink)]">
                              “{o.customer.notes}”
                            </p>
                          )}
                        </div>

                        <div>
                          <p className="text-[10px] uppercase tracking-[0.25em] text-[var(--color-ink-soft)]">
                            Items
                          </p>
                          <ul className="mt-1 space-y-1 text-sm">
                            {o.items.map((it, idx) => (
                              <li
                                key={`${o.id}-${idx}`}
                                className="flex justify-between gap-3"
                              >
                                <span className="truncate">
                                  {it.name}{" "}
                                  <span className="text-[var(--color-ink-soft)]">
                                    {it.ml}ml × {it.qty}
                                  </span>
                                </span>
                                <span className="shrink-0 font-semibold">
                                  {CURRENCY}
                                  {(it.price * it.qty).toFixed(2)}
                                </span>
                              </li>
                            ))}
                          </ul>
                          <div className="mt-3 flex items-center justify-between border-t border-[var(--color-ink)]/10 pt-2 text-sm">
                            <span className="text-[var(--color-ink-soft)]">
                              Subtotal
                            </span>
                            <span className="text-base font-semibold">
                              {CURRENCY}
                              {o.subtotal.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-5 flex flex-wrap items-center gap-2">
                        <label className="inline-flex items-center gap-2 text-xs text-[var(--color-ink-soft)]">
                          Status
                          <select
                            value={o.status}
                            disabled={busy}
                            onChange={(e) =>
                              changeStatus(
                                o.id,
                                e.target.value as OrderStatus
                              )
                            }
                            className="rounded-full border-2 border-[var(--color-ink)] bg-white px-3 py-1.5 text-xs text-[var(--color-ink)] outline-none"
                          >
                            <option value="new">New</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </label>

                        <button
                          type="button"
                          onClick={() => copyOrder(o)}
                          className="inline-flex items-center gap-1.5 rounded-full border-2 border-[var(--color-ink)]/30 px-3 py-1.5 text-xs hover:border-[var(--color-ink)]"
                        >
                          {copiedId === o.id ? (
                            <>
                              <Check className="h-3.5 w-3.5" /> Copied
                            </>
                          ) : (
                            <>
                              <Copy className="h-3.5 w-3.5" /> Copy summary
                            </>
                          )}
                        </button>

                        {o.source === "whatsapp" && (
                          <a
                            href={waLink(
                              `Hi ${o.customer.name || "there"}, quick note about your JustJuice order…`
                            )}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-full bg-[#25D366] px-3 py-1.5 text-xs text-white"
                          >
                            <MessageCircle className="h-3.5 w-3.5" />
                            Reply on WhatsApp
                          </a>
                        )}
                        {o.source === "email" && (
                          <a
                            href={`mailto:${OWNER_EMAIL}?subject=${encodeURIComponent(
                              `Re: Your JustJuice order`
                            )}`}
                            className="inline-flex items-center gap-1.5 rounded-full border-2 border-[var(--color-ink)] px-3 py-1.5 text-xs"
                          >
                            <Mail className="h-3.5 w-3.5" />
                            Email reply
                          </a>
                        )}

                        <button
                          type="button"
                          onClick={() => removeOrder(o.id)}
                          disabled={busy}
                          className="ml-auto inline-flex items-center gap-1.5 rounded-full border-2 border-[var(--color-hibiscus)]/40 px-3 py-1.5 text-xs text-[var(--color-hibiscus)] hover:border-[var(--color-hibiscus)] disabled:opacity-50"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </main>
  );
}
