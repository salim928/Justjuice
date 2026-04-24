"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const links = [
  { href: "#blends", label: "Blends" },
  { href: "#prices", label: "Prices" },
  { href: "#story", label: "Our Story" },
  { href: "#order", label: "Order" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "pt-2" : "pt-4"
      }`}
    >
      <div className="mx-auto max-w-6xl px-4">
        <div
          className={`flex items-center justify-between rounded-full border border-[var(--color-ink)]/10 px-5 py-2.5 backdrop-blur-md transition-all duration-300 ${
            scrolled
              ? "bg-[var(--color-cream)]/85 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.2)]"
              : "bg-[var(--color-cream)]/50"
          }`}
        >
          <Link href="#top" className="flex items-center gap-2">
            <span
              className="text-2xl leading-none"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Just
            </span>
            <span
              className="rounded-full bg-[var(--color-ink)] px-2.5 py-1 text-xl leading-none text-[var(--color-mango)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Juice
            </span>
          </Link>

          <nav className="hidden items-center gap-7 md:flex">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-[13px] font-medium tracking-wide text-[var(--color-ink-soft)] transition-colors hover:text-[var(--color-mango-deep)]"
                style={{ fontFamily: "var(--font-jakarta)" }}
              >
                {l.label}
              </a>
            ))}
          </nav>

          <a
            href="tel:+233508726113"
            className="group inline-flex items-center gap-2 rounded-full bg-[var(--color-ink)] px-4 py-2 text-xs font-medium text-[var(--color-cream)] transition-transform hover:scale-[1.03]"
            style={{ fontFamily: "var(--font-jakarta)" }}
          >
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--color-mango)]" />
            Call to order
          </a>
        </div>
      </div>
    </header>
  );
}
