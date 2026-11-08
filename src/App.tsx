import Nav from "@/components/Nav";
import Hero, { useHeroStats } from "@/components/Hero";
import LaunchBand from "@/components/LaunchBand";
import MintPanel from "@/components/MintPanel";
import ClaimPanel from "@/components/ClaimPanel";
import Footer from "@/components/Footer";
import MobileNav from "@/components/MobileNav";

function AnnouncementBar() {
  return (
    <a
      href="/roadmap/"
      className="mt-[64px] flex items-center justify-center gap-3 bg-volt px-4 py-2 text-center text-ink transition-colors hover:bg-paper"
    >
      <span className="label text-[11px] font-semibold">$ZAP is not trading yet · PancakeSwap launch date to be announced</span>
      <span className="label text-[11px] hidden sm:inline">Roadmap →</span>
    </a>
  );
}

export default function App() {
  const stats = useHeroStats();
  return (
    <div className="min-h-screen bg-ink text-paper pb-[76px] lg:pb-0">
      <Nav />
      <main>
        <AnnouncementBar />
        <Hero stats={stats} />
        <LaunchBand />
        <MintPanel />
        <ClaimPanel />
      </main>
      <Footer />
      <MobileNav />
    </div>
  );
}
