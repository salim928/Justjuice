import type { Metadata } from "next";
import { Caveat_Brush, Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const caveat = Caveat_Brush({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-caveat-brush",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  axes: ["SOFT", "WONK", "opsz"],
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "JustJuice — Nature in Every Sip | Fresh Juice in Accra",
  description:
    "Cold-pressed, 100% natural fruit blends handmade in Teshie-Nungua, Accra. Mango, Pineapple-Ginger-Mint, Pineapple-Beetroot, Tigernut, Sobolo and more.",
  keywords: [
    "fresh juice Accra",
    "natural juice Ghana",
    "tigernut drink",
    "sobolo hibiscus",
    "mango juice Teshie",
    "JustJuice",
  ],
  openGraph: {
    title: "JustJuice — Nature in Every Sip",
    description:
      "100% natural, cold-pressed juice blends made fresh in Accra.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${caveat.variable} ${fraunces.variable} ${jakarta.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
