import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Ticker from "@/components/Ticker";
import Blends from "@/components/Blends";
import PriceList from "@/components/PriceList";
import Story from "@/components/Story";
import OrderCTA from "@/components/OrderCTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="relative overflow-x-clip">
      <Nav />
      <Hero />
      <Ticker />
      <Blends />
      <PriceList />
      <Story />
      <OrderCTA />
      <Footer />
    </main>
  );
}
