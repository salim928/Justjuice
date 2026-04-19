const items = [
  "Nature in every sip",
  "100% Natural",
  "Made in Ghana 🇬🇭",
  "Cold-Pressed Daily",
  "No Sugar Added",
  "Shake Well Before You Sip",
];

export default function Ticker() {
  const doubled = [...items, ...items];
  return (
    <div
      className="relative overflow-hidden border-y-2 border-[var(--color-ink)] bg-[var(--color-ink)] py-4"
      aria-hidden
    >
      <div className="marquee-track flex w-[200%] items-center whitespace-nowrap">
        {doubled.map((t, idx) => (
          <div key={idx} className="flex items-center">
            <span
              className="px-8 text-3xl text-[var(--color-mango)] md:text-4xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {t}
            </span>
            <span className="text-2xl text-[var(--color-cream)]/40">✱</span>
          </div>
        ))}
      </div>
    </div>
  );
}
