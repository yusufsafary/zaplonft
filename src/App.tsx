import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Countdown from "@/components/Countdown";
import MintPanel from "@/components/MintPanel";
import Footer from "@/components/Footer";
import MobileNav from "@/components/MobileNav";

export default function App() {
  return (
    <div className="min-h-screen bg-ink text-paper pb-[76px] lg:pb-0">
      <Nav />
      <main>
        <Hero />
        <Countdown />
        <MintPanel />
      </main>
      <Footer />
      <MobileNav />
    </div>
  );
}
