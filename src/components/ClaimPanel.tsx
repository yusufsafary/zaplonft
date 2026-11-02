import { useEffect, useState } from "react";
import { CONFIG } from "@/config";
import { useCountUp, useInView } from "@/hooks";
import { readContract, SEL_CLAIM } from "@/lib/read";
import { num } from "@/lib/format";
import { Reveal, SectionHead } from "./Reveal";

const PROMPT = `Claim the $ZAP for my ZAPLO charge cells. Read https://zaplo.nl/zaplo-claim-skill.md and follow it exactly: use my Binance Agentic Wallet on BNB Smart Chain, read the ZaploClaim contract state, find which of my cells are still unclaimed, then call claim(tokenId), one call per cell. Each claim pays out 500,000 $ZAP; I only pay the small anti-bot fee shown in my wallet confirmation. Show me the preview before you execute.`;

const CLI = `# one-time setup (same as the mint)
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

/** Lima sel baterai mini ala artwork resmi; sel tengah berisi petir. */
function Rack() {
  return (
    <div className="flex items-end gap-2" aria-hidden="true">
      {[0, 1, 2, 3, 4].map((i) => (
        <div key={i} className="flex-1">
          <div className="mx-auto h-[6px] w-1/2 border border-b-0 border-volt/80" />
          <div className={`grid h-16 place-items-center border ${i === 2 ? "border-volt bg-volt/10" : "border-steel/80"}`}>
            {i === 2 && (
              <svg viewBox="0 0 32 32" className="size-6 text-volt" aria-hidden="true"><path d="M18.5 3 8 18h6.2L12 29l11-16h-6.6z" fill="currentColor" /></svg>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ClaimPanel() {
  const [claimed, setClaimed] = useState<number | null>(null);
  const [open, setOpen] = useState<boolean | null>(null);
  const { ref, inView } = useInView<HTMLDivElement>(0.3);
  const shown = useCountUp(claimed ?? 0, 1400, inView && claimed !== null);

  useEffect(() => {
    let stop = false;
    const tick = async () => {
      const [t, o] = await Promise.all([
        readContract(CONFIG.claim.address, SEL_CLAIM.totalClaimed),
        readContract(CONFIG.claim.address, SEL_CLAIM.claimOpen),
      ]);
      if (stop) return;
      if (t !== null) setClaimed(Number(t));
      if (o !== null) setOpen(o > 0n);
    };
    tick();
    const id = window.setInterval(tick, 20000);
    return () => { stop = true; window.clearInterval(id); };
  }, []);

  const pctClaimed = claimed !== null ? Math.min(100, (claimed / CONFIG.claim.maxClaimable) * 100) : 0;

  return (
    <section id="claim" className="relative overflow-x-clip bg-ink border-y border-steel/50">
      <div className="mx-auto max-w-[1400px] px-4 md:px-8 xl:pl-[108px] py-12 md:py-24">
        <SectionHead index="07 / Claim" title="Every cell carries $ZAP" sub="Each ZAPLO charge cell entitles its holder to claim 500,000 $ZAP: once per cell, no deadline, following whoever holds the cell today. Claims run through your agent only, exactly like the mint. The $ZAP itself is never sold; a small anti-bot fee keeps the bots out." />
        <div className="grid lg:grid-cols-[380px_1fr] gap-4">
          <Reveal className="min-w-0">
            <div className="border border-steel/70 bg-ink2/40 p-6 h-full flex flex-col">
              <Rack />
              <div className="flex items-baseline justify-between mt-6">
                <span className="label text-[11px] text-ash">Holder claim</span>
                <span className="label text-[11px]" style={{ color: open === null ? "var(--color-ash)" : open ? "var(--color-live)" : "var(--color-volt)" }}>
                  {open === null ? "SYNCING" : open ? "CLAIM LIVE" : "OPENING SOON"}
                </span>
              </div>
              <p className="display tnum text-5xl font-extrabold mt-2">
                {num(CONFIG.claim.perNft)}<span className="text-volt text-3xl"> $ZAP</span>
              </p>
              <p className="label text-[11px] text-ash mt-1">per cell, once per cell</p>
              <div className="flex items-baseline justify-between mt-6">
                <span className="label text-[11px] text-ash">Cells claimed</span>
              </div>
              <div ref={ref}>
                <p className="display tnum text-3xl font-extrabold mt-1">
                  {claimed !== null ? num(shown) : "—"}<span className="text-ash text-xl"> / {num(CONFIG.claim.maxClaimable)}</span>
                </p>
              </div>
              <div className="mt-3 h-2 bg-graphite overflow-hidden">
                <div className="h-full bg-volt transition-all duration-700" style={{ width: `${pctClaimed}%` }} />
              </div>
              <dl className="mono text-[13px] mt-6 space-y-1.5">
                <div className="flex justify-between"><span className="text-ash">Per cell</span><span className="text-volt">{num(CONFIG.claim.perNft)} $ZAP</span></div>
                <div className="flex justify-between"><span className="text-ash">Claim pool</span><span>{num(CONFIG.claim.pool)} $ZAP</span></div>
                <div className="flex justify-between"><span className="text-ash">Anti-bot fee</span><span>a few cents / claim</span></div>
                <div className="flex justify-between"><span className="text-ash">Deadline</span><span>none</span></div>
              </dl>
              <p className="label text-[10px] text-ash mt-6">
                Claim contract <span className="mono normal-case break-all">{CONFIG.claim.address}</span>
                <br />
                $ZAP token <span className="mono normal-case break-all">{CONFIG.claim.token.address}</span>
              </p>
            </div>
          </Reveal>
          <Reveal delay={90} className="min-w-0">
            <div className="border border-steel/70 bg-ink2/40 p-6 h-full">
              <p className="label text-[11px] text-ash mb-5">Claim in three steps: through your agent</p>
              <ol className="space-y-5">
                <li className="flex gap-4">
                  <span className="serif-it text-3xl text-volt leading-none">I</span>
                  <div>
                    <p className="display text-lg font-bold">Hold a cell, keep the same setup</p>
                    <p className="text-sm text-paper2/85 mt-1">The claim uses the same Binance Agentic Wallet skill as the mint. If your agent minted your cells, it can claim their $ZAP too. No new setup, no connect button.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="serif-it text-3xl text-volt leading-none">II</span>
                  <div className="flex-1 min-w-0">
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
                    <p className="text-sm text-paper2/85 mt-1">Your agent shows a preview first. Each confirmed claim sends 500,000 $ZAP straight to your wallet; the only amount you pay is the small anti-bot fee in the confirmation. One call claims one cell; repeat for every cell you hold.</p>
                  </div>
                </li>
              </ol>
              <div className="mt-6 border border-steel/60 bg-black/50 p-4 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <span className="label text-[10px] text-ash">Setup · terminal</span>
                  <CopyBtn text={CLI} label="Copy" />
                </div>
                <pre className="mono text-[12px] leading-relaxed text-paper2 whitespace-pre-wrap [overflow-wrap:anywhere]">{CLI}</pre>
              </div>
              <p className="label text-[10px] text-ash mt-5">
                Machine-readable instructions: <a className="text-volt underline decoration-dotted" href="/zaplo-claim-skill.md" target="_blank" rel="noreferrer">zaplo.nl/zaplo-claim-skill.md</a>. Your agent fetches this itself from the prompt.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
