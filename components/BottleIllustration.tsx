type Flavor =
  | "mango"
  | "pineapple-ginger"
  | "pineapple-beet"
  | "tigernut"
  | "sobolo";

const palettes: Record<
  Flavor,
  { liquid: string; liquidDark: string; label: string; labelText: string; cap: string }
> = {
  mango: {
    liquid: "#f5a623",
    liquidDark: "#e07d0a",
    label: "#d9efa8",
    labelText: "#1a1612",
    cap: "#1a1612",
  },
  "pineapple-ginger": {
    liquid: "#f4dc5a",
    liquidDark: "#d4b92e",
    label: "#2aa4c4",
    labelText: "#ffffff",
    cap: "#1a1612",
  },
  "pineapple-beet": {
    liquid: "#c73e6b",
    liquidDark: "#a8194b",
    label: "#e94e3c",
    labelText: "#ffffff",
    cap: "#1a1612",
  },
  tigernut: {
    liquid: "#f1e4c5",
    liquidDark: "#d6c29a",
    label: "#b89968",
    labelText: "#3a302a",
    cap: "#1a1612",
  },
  sobolo: {
    liquid: "#a8194b",
    liquidDark: "#5c0e2e",
    label: "#1a1612",
    labelText: "#f5a623",
    cap: "#1a1612",
  },
};

export default function BottleIllustration({
  flavor,
  className = "",
}: {
  flavor: Flavor;
  className?: string;
}) {
  const p = palettes[flavor];

  return (
    <svg
      viewBox="0 0 220 440"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      {/* Soft drop shadow */}
      <ellipse
        cx="110"
        cy="420"
        rx="80"
        ry="10"
        fill="#000"
        opacity="0.14"
      />

      {/* Cap */}
      <rect x="82" y="8" width="56" height="32" rx="4" fill={p.cap} />
      <rect x="82" y="8" width="56" height="6" rx="2" fill="#000" opacity="0.25" />

      {/* Neck */}
      <rect x="92" y="38" width="36" height="20" fill={p.cap} opacity="0.85" />

      {/* Bottle body */}
      <path
        d="M70 60 Q60 80 60 110 L60 390 Q60 410 85 415 L135 415 Q160 410 160 390 L160 110 Q160 80 150 60 Z"
        fill={p.liquid}
      />
      {/* Liquid darker base for depth */}
      <path
        d="M60 300 L60 390 Q60 410 85 415 L135 415 Q160 410 160 390 L160 300 Z"
        fill={p.liquidDark}
        opacity="0.45"
      />

      {/* Highlight */}
      <path
        d="M72 90 Q70 110 74 160 L74 280"
        stroke="#ffffff"
        strokeOpacity="0.5"
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
      />

      {/* Label */}
      <rect
        x="50"
        y="160"
        width="120"
        height="190"
        fill={p.label}
        stroke="#1a1612"
        strokeWidth="1.5"
        opacity="0.98"
      />
      {/* Label inner accent */}
      <rect
        x="54"
        y="164"
        width="112"
        height="182"
        fill="none"
        stroke="#1a1612"
        strokeWidth="0.8"
        strokeDasharray="3 3"
        opacity="0.5"
      />

      {/* Just Juice brush text */}
      <text
        x="110"
        y="215"
        textAnchor="middle"
        fill={p.labelText}
        style={{
          fontFamily: "var(--font-display), sans-serif",
          fontSize: "32px",
        }}
      >
        Just
      </text>
      <text
        x="110"
        y="252"
        textAnchor="middle"
        fill={p.labelText}
        style={{
          fontFamily: "var(--font-display), sans-serif",
          fontSize: "32px",
        }}
      >
        Juice
      </text>

      {/* Flavor chip */}
      <rect
        x="70"
        y="275"
        width="80"
        height="22"
        rx="11"
        fill={p.labelText}
        opacity="0.92"
      />
      <text
        x="110"
        y="290"
        textAnchor="middle"
        fill={p.label}
        style={{
          fontFamily: "var(--font-jakarta), sans-serif",
          fontSize: "9px",
          letterSpacing: "2px",
        }}
      >
        {flavor.toUpperCase().replace("-", " + ")}
      </text>

      {/* Little leaf */}
      <path
        d="M75 195 Q65 185 68 172 Q80 178 82 195 Z"
        fill="#4a7c2a"
      />
      <path
        d="M145 330 Q155 322 158 310 Q148 310 143 325 Z"
        fill="#4a7c2a"
      />

      {/* Size marks */}
      <g opacity="0.5" fill={p.labelText} fontFamily="var(--font-jakarta), sans-serif" fontSize="6">
        <text x="158" y="318">500ml</text>
        <text x="158" y="328">350ml</text>
        <text x="158" y="338">300ml</text>
      </g>
    </svg>
  );
}
