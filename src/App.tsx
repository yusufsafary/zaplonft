import Nav from "@/components/Nav";
import Hero, { useHeroStats } from "@/components/Hero";
import LaunchBand from "@/components/LaunchBand";
import MintPanel from "@/components/MintPanel";
import ClaimPanel from "@/components/ClaimPanel";
import Verified from "@/components/Verified";
import Footer from "@/components/Footer";
import MobileNav from "@/components/MobileNav";

/** Latar premium: grid hidup, cahaya volt melayang, sapuan cahaya, grain halus. */
function Backdrop() {
  return (
    <div className="bg-scene" aria-hidden="true">
      <div className="bg-grid-pan" />
      <div className="bg-orb bg-orb-volt" />
      <div className="bg-orb bg-orb-deep" />
      <div className="bg-orb bg-orb-low" />
      <div className="bg-sheen" />
      <div className="bg-grain" />
    </div>
  );
}

function AnnouncementBar() {
  return (
    <a
      href="/roadmap/"
      className="mt-[64px] flex items-center justify-center gap-3 bg-volt px-4 py-2 text-center text-ink transition-colors hover:bg-paper"
    >
      <span className="label text-[11px] font-semibold">$ZAP launches 18 November on PancakeSwap · Unclaimed $ZAP will be burned</span>
      <span className="label text-[11px] hidden sm:inline">Roadmap →</span>
    </a>
  );
}

export default function App() {
  const stats = useHeroStats();
  return (
    <div className="relative min-h-screen bg-ink text-paper pb-[76px] lg:pb-0">
      <Backdrop />
      <div className="relative z-10">
        <Nav />
        <main>
          <AnnouncementBar />
          <Hero stats={stats} />
          <LaunchBand />
          <MintPanel />
          <ClaimPanel />
          <Verified />
        </main>
        <Footer />
        <MobileNav />
      </div>
    </div>
  );
}
