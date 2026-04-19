"use client";

import { motion } from "motion/react";

const pillars = [
  {
    icon: "🌱",
    title: "Whole fruit, whole story",
    body:
      "We start with fruit from markets we trust. No concentrates, no powders, no shortcuts in a sachet.",
  },
  {
    icon: "❄️",
    title: "Cold and fresh",
    body:
      "Blended cold, bottled the same morning, kept chilled. Best within 3–4 days — the way nature intended.",
  },
  {
    icon: "🇬🇭",
    title: "Made right here",
    body:
      "Proudly produced in Teshie-Nungua, Accra. A small, careful kitchen. Real hands. Real fruit.",
  },
];

export default function Story() {
  return (
    <section
      id="story"
      className="relative overflow-hidden bg-[var(--color-ink)] py-24 text-[var(--color-cream)] md:py-32"
    >
      {/* Decorative halved fruit */}
      <div
        aria-hidden
        className="absolute -left-24 top-20 h-72 w-72 rounded-full opacity-40 blur-3xl"
        style={{ background: "var(--color-mango)" }}
      />
      <div
        aria-hidden
        className="absolute -right-32 bottom-10 h-80 w-80 rounded-full opacity-30 blur-3xl"
        style={{ background: "var(--color-hibiscus)" }}
      />

      <div className="relative mx-auto max-w-6xl px-5 md:px-8">
        <div className="grid grid-cols-1 items-start gap-12 md:grid-cols-[1fr_1.1fr] md:gap-20">
          {/* Left — big statement */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p
              className="mb-4 text-xs uppercase tracking-[0.3em] text-[var(--color-mango)]"
              style={{ fontFamily: "var(--font-jakarta)" }}
            >
              ✱ Our story
            </p>
            <h2
              className="text-6xl leading-[0.88] md:text-8xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Juice the<br />
              <span className="text-[var(--color-mango)]">way it used</span><br />
              to taste.
            </h2>
            <div className="mt-8 space-y-5 text-[18px] leading-relaxed text-[var(--color-cream)]/85">
              <p style={{ fontFamily: "var(--font-serif)" }}>
                JustJuice started the simple way — with fruit ripe enough
                to make you stop mid-market, a blender, and a feeling that
                most drinks on the shelf had forgotten what they were
                supposed to be.
              </p>
              <p style={{ fontFamily: "var(--font-serif)" }}>
                Every bottle we hand over is a small protest against
                factory-sweet. Blended that morning, kept cold, drunk the
                same week. Short ingredient lists. Long-held traditions.
              </p>
            </div>
          </motion.div>

          {/* Right — pillars */}
          <div className="space-y-4">
            {pillars.map((p, idx) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="group flex gap-5 rounded-2xl border border-[var(--color-cream)]/15 bg-[var(--color-cream)]/5 p-6 backdrop-blur transition-colors hover:bg-[var(--color-cream)]/10"
              >
                <div className="shrink-0 text-4xl transition-transform group-hover:scale-110">
                  {p.icon}
                </div>
                <div>
                  <h3
                    className="text-2xl text-[var(--color-mango)]"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {p.title}
                  </h3>
                  <p
                    className="mt-1 text-[15px] leading-relaxed text-[var(--color-cream)]/80"
                    style={{ fontFamily: "var(--font-serif)" }}
                  >
                    {p.body}
                  </p>
                </div>
              </motion.div>
            ))}

            {/* Keep-cold note */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="rounded-2xl border-2 border-dashed border-[var(--color-mango)]/40 p-5 text-sm text-[var(--color-cream)]/70"
              style={{ fontFamily: "var(--font-jakarta)" }}
            >
              <span className="mr-2 text-[var(--color-mango)]">🧊</span>
              Keep refrigerated. Best served chilled. Shake well before you open.
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
