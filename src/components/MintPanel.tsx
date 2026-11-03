import { useEffect, useState } from "react";
import { CONFIG } from "@/config";
import { useCountUp, useInView } from "@/hooks";
import { addrArg, readContract, SEL } from "@/lib/read";
import { isAddress, num, shortAddress } from "@/lib/format";
import { Reveal, SectionHead } from "./Reveal";

const PROMPT = `Mint ZAPLO charge cells for me. Read https://zaplo.nl/zaplo-skill.md and follow it exactly: use my Binance Agentic Wallet on BNB Smart Chain, check that I hold a SPACE ID Agent ID, read the ZAPLO contract state, then call mint() — one cell per call, up to 5 cells for my wallet. The NFT is free; read currentPrice() on the contract and send exactly that value as the anti-bot commission. Show me the preview before you execute, and if the preview fails, tell me which check failed instead of retrying with a different value.`;

const CLI = `# one-time setup
curl -fsSL https://github.com/binance/binance-skills-hub/raw/main/skills/binance-agentic-wallet/SKILL.md
baw wallet status        # must be connected
baw wallet agent-id      # must show a claimed Agent ID

# then give your agent the prompt above`;

export function CopyBtn({ text, label }: { text: string; label: string }) {
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

function WalletCheck() {
  const [addr, setAddr] = useState("");
  const [out, setOut] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const run = async () => {
    const a = addr.trim();
    if (!isAddress(a)) {
      setOut("That does not look like a wallet address. Paste a full 0x address.");
      return;
    }
    setBusy(true);
    setOut("Reading the chain…");
    const arg = addrArg(a);
    const [agent, held, left] = await Promise.all([
      readContract(CONFIG.contract.address, SEL.holdsAgentId + arg),
      readContract(CONFIG.contract.address, SEL.balanceOf + arg),
      readContract(CONFIG.contract.address, SEL.remaining + arg),
    ]);
    setBusy(false);
    if (agent === null && held === null) {
      setOut("The chain did not answer. Try again in a moment.");
      return;
    }
    const parts: string[] = [];
    parts.push(agent !== null && agent > 0n ? "Agent ID: held ✓" : "Agent ID: not held. Claim one free in the Binance App before minting.");
    if (held !== null) parts.push(`Cells held: ${num(Number(held))}`);
    if (left !== null) parts.push(`Mint slots left: ${num(Number(left))} of ${CONFIG.supply.maxPerWallet}`);
    setOut(parts.join(" · "));
  };

  return (
    <div className="mt-6 border border-steel/60 bg-black/50 p-4 min-w-0">
      <label className="label text-[10px] text-ash" htmlFor="zap-who">Check a wallet</label>
      <div className="mt-2.5 flex gap-2">
        <input
          id="zap-who"
          value={addr}
          onChange={(e) => setAddr(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && run()}
          placeholder="0x…"
          autoComplete="off"
          spellCheck={false}
          className="field mono !text-[13px]"
        />
        <button className="btn btn-solid !py-2 !px-4 text-[11px] shrink-0" onClick={run} disabled={busy}>
          <span>{busy ? "…" : "Check"}</span>
        </button>
      </div>
      {out ? <p className="mono text-[12px] leading-relaxed text-paper2 mt-3">{out}</p> : null}
    </div>
  );
}

export default function MintPanel() {
  const [minted, setMinted] = useState<number | null>(null);
  const [open, setOpen] = useState<boolean | null>(null);
  const { ref, inView } = useInView<HTMLDivElement>(0.3);
  const shown = useCountUp(minted ?? 0, 1400, inView && minted !== null);

  useEffect(() => {
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
    const id = window.setInterval(tick, 30000);
    return () => { stop = true; window.clearInterval(id); };
  }, []);

  const pctMinted = minted !== null ? Math.min(100, (minted / CONFIG.supply.total) * 100) : 0;
  const left = minted !== null ? CONFIG.supply.total - minted : null;

  return (
    <section id="mint" className="relative overflow-x-clip bg-ink2/40 border-b border-steel/50">
      <div className="mx-auto max-w-[1400px] px-4 md:px-8 py-12 md:py-16">
        <SectionHead index="01 / Mint" title="Struck by agents only" sub="No mint button lives on this page, by design. Cells are struck exclusively through Binance Agentic Wallet: your agent reads the skill file, calls the contract, and you confirm in your wallet. Minting itself is free; a small anti-bot commission keeps the bots out." />
        <div className="grid lg:grid-cols-[380px_1fr] gap-4">
          <Reveal className="min-w-0">
            <div className="border border-steel/70 bg-ink p-6 h-full flex flex-col">
              <img src="/zaplo-art.webp" alt="ZAPLO: a rack of five charge cells" className="w-full max-w-full h-auto border border-steel/60 bg-black" decoding="async" />
              <div className="flex items-baseline justify-between mt-6">
                <span className="label text-[11px] text-ash">Cells struck</span>
                <span className="label text-[11px]" style={{ color: open === null ? "var(--color-ash)" : open ? "var(--color-live)" : "var(--color-volt)" }}>
                  {open === null ? "SYNCING" : open ? "MINT LIVE" : "MINT PAUSED"}
                </span>
              </div>
              <div ref={ref}>
                <p className="display tnum text-5xl font-extrabold mt-2">
                  {minted !== null ? num(shown) : "—"}<span className="text-ash text-3xl"> / {num(CONFIG.supply.total)}</span>
                </p>
              </div>
              <div className="mt-4 h-2 bg-graphite overflow-hidden">
                <div className="h-full bg-volt transition-all duration-700" style={{ width: `${pctMinted}%` }} />
              </div>
              <dl className="mono text-[13px] mt-6 space-y-1.5">
                <div className="flex justify-between"><span className="text-ash">Left to strike</span><span>{left !== null ? num(left) : "—"}</span></div>
                <div className="flex justify-between"><span className="text-ash">Price</span><span className="text-volt">FREE</span></div>
                <div className="flex justify-between"><span className="text-ash">Anti-bot commission</span><span>a few cents / mint</span></div>
                <div className="flex justify-between"><span className="text-ash">Max per wallet</span><span>{CONFIG.supply.maxPerWallet} cells</span></div>
                <div className="flex justify-between"><span className="text-ash">Gate</span><span>SPACE ID Agent ID</span></div>
                <div className="flex justify-between gap-4"><span className="text-ash">Contract</span><a className="text-volt hover:underline" href={`https://bscscan.com/address/${CONFIG.contract.address}`} target="_blank" rel="noreferrer">{shortAddress(CONFIG.contract.address, 8, 6)} ↗</a></div>
              </dl>
            </div>
          </Reveal>
          <Reveal delay={90} className="min-w-0">
            <div className="border border-steel/70 bg-ink p-6 h-full">
              <p className="label text-[11px] text-ash mb-5">Mint in three steps, through your agent</p>
              <ol className="space-y-5">
                <li className="flex gap-4">
                  <span className="serif-it text-3xl text-volt leading-none">I</span>
                  <div>
                    <p className="display text-lg font-bold">Hold an Agent ID</p>
                    <p className="text-sm text-paper2/85 mt-1">Claim it free in the Binance Wallet app under your Agentic Wallet. Nothing proceeds without it; the gate is read on-chain at every mint.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="serif-it text-3xl text-volt leading-none">II</span>
                  <div className="flex-1 min-w-0">
                    <p className="display text-lg font-bold">Send your agent this prompt</p>
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
                    <p className="text-sm text-paper2/85 mt-1">Your agent shows a preview first. One call strikes one cell; repeat up to five per wallet.</p>
                  </div>
                </li>
              </ol>
              <WalletCheck />
              <p className="mt-5 text-sm leading-relaxed text-paper2/75">
                A mint that fails almost always fails for one of four reasons: no Agent ID
                in the wallet, a commission value that differs from currentPrice() by even
                one wei, a call routed through another contract, or too little BNB for
                commission plus gas. Each one shows in the preview before anything is signed.
              </p>
              <div className="mt-6 border border-steel/60 bg-black/50 p-4 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <span className="label text-[10px] text-ash">Setup · terminal</span>
                  <CopyBtn text={CLI} label="Copy" />
                </div>
                <pre className="mono text-[12px] leading-relaxed text-paper2 whitespace-pre-wrap [overflow-wrap:anywhere]">{CLI}</pre>
              </div>
              <p className="label text-[10px] text-ash mt-5">
                Machine-readable instructions: <a className="text-volt underline decoration-dotted" href="/zaplo-skill.md" target="_blank" rel="noreferrer">zaplo.nl/zaplo-skill.md</a>. Your agent fetches this itself from the prompt.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
