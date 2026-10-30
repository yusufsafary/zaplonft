import Nav from "@/components/Nav";
import Rail from "@/components/Rail";
import Hero from "@/components/Hero";
import SpecSheet from "@/components/SpecSheet";
import Idea from "@/components/Idea";
import Tiers from "@/components/Tiers";
import Arc from "@/components/Arc";
import Agent from "@/components/Agent";
import Gate from "@/components/Gate";
import MintPanel from "@/components/MintPanel";
import Roadmap from "@/components/Roadmap";
import Faq from "@/components/Faq";
import Footer from "@/components/Footer";
import MobileNav from "@/components/MobileNav";

export default function App() {
  return (
    <div className="min-h-screen bg-ink text-paper pb-[76px] lg:pb-0">
      <Nav />
      <Rail />
      <main>
        <Hero />
        <SpecSheet />
        <Idea />
        <Tiers />
        <Arc />
        <Agent />
        <Gate />
        <MintPanel />
        <Roadmap />
        <Faq />
      </main>
      <Footer />
      <MobileNav />
    </div>
  );
}
