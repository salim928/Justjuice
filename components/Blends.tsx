"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { Plus } from "lucide-react";
import BottleIllustration from "./BottleIllustration";
import { useCart } from "./CartContext";
import { CURRENCY } from "@/lib/config";
import type { Product } from "@/lib/types";

function featuredSize(p: Product) {
  const available = p.sizes.filter((s) => s.qty > 0);
  if (available.length === 0) return null;
  return available.reduce((a, b) => (a.ml >= b.ml ? a : b));
}

export default function Blends({ products }: { products: Product[] }) {
  const { addItem } = useCart();

  return (
    <section
      id="blends"
      className="relative bg-[var(--color-cream)] py-20 md:py-28"
    >
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="mb-14 flex flex-col items-start gap-4 md:mb-20 md:flex-row md:items-end md:justify-between">
          <div>
            <p
              className="mb-2 text-xs uppercase tracking-[0.3em] text-[var(--color-leaf-deep)]"
              style={{ fontFamily: "var(--font-jakarta)" }}
            >
              ✱ Our blends
            </p>
            <h2
              className="text-6xl leading-[0.9] text-[var(--color-ink)] md:text-8xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Five bottles.<br />
              <span className="squiggle">One promise.</span>
            </h2>
          </div>
          <p
            className="max-w-sm text-[17px] leading-snug text-[var(--color-ink-soft)]"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Every blend is built around whole fruit, cold-pressed the same
            morning it's bottled. The colors you see are the ingredients.
            That's the whole trick.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {products.map((b, idx) => {
            const feature = featuredSize(b);
            const soldOut = !b.available || feature === null;
            return (
              <motion.article
                key={b.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{
                  duration: 0.7,
                  delay: idx * 0.08,
                  ease: [0.2, 0.8, 0.2, 1],
                }}
                className={`bottle-card grain group relative flex flex-col overflow-hidden rounded-[28px] border-2 border-[var(--color-ink)] p-7 ${
                  idx === 3 ? "md:col-span-2 lg:col-span-1" : ""
                }`}
                style={{
                  background: b.bg,
                  color: b.text,
                  opacity: soldOut ? 0.72 : 1,
                }}
              >
                <div className="tape -top-2 left-6 rotate-[-4deg]" />

                {soldOut ? (
                  <span
                    className="absolute right-5 top-5 z-20 rounded-full border-2 border-[var(--color-ink)] bg-white/90 px-3 py-1 text-[10px] uppercase tracking-[0.25em] text-[var(--color-ink)]"
                    style={{ fontFamily: "var(--font-jakarta)" }}
                  >
                    Sold out today
                  </span>
                ) : feature && feature.qty <= 3 ? (
                  <span
                    className="absolute right-5 top-5 z-20 rounded-full border-2 border-[var(--color-ink)] bg-[var(--color-coral)] px-3 py-1 text-[10px] uppercase tracking-[0.25em] text-white"
                    style={{ fontFamily: "var(--font-jakarta)" }}
                  >
                    Only {feature.qty} left
                  </span>
                ) : null}

                <div className="relative z-10 flex items-start justify-between gap-4">
                  <div>
                    <span
                      className="inline-block rounded-full bg-black/15 px-2.5 py-1 text-[10px] uppercase tracking-[0.18em]"
                      style={{ fontFamily: "var(--font-jakarta)" }}
                    >
                      {b.subtitle}
                    </span>
                    <h3
                      className="mt-4 text-3xl leading-[0.95] md:text-4xl"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {b.name}
                    </h3>
                  </div>
                  <div className="shrink-0 transition-transform duration-500 group-hover:-translate-y-2 group-hover:rotate-3">
                    {b.photo ? (
                      <div className="relative h-36 w-28 overflow-hidden rounded-2xl border-2 border-[var(--color-ink)] shadow-[4px_4px_0_0_var(--color-ink)]">
                        <Image
                          src={b.photo}
                          alt={`${b.name} bottle`}
                          fill
                          sizes="112px"
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <BottleIllustration flavor={b.flavor} className="h-36" />
                    )}
                  </div>
                </div>

                <p
                  className="relative z-10 mt-3 text-[15px] leading-relaxed opacity-90"
                  style={{ fontFamily: "var(--font-serif)" }}
                >
                  {b.description}
                </p>

                <div className="relative z-10 mt-5 flex flex-wrap gap-2">
                  {b.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-current/30 bg-black/10 px-2.5 py-1 text-[11px]"
                      style={{ fontFamily: "var(--font-jakarta)" }}
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <div className="relative z-10 mt-6 flex items-center justify-between border-t border-current/20 pt-4">
                  <span
                    className="text-xs uppercase tracking-[0.2em] opacity-80"
                    style={{ fontFamily: "var(--font-jakarta)" }}
                  >
                    {b.sizes
                      .map(
                        (s) =>
                          `${s.ml}ml${s.qty === 0 ? " (out)" : ""}`
                      )
                      .join(" · ")}
                  </span>
                  {soldOut ? (
                    <a
                      href="#prices"
                      className="rounded-full border-2 border-current px-4 py-2 text-[11px] opacity-70"
                      style={{ fontFamily: "var(--font-jakarta)" }}
                    >
                      See menu
                    </a>
                  ) : (
                    <button
                      type="button"
                      onClick={() =>
                        feature &&
                        addItem({
                          productId: b.id,
                          name: b.name,
                          ml: feature.ml,
                          price: feature.price,
                        })
                      }
                      className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-ink)] px-4 py-2 text-[11px] text-[var(--color-cream)] transition-transform hover:scale-105"
                      style={{ fontFamily: "var(--font-jakarta)" }}
                    >
                      <Plus className="h-3 w-3" />
                      Add {feature?.ml}ml · {CURRENCY}
                      {feature?.price}
                    </button>
                  )}
                </div>
              </motion.article>
            );
          })}

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="bottle-card relative flex min-h-[340px] flex-col items-center justify-center overflow-hidden rounded-[28px] border-2 border-dashed border-[var(--color-ink)] bg-[var(--color-cream-deep)] p-7 text-center"
          >
            <span className="text-6xl">🍋</span>
            <h3
              className="mt-4 text-4xl leading-tight text-[var(--color-ink)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              ...and many<br />more coming
            </h3>
            <p
              className="mt-3 text-sm text-[var(--color-ink-soft)]"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              We're always experimenting. Follow along or call to ask
              what's new this week.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
