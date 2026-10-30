import { useEffect, useState } from "react";
import { CONFIG } from "@/config";
import { useCountUp, useInView } from "@/hooks";
import { readContract, SEL } from "@/lib/read";
import { num } from "@/lib/format";
import { Reveal, SectionHead } from "./Reveal";

const PROMPT = `Mint ZAPLO charge cells for me. Read https://zaplo.nl/zaplo-skill.md and follow it exactly: use my Binance Agentic Wallet on BNB Smart Chain, check that I hold a SPACE ID Agent ID, read the ZAPLO contract state, then call mint() — one cell per call, up to 5 cells for my wallet. The NFT is free; I only pay the small anti-bot commission shown in my wallet confirmation. Show me the preview before you execute.`;

const CLI = `# one-time setup
curl -fsSL https://github.com/binance/binance-skills-hub/raw/main/skills/binance-agentic-wallet/SKILL.md
baw wallet status        # must be connected
baw wallet agent-id      # must show a claimed Agent ID

# then give your agent the prompt above`;

function CopyBtn({ text, label }: { text: string; label: string }) {
  const [ok, setOk] = useState(false);
  return (
    <button
      className="btn btn-ghost !py-2 !px-3 text-[11px]"
      onClick={async () => {
        try { await navigator.clipboard.writeText(text); } catch { /* clipboard tidak tersedia */ }
        setOk(true);
        window.setTimeout(() => setOk(false), 1600);
      }}
    >
      <span>{ok ? "Copied ✓" : label}</span>
    </button>
  );
}

export default function MintPanel() {
  const live = CONFIG.contract.address.length > 0;
  const [minted, setMinted] = useState<number | null>(null);
  const [open, setOpen] = useState<boolean | null>(null);
  const { ref, inView } = useInView<HTMLDivElement>(0.3);
  const shown = useCountUp(minted ?? 0, 1400, inView && minted !== null);

  useEffect(() => {
    if (!live) return;
    let stop = false;
    const tick = async () => {
      const [t, o] = await Promise.all([
        readContract(CONFIG.contract.address, SEL.totalMinted),
        readContract(CONFIG.contract.address, SEL.mintOpen),
      ]);
      if (stop) return;
      if (t !== null) setMinted(Number(t));
      if (o !== null) setOpen(o > 0n);
    };
    tick();
    const id = window.setInterval(tick, 20000);
    return () => { stop = true; window.clearInterval(id); };
  }, [live]);

  const pctMinted = minted !== null ? Math.min(100, (minted / CONFIG.supply.total) * 100) : 0;

  return (
    <section id="mint" className="relative bg-ink2/40 border-y border-steel/50">
      <div className="mx-auto max-w-[1400px] px-4 md:px-8 xl:pl-[108px] py-12 md:py-24">
        <SectionHead index="06 / Mint" title="Minted by agents only" sub="There is no mint button on this page — by design. ZAPLO cells are struck exclusively through Binance Agentic Wallet: your agent reads the skill file, calls the contract, and you confirm in your wallet. Free mint; a small anti-bot commission keeps the bots out." />
        <div className="grid lg:grid-cols-[380px_1fr] gap-4">
          <Reveal>
            <div className="border border-steel/70 bg-ink p-6 h-full flex flex-col">
              <img src="/zaplo-art.webp" alt="ZAPLO — a rack of five charge cells" className="w-full border border-steel/60 bg-black" decoding="async" />
              <div className="flex items-baseline justify-between mt-6">
                <span className="label text-[11px] text-ash">Cells struck</span>
                <span className="label text-[11px]" style={{ color: !live ? "var(--color-ash)" : open ? "var(--color-live)" : "var(--color-volt)" }}>
                  {!live ? "DEPLOYING" : open ? "MINT LIVE" : "COMING SOON"}
                </span>
              </div>
              <div ref={ref}>
                <p className="display tnum text-5xl font-extrabold mt-2">
                  {live && minted !== null ? num(shown) : "—"}<span className="text-ash text-3xl"> / {num(CONFIG.supply.total)}</span>
                </p>
              </div>
              <div className="mt-4 h-2 bg-graphite overflow-hidden">
                <div className="h-full bg-volt transition-all duration-700" style={{ width: `${pctMinted}%` }} />
              </div>
              <dl className="mono text-[13px] mt-6 space-y-1.5">
                <div className="flex justify-between"><span className="text-ash">Price</span><span className="text-volt">FREE</span></div>
                <div className="flex justify-between"><span className="text-ash">Anti-bot commission</span><span>a few cents / mint</span></div>
                <div className="flex justify-between"><span className="text-ash">Max per wallet</span><span>{CONFIG.supply.maxPerWallet} cells</span></div>
                <div className="flex justify-between"><span className="text-ash">Gate</span><span>SPACE ID Agent ID</span></div>
              </dl>
              <p className="label text-[10px] text-ash mt-6">
                {live ? <>Contract <span className="mono normal-case">{CONFIG.contract.address}</span></> : "Contract address appears here the moment it deploys — state above then reads live from chain every 20 seconds."}
              </p>
            </div>
          </Reveal>
          <Reveal delay={90}>
            <div className="border border-steel/70 bg-ink p-6 h-full">
              <p className="label text-[11px] text-ash mb-5">Mint in three steps — through your agent</p>
              <ol className="space-y-5">
                <li className="flex gap-4">
                  <span className="serif-it text-3xl text-volt leading-none">I</span>
                  <div>
                    <p className="display text-lg font-bold">Give your agent the Binance Agentic Wallet skill</p>
                    <p className="text-sm text-paper2/85 mt-1">One-time setup, below. Your wallet must hold a SPACE ID Agent ID — claim it free in the Binance App.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="serif-it text-3xl text-volt leading-none">II</span>
                  <div className="flex-1">
                    <p className="display text-lg font-bold">Send it this prompt</p>
                    <div className="mt-2 border border-steel/60 bg-black/50 p-4">
                      <p className="mono text-[12.5px] leading-relaxed text-paper2">{PROMPT}</p>
                      <div className="mt-3 flex justify-end"><CopyBtn text={PROMPT} label="Copy prompt" /></div>
                    </div>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="serif-it text-3xl text-volt leading-none">III</span>
                  <div>
                    <p className="display text-lg font-bold">Confirm in your wallet</p>
                    <p className="text-sm text-paper2/85 mt-1">Your agent shows a preview first. The NFT is free — the only amount you confirm is the small anti-bot commission. One call strikes one cell; repeat up to five.</p>
                  </div>
                </li>
              </ol>
              <div className="mt-6 border border-steel/60 bg-black/50 p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="label text-[10px] text-ash">Setup · terminal</span>
                  <CopyBtn text={CLI} label="Copy" />
                </div>
                <pre className="mono text-[12px] leading-relaxed text-paper2 overflow-x-auto whitespace-pre">{CLI}</pre>
              </div>
              <p className="label text-[10px] text-ash mt-5">
                Machine-readable instructions: <a className="text-volt underline decoration-dotted" href="/zaplo-skill.md" target="_blank" rel="noreferrer">zaplo.nl/zaplo-skill.md</a> — your agent fetches this itself from the prompt.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
