"use client";

import { AnimatePresence, motion } from "motion/react";
import { ShoppingBag, X, Minus, Plus, Trash2, MessageCircle } from "lucide-react";
import { useState } from "react";
import { useCart } from "./CartContext";
import { CURRENCY, OWNER_EMAIL, waLink } from "@/lib/config";

export default function CartDrawer() {
  const {
    items,
    count,
    subtotal,
    isOpen,
    open,
    close,
    setQty,
    remove,
    clear,
  } = useCart();
  const [customerName, setCustomerName] = useState("");
  const [customerArea, setCustomerArea] = useState("");
  const [notes, setNotes] = useState("");
  const [stockError, setStockError] = useState<string | null>(null);

  const buildMessage = () => {
    const lines: string[] = [];
    lines.push("Hi JustJuice, I'd like to place an order:");
    lines.push("");
    for (const it of items) {
      lines.push(
        `• ${it.name} — ${it.ml}ml × ${it.qty} = ${CURRENCY}${(
          it.price * it.qty
        ).toFixed(2)}`
      );
    }
    lines.push("");
    lines.push(`Subtotal: ${CURRENCY}${subtotal.toFixed(2)}`);
    lines.push("");
    if (customerName.trim()) lines.push(`Name: ${customerName.trim()}`);
    if (customerArea.trim()) lines.push(`Area / Drop-off: ${customerArea.trim()}`);
    if (notes.trim()) lines.push(`Notes: ${notes.trim()}`);
    return lines.join("\n");
  };

  const persistOrder = async (
    source: "whatsapp" | "email"
  ): Promise<{ ok: true } | { ok: false; message: string }> => {
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source,
          customer: {
            name: customerName.trim(),
            area: customerArea.trim(),
            notes: notes.trim(),
          },
          items: items.map((it) => ({
            productId: it.productId,
            name: it.name,
            ml: it.ml,
            price: it.price,
            qty: it.qty,
          })),
        }),
      });
      if (res.ok) return { ok: true };
      if (res.status === 409) {
        const body = await res.json().catch(() => ({}));
        const shortages: { name: string; ml: number; available: number }[] =
          Array.isArray(body?.shortages) ? body.shortages : [];
        const detail = shortages
          .map(
            (s) =>
              `${s.name} ${s.ml}ml (${s.available === 0 ? "sold out" : `only ${s.available} left`})`
          )
          .join(", ");
        return {
          ok: false,
          message: detail
            ? `Sorry, stock ran out: ${detail}. Please adjust your cart.`
            : "Some items just sold out. Please adjust your cart.",
        };
      }
      return { ok: false, message: "Could not save your order. Try again." };
    } catch {
      return {
        ok: false,
        message: "Network issue saving your order. Try again.",
      };
    }
  };

  const sendWhatsApp = async () => {
    if (items.length === 0) return;
    setStockError(null);
    const result = await persistOrder("whatsapp");
    if (!result.ok) {
      setStockError(result.message);
      return;
    }
    window.open(waLink(buildMessage()), "_blank", "noopener,noreferrer");
  };

  const sendEmail = async () => {
    if (items.length === 0) return;
    setStockError(null);
    const result = await persistOrder("email");
    if (!result.ok) {
      setStockError(result.message);
      return;
    }
    const subject = `JustJuice order — ${count} item${count === 1 ? "" : "s"}`;
    const href = `mailto:${OWNER_EMAIL}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(buildMessage())}`;
    window.location.href = href;
  };

  return (
    <>
      {/* Floating cart button */}
      <button
        type="button"
        onClick={open}
        aria-label={`Open cart (${count} items)`}
        className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full border-2 border-[var(--color-ink)] bg-[var(--color-mango)] text-[var(--color-ink)] shadow-[6px_6px_0_0_var(--color-ink)] transition-transform hover:scale-105 md:h-16 md:w-16"
      >
        <ShoppingBag className="h-6 w-6" />
        {count > 0 && (
          <span
            className="absolute -top-1 -right-1 grid h-6 min-w-[24px] place-items-center rounded-full border-2 border-[var(--color-ink)] bg-[var(--color-coral)] px-1 text-[11px] text-white"
            style={{ fontFamily: "var(--font-jakarta)" }}
          >
            {count}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={close}
              className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            />
            <motion.aside
              key="drawer"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 280, damping: 32 }}
              className="fixed right-0 top-0 bottom-0 z-50 flex w-full max-w-md flex-col bg-[var(--color-cream)] text-[var(--color-ink)] shadow-2xl"
            >
              <header className="flex items-center justify-between border-b-2 border-[var(--color-ink)] px-5 py-4">
                <div>
                  <p
                    className="text-[10px] uppercase tracking-[0.3em] text-[var(--color-ink-soft)]"
                    style={{ fontFamily: "var(--font-jakarta)" }}
                  >
                    Your order
                  </p>
                  <h3
                    className="text-3xl leading-none"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    The cart
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={close}
                  aria-label="Close cart"
                  className="grid h-10 w-10 place-items-center rounded-full border-2 border-[var(--color-ink)] bg-white transition-transform hover:rotate-90"
                >
                  <X className="h-5 w-5" />
                </button>
              </header>

              <div className="flex-1 overflow-y-auto px-5 py-4">
                {items.length === 0 ? (
                  <div
                    className="flex h-full flex-col items-center justify-center gap-3 text-center text-[var(--color-ink-soft)]"
                    style={{ fontFamily: "var(--font-serif)" }}
                  >
                    <span className="text-6xl">🧃</span>
                    <p>Your cart is empty.</p>
                    <p className="text-sm">
                      Pick a bottle from the menu — we'll have it ready.
                    </p>
                  </div>
                ) : (
                  <ul className="space-y-3">
                    {items.map((it) => (
                      <li
                        key={`${it.productId}-${it.ml}`}
                        className="flex items-start gap-3 rounded-2xl border-2 border-[var(--color-ink)] bg-white p-3"
                      >
                        <div className="flex-1">
                          <p
                            className="text-lg leading-tight"
                            style={{ fontFamily: "var(--font-display)" }}
                          >
                            {it.name}
                          </p>
                          <p
                            className="mt-0.5 text-xs text-[var(--color-ink-soft)]"
                            style={{ fontFamily: "var(--font-jakarta)" }}
                          >
                            {it.ml}ml · {CURRENCY}
                            {it.price.toFixed(2)} each
                          </p>

                          <div className="mt-2 flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                setQty(it.productId, it.ml, it.qty - 1)
                              }
                              aria-label="Decrease quantity"
                              className="grid h-7 w-7 place-items-center rounded-full border border-[var(--color-ink)] hover:bg-[var(--color-cream-deep)]"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span
                              className="w-6 text-center text-sm"
                              style={{ fontFamily: "var(--font-jakarta)" }}
                            >
                              {it.qty}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                setQty(it.productId, it.ml, it.qty + 1)
                              }
                              aria-label="Increase quantity"
                              className="grid h-7 w-7 place-items-center rounded-full border border-[var(--color-ink)] hover:bg-[var(--color-cream-deep)]"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <p
                            className="text-base font-semibold"
                            style={{ fontFamily: "var(--font-jakarta)" }}
                          >
                            {CURRENCY}
                            {(it.qty * it.price).toFixed(2)}
                          </p>
                          <button
                            type="button"
                            onClick={() => remove(it.productId, it.ml)}
                            aria-label="Remove item"
                            className="text-[var(--color-ink-soft)] hover:text-[var(--color-hibiscus)]"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}

                {items.length > 0 && (
                  <div className="mt-5 space-y-3">
                    <label className="block">
                      <span
                        className="mb-1 block text-[10px] uppercase tracking-[0.25em] text-[var(--color-ink-soft)]"
                        style={{ fontFamily: "var(--font-jakarta)" }}
                      >
                        Your name
                      </span>
                      <input
                        type="text"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="e.g. Ama"
                        className="w-full rounded-xl border-2 border-[var(--color-ink)] bg-white px-3 py-2 text-sm outline-none focus:border-[var(--color-mango-deep)]"
                      />
                    </label>
                    <label className="block">
                      <span
                        className="mb-1 block text-[10px] uppercase tracking-[0.25em] text-[var(--color-ink-soft)]"
                        style={{ fontFamily: "var(--font-jakarta)" }}
                      >
                        Area / drop-off
                      </span>
                      <input
                        type="text"
                        value={customerArea}
                        onChange={(e) => setCustomerArea(e.target.value)}
                        placeholder="e.g. Teshie, near Salad Master"
                        className="w-full rounded-xl border-2 border-[var(--color-ink)] bg-white px-3 py-2 text-sm outline-none focus:border-[var(--color-mango-deep)]"
                      />
                    </label>
                    <label className="block">
                      <span
                        className="mb-1 block text-[10px] uppercase tracking-[0.25em] text-[var(--color-ink-soft)]"
                        style={{ fontFamily: "var(--font-jakarta)" }}
                      >
                        Notes (optional)
                      </span>
                      <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Any special requests, delivery time…"
                        rows={2}
                        className="w-full rounded-xl border-2 border-[var(--color-ink)] bg-white px-3 py-2 text-sm outline-none focus:border-[var(--color-mango-deep)]"
                      />
                    </label>
                  </div>
                )}
              </div>

              {items.length > 0 && (
                <footer className="border-t-2 border-[var(--color-ink)] bg-[var(--color-cream-deep)] px-5 py-4">
                  <div
                    className="flex items-baseline justify-between"
                    style={{ fontFamily: "var(--font-jakarta)" }}
                  >
                    <span className="text-sm uppercase tracking-[0.22em] text-[var(--color-ink-soft)]">
                      Subtotal
                    </span>
                    <span className="text-2xl font-semibold">
                      {CURRENCY}
                      {subtotal.toFixed(2)}
                    </span>
                  </div>
                  {stockError && (
                    <div
                      role="alert"
                      className="mt-3 rounded-xl border-2 border-[var(--color-hibiscus)] bg-white px-3 py-2 text-xs text-[var(--color-hibiscus)]"
                      style={{ fontFamily: "var(--font-jakarta)" }}
                    >
                      {stockError}
                    </div>
                  )}
                  <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={sendWhatsApp}
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-5 py-3 text-sm text-white transition-transform hover:scale-[1.02]"
                      style={{ fontFamily: "var(--font-jakarta)" }}
                    >
                      <MessageCircle className="h-4 w-4" />
                      Send via WhatsApp
                    </button>
                    <button
                      type="button"
                      onClick={sendEmail}
                      className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-[var(--color-ink)] px-5 py-3 text-sm transition-colors hover:bg-[var(--color-mango)]"
                      style={{ fontFamily: "var(--font-jakarta)" }}
                    >
                      Send via Email
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={clear}
                    className="mt-3 w-full text-center text-xs text-[var(--color-ink-soft)] underline-offset-4 hover:underline"
                    style={{ fontFamily: "var(--font-jakarta)" }}
                  >
                    Clear cart
                  </button>
                  <p
                    className="mt-2 text-center text-[11px] text-[var(--color-ink-soft)]"
                    style={{ fontFamily: "var(--font-jakarta)" }}
                  >
                    Payment + final confirmation happens in the chat.
                  </p>
                </footer>
              )}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
