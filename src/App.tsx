import Nav from "@/components/Nav";
import Rail from "@/components/Rail";
import Hero from "@/components/Hero";
import SpecSheet from "@/components/SpecSheet";
import Idea from "@/components/Idea";
import Tiers from "@/components/Tiers";
import Arc from "@/components/Arc";
import Agent from "@/components/Agent";
import WhitelistGate from "@/components/WhitelistGate";
import MintPanel from "@/components/MintPanel";
import Roadmap from "@/components/Roadmap";
import Faq from "@/components/Faq";
import Footer from "@/components/Footer";

export default function App() {
  return (
    <div className="min-h-screen bg-ink text-paper">
      <Nav />
      <Rail />
      <main>
        <Hero />
        <SpecSheet />
        <Idea />
        <Tiers />
        <Arc />
        <Agent />
        <WhitelistGate />
        <MintPanel />
        <Roadmap />
        <Faq />
      </main>
      <Footer />
    </div>
  );
}
