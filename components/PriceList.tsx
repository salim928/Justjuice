"use client";

import { motion } from "motion/react";
import { Plus } from "lucide-react";
import { useCart } from "./CartContext";
import { CURRENCY, PHONE_TEL } from "@/lib/config";
import type { Product } from "@/lib/types";

type Category = {
  title: string;
  accent: string;
  products: Product[];
};

function groupByCategory(products: Product[]): Category[] {
  const map = new Map<string, Category>();
  for (const p of products) {
    let cat = map.get(p.category);
    if (!cat) {
      cat = { title: p.category, accent: p.accent, products: [] };
      map.set(p.category, cat);
    }
    cat.products.push(p);
  }
  return Array.from(map.values());
}

export default function PriceList({ products }: { products: Product[] }) {
  const { addItem } = useCart();
  const categories = groupByCategory(products);

  return (
    <section
      id="prices"
      className="relative overflow-hidden py-20 md:py-28"
      style={{
        background:
          "linear-gradient(180deg, var(--color-cream) 0%, var(--color-cream-deep) 100%)",
      }}
    >
      <div className="mx-auto max-w-5xl px-5 md:px-8">
        <div className="mb-12 text-center md:mb-16">
          <p
            className="mb-2 text-xs uppercase tracking-[0.3em] text-[var(--color-coral)]"
            style={{ fontFamily: "var(--font-jakarta)" }}
          >
            ✱ The menu
          </p>
          <h2
            className="text-6xl leading-[0.9] text-[var(--color-ink)] md:text-8xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Small prices,<br />big bottles.
          </h2>
          <p
            className="mx-auto mt-4 max-w-lg text-[17px] text-[var(--color-ink-soft)]"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Tap <span className="font-semibold">+ Add</span> on any size to build
            your order. We'll deliver around Teshie-Nungua and surroundings.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8 }}
          className="relative mx-auto max-w-3xl"
        >
          <div className="relative rounded-[32px] border-2 border-[var(--color-ink)] bg-[var(--color-cream)] shadow-[10px_10px_0_0_var(--color-ink)]">
            <div className="relative border-b-2 border-dashed border-[var(--color-ink)] px-8 py-6 text-center md:px-14">
              <div className="flex items-center justify-center gap-3">
                <span className="h-px w-12 bg-[var(--color-ink)]" />
                <span
                  className="text-sm uppercase tracking-[0.3em] text-[var(--color-ink)]"
                  style={{ fontFamily: "var(--font-jakarta)" }}
                >
                  JustJuice · Price List
                </span>
                <span className="h-px w-12 bg-[var(--color-ink)]" />
              </div>
              <p
                className="mt-1 text-xs text-[var(--color-ink-soft)]"
                style={{ fontFamily: "var(--font-jakarta)" }}
              >
                Teshie-Nungua, Sankara · Salad Master
              </p>
            </div>

            <div className="grid grid-cols-1 gap-0 md:grid-cols-2">
              {categories.map((cat, idx) => (
                <div
                  key={cat.title}
                  className={`p-7 md:p-10 ${
                    idx % 2 === 0 ? "md:border-r-2" : ""
                  } ${
                    idx < categories.length - (categories.length % 2 === 0 ? 2 : 1)
                      ? "border-b-2"
                      : ""
                  } border-dashed border-[var(--color-ink)]`}
                >
                  <div className="mb-4 flex items-center gap-3">
                    <span
                      className="inline-block h-4 w-4 rounded-full border-2 border-[var(--color-ink)]"
                      style={{ background: cat.accent }}
                    />
                    <h3
                      className="text-3xl leading-none text-[var(--color-ink)]"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {cat.title}
                    </h3>
                  </div>

                  <div className="space-y-4">
                    {cat.products.map((product) => (
                      <div key={product.id}>
                        {cat.products.length > 1 && (
                          <p
                            className="mb-1 text-[11px] uppercase tracking-wider text-[var(--color-ink-soft)]"
                            style={{ fontFamily: "var(--font-jakarta)" }}
                          >
                            {product.name}
                            {!product.available && (
                              <span className="ml-2 rounded-full bg-[var(--color-ink)] px-1.5 py-0.5 text-[9px] text-[var(--color-cream)]">
                                Sold out
                              </span>
                            )}
                          </p>
                        )}
                        <ul className="space-y-2">
                          {product.sizes.map((size) => {
                            const disabled =
                              !product.available || size.qty === 0;
                            const low =
                              !disabled && size.qty > 0 && size.qty <= 3;
                            return (
                              <li
                                key={`${product.id}-${size.ml}`}
                                className="flex items-baseline justify-between gap-3 text-[var(--color-ink)]"
                                style={{ fontFamily: "var(--font-jakarta)" }}
                              >
                                <span className="text-sm">
                                  {size.ml}ml
                                  {disabled ? (
                                    <span className="ml-2 rounded-full bg-[var(--color-ink)] px-1.5 py-0.5 text-[9px] uppercase tracking-wider text-[var(--color-cream)]">
                                      Out
                                    </span>
                                  ) : low ? (
                                    <span className="ml-2 rounded-full bg-[var(--color-coral)] px-1.5 py-0.5 text-[9px] uppercase tracking-wider text-white">
                                      {size.qty} left
                                    </span>
                                  ) : null}
                                </span>
                                <span
                                  aria-hidden
                                  className="mx-1 flex-1 border-b border-dotted border-[var(--color-ink)]/40"
                                />
                                <span className="text-base font-semibold">
                                  {CURRENCY}
                                  {size.price}
                                </span>
                                <button
                                  type="button"
                                  disabled={disabled}
                                  onClick={() =>
                                    addItem({
                                      productId: product.id,
                                      name: product.name,
                                      ml: size.ml,
                                      price: size.price,
                                    })
                                  }
                                  className="inline-flex items-center gap-1 rounded-full border-2 border-[var(--color-ink)] bg-[var(--color-mango)] px-2.5 py-1 text-[10px] uppercase tracking-wider text-[var(--color-ink)] transition-transform hover:scale-105 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100"
                                  aria-label={`Add ${product.name} ${size.ml}ml to cart`}
                                >
                                  <Plus className="h-3 w-3" />
                                  Add
                                </button>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between border-t-2 border-dashed border-[var(--color-ink)] px-8 py-5 md:px-14">
              <span
                className="text-xs uppercase tracking-[0.2em] text-[var(--color-ink-soft)]"
                style={{ fontFamily: "var(--font-jakarta)" }}
              >
                Prices in Ghana Cedi ({CURRENCY})
              </span>
              <a
                href={`tel:${PHONE_TEL}`}
                className="rounded-full bg-[var(--color-ink)] px-5 py-2 text-xs text-[var(--color-mango)] transition-transform hover:scale-105"
                style={{ fontFamily: "var(--font-jakarta)" }}
              >
                Call to order →
              </a>
            </div>
          </div>

          <div
            className="absolute -right-6 -top-8 hidden rotate-[8deg] rounded-lg border border-[var(--color-ink)]/20 bg-[var(--color-mango)] px-4 py-3 text-sm shadow-md md:block"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Bulk orders?
            <br />
            Just ring us 📞
          </div>
        </motion.div>
      </div>
    </section>
  );
}
