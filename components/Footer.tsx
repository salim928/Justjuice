export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[var(--color-ink)] pb-10 pt-16 text-[var(--color-cream)]">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        {/* Giant wordmark */}
        <div className="select-none text-center">
          <h2
            className="leading-[0.78] text-[var(--color-mango)]"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(5rem, 22vw, 20rem)",
            }}
          >
            JustJuice.
          </h2>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 border-t border-[var(--color-cream)]/15 pt-8 text-sm md:grid-cols-3 md:items-center">
          <p
            className="text-[var(--color-cream)]/70"
            style={{ fontFamily: "var(--font-jakarta)" }}
          >
            © {new Date().getFullYear()} JustJuice · Made with fruit & care in Ghana 🇬🇭
          </p>
          <p
            className="text-center text-[var(--color-cream)]/70"
            style={{ fontFamily: "var(--font-serif)", fontStyle: "italic" }}
          >
            "Nature in every sip"
          </p>
          <div
            className="flex justify-start gap-5 text-[var(--color-cream)]/70 md:justify-end"
            style={{ fontFamily: "var(--font-jakarta)" }}
          >
            <a href="#blends" className="hover:text-[var(--color-mango)]">Blends</a>
            <a href="#prices" className="hover:text-[var(--color-mango)]">Prices</a>
            <a href="#order" className="hover:text-[var(--color-mango)]">Order</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
