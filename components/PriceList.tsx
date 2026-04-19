"use client";

import { motion } from "motion/react";

type Row = { size: string; price: string; note?: string };

const categories: { title: string; accent: string; rows: Row[]; foot?: string }[] = [
  {
    title: "Pineapple Blends",
    accent: "var(--color-lime)",
    rows: [
      { size: "500ml", price: "₵25" },
      { size: "350ml", price: "₵15" },
      { size: "300ml", price: "₵13" },
    ],
    foot: "Pineapple-Ginger-Mint  ·  Pineapple-Beetroot-Mint",
  },
  {
    title: "Mango & Orange",
    accent: "var(--color-mango)",
    rows: [
      { size: "500ml", price: "₵25" },
      { size: "350ml", price: "₵15" },
      { size: "300ml", price: "₵13" },
    ],
    foot: "Same pricing as pineapple blends",
  },
  {
    title: "Tigernut Milk Drink",
    accent: "var(--color-tigernut)",
    rows: [
      { size: "500ml", price: "₵20" },
      { size: "350ml", price: "₵15" },
      { size: "300ml", price: "₵10" },
    ],
    foot: "With or without cloves & ginger",
  },
  {
    title: "Fruity Sobolo",
    accent: "var(--color-hibiscus)",
    rows: [{ size: "One size", price: "₵10" }],
    foot: "Brewed hibiscus, ice cold",
  },
];

export default function PriceList() {
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
            Call ahead for bulk orders — events, parties, offices.
            We'll deliver around Teshie-Nungua and surroundings.
          </p>
        </div>

        {/* Menu card — receipt feel */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8 }}
          className="relative mx-auto max-w-3xl"
        >
          <div className="relative rounded-[32px] border-2 border-[var(--color-ink)] bg-[var(--color-cream)] shadow-[10px_10px_0_0_var(--color-ink)]">
            {/* Perforated top */}
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

                  <ul className="space-y-2">
                    {cat.rows.map((r) => (
                      <li
                        key={r.size}
                        className="flex items-baseline justify-between gap-3 text-[var(--color-ink)]"
                        style={{ fontFamily: "var(--font-jakarta)" }}
                      >
                        <span className="text-sm">{r.size}</span>
                        <span
                          aria-hidden
                          className="mx-1 flex-1 border-b border-dotted border-[var(--color-ink)]/40"
                        />
                        <span className="text-base font-semibold">{r.price}</span>
                      </li>
                    ))}
                  </ul>

                  {cat.foot && (
                    <p
                      className="mt-4 text-[12px] italic leading-snug text-[var(--color-ink-soft)]"
                      style={{ fontFamily: "var(--font-serif)" }}
                    >
                      {cat.foot}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Bottom perforation */}
            <div className="flex items-center justify-between border-t-2 border-dashed border-[var(--color-ink)] px-8 py-5 md:px-14">
              <span
                className="text-xs uppercase tracking-[0.2em] text-[var(--color-ink-soft)]"
                style={{ fontFamily: "var(--font-jakarta)" }}
              >
                Prices in Ghana Cedi (₵)
              </span>
              <a
                href="tel:+233508726113"
                className="rounded-full bg-[var(--color-ink)] px-5 py-2 text-xs text-[var(--color-mango)] transition-transform hover:scale-105"
                style={{ fontFamily: "var(--font-jakarta)" }}
              >
                Call to order →
              </a>
            </div>
          </div>

          {/* Decorative taped note */}
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
