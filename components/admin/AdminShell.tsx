"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  ClipboardList,
  Package,
  LogOut,
  ExternalLink,
} from "lucide-react";

const nav = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/orders", label: "Orders", icon: ClipboardList },
  { href: "/admin/products", label: "Products & stock", icon: Package },
];

export default function AdminShell({
  children,
  pendingOrderCount,
}: {
  children: React.ReactNode;
  pendingOrderCount: number;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-[var(--color-cream)] md:grid md:grid-cols-[260px_1fr]">
      <aside className="border-b-2 border-[var(--color-ink)] bg-[var(--color-ink)] text-[var(--color-cream)] md:sticky md:top-0 md:h-screen md:border-b-0 md:border-r-2">
        <div className="flex h-full flex-col p-5">
          <Link
            href="/admin"
            className="flex items-center gap-2 pb-6"
            style={{ fontFamily: "var(--font-display)" }}
          >
            <span className="text-2xl leading-none">Just</span>
            <span className="rounded-full bg-[var(--color-mango)] px-2.5 py-1 text-xl leading-none text-[var(--color-ink)]">
              Juice
            </span>
            <span className="ml-1 text-[10px] uppercase tracking-[0.3em] text-[var(--color-cream)]/70" style={{ fontFamily: "var(--font-jakarta)" }}>
              admin
            </span>
          </Link>

          <nav className="flex flex-row gap-1 md:flex-col md:gap-1">
            {nav.map((item) => {
              const active =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(item.href);
              const Icon = item.icon;
              const showBadge =
                item.href === "/admin/orders" && pendingOrderCount > 0;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex flex-1 items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm transition-colors md:flex-none ${
                    active
                      ? "bg-[var(--color-mango)] text-[var(--color-ink)]"
                      : "text-[var(--color-cream)]/80 hover:bg-white/10"
                  }`}
                  style={{ fontFamily: "var(--font-jakarta)" }}
                >
                  <Icon className="h-4 w-4" />
                  <span className="flex-1">{item.label}</span>
                  {showBadge && (
                    <span
                      className="grid min-w-[22px] place-items-center rounded-full bg-[var(--color-coral)] px-1.5 text-[10px] text-white"
                      style={{ fontFamily: "var(--font-jakarta)" }}
                    >
                      {pendingOrderCount}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto hidden space-y-2 pt-8 md:block">
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 rounded-xl border border-[var(--color-cream)]/15 px-3 py-2.5 text-sm text-[var(--color-cream)]/80 hover:bg-white/5"
              style={{ fontFamily: "var(--font-jakarta)" }}
            >
              <ExternalLink className="h-4 w-4" />
              View the site
            </a>
            <button
              type="button"
              onClick={logout}
              className="flex w-full items-center gap-2 rounded-xl border border-[var(--color-cream)]/15 px-3 py-2.5 text-sm text-[var(--color-cream)]/80 hover:bg-white/5"
              style={{ fontFamily: "var(--font-jakarta)" }}
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </div>

          <button
            type="button"
            onClick={logout}
            className="ml-auto md:hidden"
            aria-label="Sign out"
            style={{ fontFamily: "var(--font-jakarta)" }}
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </aside>

      <div className="min-w-0 pb-16">{children}</div>
    </div>
  );
}
