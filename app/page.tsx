import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Ticker from "@/components/Ticker";
import Blends from "@/components/Blends";
import PriceList from "@/components/PriceList";
import Story from "@/components/Story";
import OrderCTA from "@/components/OrderCTA";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import { CartProvider } from "@/components/CartContext";
import { readCatalog } from "@/lib/products";

export const dynamic = "force-dynamic";

export default async function Home() {
  const { products } = await readCatalog();

  return (
    <CartProvider>
      <main className="relative overflow-x-clip">
        <Nav />
        <Hero />
        <Ticker />
        <Blends products={products} />
        <PriceList products={products} />
        <Story />
        <OrderCTA />
        <Footer />
        <CartDrawer />
      </main>
    </CartProvider>
  );
}
