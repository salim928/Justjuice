"use client";

import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";
import Image from "next/image";

const flavors = [
  { name: "Mango", color: "var(--color-mango)" },
  { name: "Pineapple + Ginger", color: "var(--color-lime)" },
  { name: "Beetroot + Mint", color: "var(--color-beet)" },
  { name: "Tigernut + Dates", color: "var(--color-tigernut)" },
  { name: "Hibiscus Sobolo", color: "var(--color-hibiscus)" },
];

export default function Hero() {
  const [i, setI] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setI((v) => (v + 1) % flavors.length), 2600);
    return () => clearInterval(id);
  }, []);

  return (
    <section
      id="top"
      className="grain relative isolate overflow-hidden pt-28 pb-16 md:pt-36 md:pb-24"
      style={{
        background:
          "radial-gradient(1200px 700px at 80% -10%, #ffe3a3 0%, transparent 55%), radial-gradient(900px 600px at -10% 100%, #d9efa8 0%, transparent 50%), var(--color-cream)",
      }}
    >
      {/* Floating fruit blobs */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-10 left-[8%] h-36 w-36 rotate-12 rounded-full opacity-70 blur-2xl"
        style={{ background: "var(--color-mango)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-10 right-[4%] h-48 w-48 -rotate-12 rounded-full opacity-50 blur-3xl"
        style={{ background: "var(--color-lime)" }}
      />

      <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-5 md:grid-cols-[1.15fr_1fr] md:gap-6 md:px-8">
        {/* Left: text */}
        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full border border-[var(--color-ink)]/15 bg-white/60 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-[var(--color-ink-soft)] backdrop-blur"
            style={{ fontFamily: "var(--font-jakarta)" }}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-leaf)]" />
            Handmade in Teshie-Nungua, Accra
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.05 }}
            className="mt-5 leading-[0.82]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            <span className="block text-[22vw] text-[var(--color-ink)] md:text-[9rem]">
              Just
            </span>
            <span className="mt-2 block text-[22vw] text-[var(--color-mango-deep)] md:text-[9rem]">
              Juice.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="mt-6 max-w-md text-[20px] leading-snug text-[var(--color-ink-soft)] md:text-[22px]"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Nature in every sip — cold blends of sun-ripe fruit,
            poured fresh into a bottle that day. No concentrates.
            No powders. Just juice.
          </motion.p>

          {/* Rotating flavor */}
          <div className="mt-7 flex items-baseline gap-3">
            <span
              className="text-sm uppercase tracking-[0.22em] text-[var(--color-ink-soft)]/70"
              style={{ fontFamily: "var(--font-jakarta)" }}
            >
              Today we're blending
            </span>
          </div>
          <div className="relative h-[60px] overflow-hidden md:h-[72px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={flavors[i].name}
                initial={{ y: 40, opacity: 0, rotate: -4 }}
                animate={{ y: 0, opacity: 1, rotate: 0 }}
                exit={{ y: -40, opacity: 0, rotate: 3 }}
                transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
                className="absolute inset-0 flex items-center"
              >
                <span
                  className="text-5xl md:text-6xl"
                  style={{
                    fontFamily: "var(--font-display)",
                    color: flavors[i].color,
                  }}
                >
                  {flavors[i].name}
                </span>
              </motion.div>
            </AnimatePresence>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <a
              href="#blends"
              className="group inline-flex items-center gap-2 rounded-full bg-[var(--color-ink)] px-6 py-3 text-sm text-[var(--color-cream)] transition-transform hover:scale-105"
              style={{ fontFamily: "var(--font-jakarta)" }}
            >
              See the menu
              <span className="inline-block transition-transform group-hover:translate-x-1">
                →
              </span>
            </a>
            <a
              href="#order"
              className="inline-flex items-center gap-2 rounded-full border-2 border-[var(--color-ink)] px-6 py-3 text-sm text-[var(--color-ink)] transition-colors hover:bg-[var(--color-mango)]"
              style={{ fontFamily: "var(--font-jakarta)" }}
            >
              Order a bottle
            </a>
          </motion.div>
        </div>

        {/* Right: illustrated bottle + stickers */}
        <div className="relative flex items-center justify-center">
          {/* Rotating sticker badge */}
          <div className="slow-spin absolute -top-2 right-2 z-20 md:-top-6 md:right-0">
            <svg
              viewBox="0 0 140 140"
              className="h-[110px] w-[110px] md:h-[140px] md:w-[140px]"
              aria-hidden
            >
              <defs>
                <path
                  id="circle-text"
                  d="M70,70 m-52,0 a52,52 0 1,1 104,0 a52,52 0 1,1 -104,0"
                />
              </defs>
              <circle
                cx="70"
                cy="70"
                r="66"
                fill="var(--color-ink)"
                stroke="var(--color-mango)"
                strokeWidth="2"
              />
              <text
                fill="var(--color-mango)"
                style={{
                  fontFamily: "var(--font-jakarta)",
                  fontSize: "11px",
                  letterSpacing: "3px",
                }}
              >
                <textPath href="#circle-text">
                  100% NATURAL • MADE IN GHANA • FRESH DAILY •
                </textPath>
              </text>
              <text
                x="70"
                y="78"
                textAnchor="middle"
                fill="var(--color-cream)"
                style={{ fontFamily: "var(--font-display)", fontSize: "22px" }}
              >
                sip it
              </text>
            </svg>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 40, rotate: -8 }}
            animate={{ opacity: 1, y: 0, rotate: -4 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.2, 0.8, 0.2, 1] }}
            className="relative h-[420px] w-[300px] overflow-hidden rounded-[36px] border-2 border-[var(--color-ink)] shadow-[8px_8px_0_0_var(--color-ink)] md:h-[520px] md:w-[380px]"
          >
            <Image
              src="/photo_3_2026-04-19_18-52-04.jpg"
              alt="JustJuice Mango bottle held among fresh citrus leaves"
              fill
              priority
              sizes="(min-width: 768px) 380px, 300px"
              className="object-cover"
            />
          </motion.div>

          {/* Little scattered stickers */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.5 }}
            className="absolute -left-2 bottom-8 rotate-[-8deg] rounded-lg bg-white px-3 py-1.5 text-xs shadow-[4px_4px_0_0_var(--color-ink)] md:left-0"
            style={{ fontFamily: "var(--font-jakarta)" }}
          >
            cold pressed ✱
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.05, duration: 0.5 }}
            className="absolute right-0 top-8 rotate-[6deg] rounded-lg bg-[var(--color-coral)] px-3 py-1.5 text-xs text-white shadow-[4px_4px_0_0_var(--color-ink)]"
            style={{ fontFamily: "var(--font-jakarta)" }}
          >
            no sugar added
          </motion.div>
        </div>
      </div>
    </section>
  );
}
