# JustJuice — One-Pager

A hand-crafted, intentionally un-corporate landing page for JustJuice, a fresh-juice brand in Teshie-Nungua, Accra.

Built with **Next.js 16.2**, **Tailwind CSS 4**, **Motion**, and **TypeScript**.

---

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Build for production

```bash
npm run build
npm run start
```

## Deploy

Drops straight onto Vercel, Netlify, or any Node host. No environment variables required.

---

## File structure

```
justjuice/
├── app/
│   ├── globals.css       ← Tailwind v4 theme tokens, grain, marquee, torn-paper masks
│   ├── layout.tsx        ← Fonts (Caveat Brush, Fraunces, Plus Jakarta Sans) + metadata
│   └── page.tsx          ← Composes all sections
├── components/
│   ├── Nav.tsx           ← Floating pill nav, scroll-aware
│   ├── Hero.tsx          ← Big brush-script headline, rotating flavor, sticker badge
│   ├── BottleIllustration.tsx  ← SVG bottle component, 5 flavor palettes
│   ├── Ticker.tsx        ← Black marquee strip
│   ├── Blends.tsx        ← Product grid (5 flavors + "many more" card)
│   ├── PriceList.tsx     ← Receipt-style menu with your exact prices
│   ├── Story.tsx         ← Dark about section with 3 brand pillars
│   ├── OrderCTA.tsx      ← Call / WhatsApp / Email / Location
│   └── Footer.tsx        ← Giant wordmark + links
├── package.json
├── tsconfig.json
├── next.config.mjs
├── postcss.config.mjs
└── next-env.d.ts
```

---

## Where to change business details

| What | File | Line-ish |
|---|---|---|
| Phone number | `components/Nav.tsx`, `components/OrderCTA.tsx`, `components/PriceList.tsx` | Search `0508726113` |
| Email | `components/OrderCTA.tsx` | Search `sandalatifa20` |
| Location / address | `components/OrderCTA.tsx`, `components/PriceList.tsx`, `components/Hero.tsx` | Search `Teshie-Nungua` |
| Price list | `components/PriceList.tsx` | `categories` array at the top |
| Blend descriptions | `components/Blends.tsx` | `blends` array at the top |
| Page title / SEO | `app/layout.tsx` | `metadata` object |

---

## Design notes

The whole aesthetic leans away from the typical "startup SaaS" look on purpose. Choices:

- **Brush-script display font (Caveat Brush)** to echo the hand-painted "JUST JUICE" on your actual bottle labels.
- **Warm cream background** (`#fef8ed`) instead of pure white — reads like paper, not screen.
- **Paper-grain overlay** via inline SVG noise filter — zero image assets.
- **Colors lifted from your actual bottles** — the mango orange, lime green, beet red, hibiscus pink, tigernut cream all map to real ingredients.
- **Torn-paper edges and tape stickers** — gives it the feel of a small shop's physical menu board.
- **Illustrated SVG bottles** (not photos) — stays sharp at any size, loads instant, stylistically consistent.

All animations use Motion's `whileInView` with `once: true` so they play as the user scrolls, not on repeat.

---

## Adding real bottle photos later

When you're ready to replace the SVG bottles with the actual product photos you uploaded:

1. Drop photos into `/public/bottles/` (e.g. `mango.jpg`, `pineapple-ginger.jpg`)
2. In `components/Blends.tsx`, replace the `<BottleIllustration ... />` call with:
   ```tsx
   import Image from "next/image";
   <Image src={`/bottles/${b.id}.jpg`} alt={b.name} width={200} height={400} />
   ```
3. Same swap works in `Hero.tsx`.

The SVG bottles are a solid placeholder and will hold up in production if you want to ship today without photo prep.
# Justjuice
