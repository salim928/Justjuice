"use client";

import { motion } from "motion/react";
import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";

export default function OrderCTA() {
  return (
    <section
      id="order"
      className="relative overflow-hidden py-24 md:py-32"
      style={{
        background:
          "radial-gradient(900px 500px at 20% 20%, #ffd97d 0%, transparent 55%), radial-gradient(700px 500px at 90% 90%, #ffb0a0 0%, transparent 55%), var(--color-cream)",
      }}
    >
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="grid grid-cols-1 items-stretch gap-8 md:grid-cols-[1.1fr_1fr]">
          {/* Left: big CTA card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative flex flex-col justify-between overflow-hidden rounded-[32px] border-2 border-[var(--color-ink)] bg-[var(--color-ink)] p-8 text-[var(--color-cream)] shadow-[10px_10px_0_0_var(--color-mango)] md:p-12"
          >
            <div>
              <p
                className="mb-3 text-xs uppercase tracking-[0.3em] text-[var(--color-mango)]"
                style={{ fontFamily: "var(--font-jakarta)" }}
              >
                ✱ Place an order
              </p>
              <h2
                className="text-6xl leading-[0.88] md:text-7xl"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Thirsty?<br />
                <span className="text-[var(--color-mango)]">Let's pour.</span>
              </h2>
              <p
                className="mt-5 max-w-md text-[17px] leading-relaxed text-[var(--color-cream)]/80"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                Ring us directly — we'll confirm blend, size, and drop-off.
                Bulk orders welcome: events, offices, gifts, weddings.
              </p>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="tel:+233508726113"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-[var(--color-mango)] px-6 py-4 text-sm text-[var(--color-ink)] transition-transform hover:scale-[1.03]"
                style={{ fontFamily: "var(--font-jakarta)" }}
              >
                <Phone className="h-4 w-4" />
                Call 0508 726 113
              </a>
              <a
                href="https://wa.me/233508726113?text=Hi%20JustJuice%2C%20I%27d%20like%20to%20place%20an%20order"
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center justify-center gap-2 rounded-full border-2 border-[var(--color-mango)] px-6 py-4 text-sm text-[var(--color-mango)] transition-colors hover:bg-[var(--color-mango)] hover:text-[var(--color-ink)]"
                style={{ fontFamily: "var(--font-jakarta)" }}
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp us
              </a>
            </div>

            {/* Decorative scribble */}
            <svg
              aria-hidden
              viewBox="0 0 200 40"
              className="mt-8 h-10 w-full opacity-60"
            >
              <path
                d="M2,20 Q25,4 50,20 T100,20 T150,20 T198,20"
                stroke="var(--color-mango)"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
              />
            </svg>
          </motion.div>

          {/* Right: contact cards */}
          <div className="grid grid-rows-3 gap-4">
            <ContactCard
              icon={<Phone className="h-5 w-5" />}
              label="Phone"
              primary="0508 726 113"
              href="tel:+233508726113"
              bg="var(--color-mango)"
              text="var(--color-ink)"
            />
            <ContactCard
              icon={<Mail className="h-5 w-5" />}
              label="Email"
              primary="sandalatifa20@gmail.com"
              href="mailto:sandalatifa20@gmail.com"
              bg="var(--color-lime)"
              text="var(--color-leaf-deep)"
            />
            <ContactCard
              icon={<MapPin className="h-5 w-5" />}
              label="Find us"
              primary="GB Health Solutions"
              sub="Teshie-Nungua, Sankara · Salad Master"
              href="https://maps.google.com/?q=GB+Health+Solutions+Teshie+Nungua+Accra"
              bg="var(--color-hibiscus)"
              text="#ffffff"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function ContactCard({
  icon,
  label,
  primary,
  sub,
  href,
  bg,
  text,
}: {
  icon: React.ReactNode;
  label: string;
  primary: string;
  sub?: string;
  href: string;
  bg: string;
  text: string;
}) {
  return (
    <motion.a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noreferrer" : undefined}
      initial={{ opacity: 0, x: 30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      whileHover={{ y: -4 }}
      className="group flex items-center gap-5 rounded-[24px] border-2 border-[var(--color-ink)] p-6 transition-shadow hover:shadow-[6px_6px_0_0_var(--color-ink)]"
      style={{ background: bg, color: text }}
    >
      <div
        className="grid h-12 w-12 shrink-0 place-items-center rounded-full border-2 border-current"
        style={{ background: "rgba(0,0,0,0.1)" }}
      >
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p
          className="text-[10px] uppercase tracking-[0.25em] opacity-70"
          style={{ fontFamily: "var(--font-jakarta)" }}
        >
          {label}
        </p>
        <p
          className="mt-1 truncate text-lg"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {primary}
        </p>
        {sub && (
          <p
            className="truncate text-xs opacity-75"
            style={{ fontFamily: "var(--font-jakarta)" }}
          >
            {sub}
          </p>
        )}
      </div>
      <span
        className="text-xl opacity-50 transition-transform group-hover:translate-x-1"
        aria-hidden
      >
        →
      </span>
    </motion.a>
  );
}
