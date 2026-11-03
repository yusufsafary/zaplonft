import Nav from "@/components/Nav";
import Hero, { useHeroStats } from "@/components/Hero";
import CellStrip from "@/components/CellStrip";
import MintPanel from "@/components/MintPanel";
import ClaimPanel from "@/components/ClaimPanel";
import MarketPreview from "@/components/MarketPreview";
import Footer from "@/components/Footer";
import MobileNav from "@/components/MobileNav";

export default function App() {
  const stats = useHeroStats();
  return (
    <div className="min-h-screen bg-ink text-paper pb-[76px] lg:pb-0">
      <Nav />
      <main>
        <Hero stats={stats} />
        <CellStrip minted={stats.minted} />
        <MintPanel />
        <ClaimPanel />
        <MarketPreview />
      </main>
      <Footer />
      <MobileNav />
    </div>
  );
}
