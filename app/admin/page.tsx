import Link from "next/link";
import {
  ArrowRight,
  ClipboardList,
  Clock,
  PackageCheck,
  Receipt,
  TrendingUp,
} from "lucide-react";
import { listOrders, orderStats } from "@/lib/orders";
import { CURRENCY } from "@/lib/config";

export const dynamic = "force-dynamic";

const statusLabel: Record<string, string> = {
  new: "New",
  confirmed: "Confirmed",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const statusTone: Record<string, string> = {
  new: "bg-[var(--color-mango)] text-[var(--color-ink)]",
  confirmed: "bg-[var(--color-leaf)] text-white",
  delivered: "bg-[var(--color-ink)] text-[var(--color-mango)]",
  cancelled: "bg-[var(--color-ink-soft)]/20 text-[var(--color-ink-soft)]",
};

export default async function AdminOverviewPage() {
  const orders = await listOrders();
  const stats = orderStats(orders);
  const recent = orders.slice(0, 6);

  const cards = [
    {
      label: "Orders today",
      value: stats.today.toString(),
      sub: `${CURRENCY}${stats.todayRevenue.toFixed(2)} in sales`,
      icon: Receipt,
      tone: "bg-[var(--color-mango)] text-[var(--color-ink)]",
    },
    {
      label: "Last 7 days",
      value: stats.week.toString(),
      sub: `${CURRENCY}${stats.weekRevenue.toFixed(2)} in sales`,
      icon: TrendingUp,
      tone: "bg-[var(--color-leaf)] text-white",
    },
    {
      label: "Pending",
      value: stats.pending.toString(),
      sub: "Awaiting confirm / delivery",
      icon: Clock,
      tone: "bg-[var(--color-coral)] text-white",
    },
    {
      label: "Delivered",
      value: stats.delivered.toString(),
      sub: "Total fulfilled",
      icon: PackageCheck,
      tone: "bg-[var(--color-ink)] text-[var(--color-mango)]",
    },
  ];

  return (
    <main className="pb-24">
      <section className="mx-auto max-w-5xl px-5 py-6 md:px-8 md:py-10">
        <div className="mb-6">
          <p
            className="text-[10px] uppercase tracking-[0.3em] text-[var(--color-ink-soft)]"
            style={{ fontFamily: "var(--font-jakarta)" }}
          >
            Dashboard
          </p>
          <h1
            className="text-3xl leading-none md:text-4xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Overview
          </h1>
          <p
            className="mt-2 text-sm text-[var(--color-ink-soft)]"
            style={{ fontFamily: "var(--font-jakarta)" }}
          >
            {stats.total === 0
              ? "No orders yet — they’ll appear here as soon as customers check out."
              : `${stats.total} order${stats.total === 1 ? "" : "s"} all-time.`}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {cards.map((c) => {
            const Icon = c.icon;
            return (
              <div
                key={c.label}
                className="rounded-2xl border-2 border-[var(--color-ink)] bg-white p-4"
              >
                <div
                  className={`mb-3 inline-flex h-9 w-9 items-center justify-center rounded-full ${c.tone}`}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <p
                  className="text-[10px] uppercase tracking-[0.22em] text-[var(--color-ink-soft)]"
                  style={{ fontFamily: "var(--font-jakarta)" }}
                >
                  {c.label}
                </p>
                <p
                  className="mt-1 text-3xl leading-none"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {c.value}
                </p>
                <p
                  className="mt-1 truncate text-xs text-[var(--color-ink-soft)]"
                  style={{ fontFamily: "var(--font-jakarta)" }}
                >
                  {c.sub}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-8 rounded-[24px] border-2 border-[var(--color-ink)] bg-white p-5 md:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p
                className="text-[10px] uppercase tracking-[0.3em] text-[var(--color-ink-soft)]"
                style={{ fontFamily: "var(--font-jakarta)" }}
              >
                Recent orders
              </p>
              <h2
                className="text-2xl leading-none"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Latest from customers
              </h2>
            </div>
            <Link
              href="/admin/orders"
              className="inline-flex items-center gap-1.5 rounded-full border-2 border-[var(--color-ink)] bg-[var(--color-ink)] px-4 py-2 text-xs text-[var(--color-mango)]"
              style={{ fontFamily: "var(--font-jakarta)" }}
            >
              <ClipboardList className="h-3.5 w-3.5" />
              View all
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {recent.length === 0 ? (
            <div
              className="mt-6 rounded-2xl border border-dashed border-[var(--color-ink)]/30 p-10 text-center text-sm text-[var(--color-ink-soft)]"
              style={{ fontFamily: "var(--font-jakarta)" }}
            >
              Nothing here yet. When a customer sends an order via WhatsApp or
              email, it’ll land here automatically.
            </div>
          ) : (
            <ul
              className="mt-5 divide-y divide-[var(--color-ink)]/10"
              style={{ fontFamily: "var(--font-jakarta)" }}
            >
              {recent.map((o) => {
                const itemCount = o.items.reduce((n, it) => n + it.qty, 0);
                return (
                  <li
                    key={o.id}
                    className="flex flex-wrap items-center justify-between gap-3 py-3 text-sm"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-base text-[var(--color-ink)]">
                        {o.customer.name || "Unnamed customer"}
                      </p>
                      <p className="truncate text-xs text-[var(--color-ink-soft)]">
                        {itemCount} item{itemCount === 1 ? "" : "s"} ·{" "}
                        {new Date(o.createdAt).toLocaleString()} · via{" "}
                        {o.source}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`rounded-full px-2.5 py-1 text-[10px] uppercase tracking-wider ${statusTone[o.status]}`}
                      >
                        {statusLabel[o.status]}
                      </span>
                      <span className="text-base font-semibold text-[var(--color-ink)]">
                        {CURRENCY}
                        {o.subtotal.toFixed(2)}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </section>
    </main>
  );
}
