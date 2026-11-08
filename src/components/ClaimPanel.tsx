import { useEffect, useState } from "react";
import { CONFIG } from "@/config";
import { useCountUp, useInView } from "@/hooks";
import { readAddress, readContract, SEL, SEL_CLAIM, uintArg } from "@/lib/read";
import { num, shortAddress } from "@/lib/format";
import { Reveal, SectionHead } from "./Reveal";
import { CopyBtn } from "./MintPanel";

const PROMPT = `Claim the $ZAP for my ZAPLO charge cells. Read https://zaplo.nl/zaplo-claim-skill.md and follow it exactly: use my Binance Agentic Wallet on BNB Smart Chain, read the ZaploClaim contract state, find which of my cells are still unclaimed, then call claim(tokenId), one call per cell. Each claim pays out 500,000 $ZAP; read claimFee() on the claim contract and send exactly that value. Show me the preview before you execute, and if the preview fails, tell me which check failed instead of retrying with a different value.`;

const CLI = `# one-time setup (same as the mint)
curl -fsSL https://github.com/binance/binance-skills-hub/raw/main/skills/binance-agentic-wallet/SKILL.md
baw wallet status        # must be connected
baw wallet agent-id      # must show a claimed Agent ID

# then give your agent the prompt above`;

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

function WorkCheck() {
  const [val, setVal] = useState("");
  const [out, setOut] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const run = async () => {
    const id = Number(val.trim());
    if (!Number.isInteger(id) || id < 1 || id > CONFIG.supply.total) {
      setOut(`Enter a cell number between 1 and ${num(CONFIG.supply.total)}.`);
      return;
    }
    setBusy(true);
    setOut("Reading the chain…");
    const arg = uintArg(id);
    const [claimed, owner] = await Promise.all([
      readContract(CONFIG.claim.address, SEL_CLAIM.claimedById + arg),
      readAddress(CONFIG.contract.address, SEL.ownerOf + arg),
    ]);
    setBusy(false);
    if (claimed === null && owner === null) {
      setOut("The chain did not answer. Try again in a moment.");
      return;
    }
    if (owner === null) {
      setOut(`Cell #${num(id)} has not been struck yet. Unminted cells carry no claim.`);
      return;
    }
    setOut(
      claimed !== null && claimed > 0n
        ? `Cell #${num(id)}: already claimed. Its 500,000 $ZAP is gone to whoever held it at claim time. Held now by ${shortAddress(owner, 8, 6)}.`
        : `Cell #${num(id)}: unclaimed. 500,000 $ZAP is waiting for its holder, ${shortAddress(owner, 8, 6)}.`,
    );
  };

  return (
    <div className="mt-6 border border-steel/60 bg-black/50 p-4 min-w-0">
      <label className="label text-[10px] text-ash" htmlFor="zap-work">Check a cell</label>
      <div className="mt-2.5 flex gap-2">
        <input
          id="zap-work"
          value={val}
          onChange={(e) => setVal(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && run()}
          placeholder={`Cell number, 1 to ${num(CONFIG.supply.total)}`}
          inputMode="numeric"
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

export default function ClaimPanel() {
  const [claimed, setClaimed] = useState<number | null>(null);
  const [open, setOpen] = useState<boolean | null>(null);
  const [remaining, setRemaining] = useState<number | null>(null);
  const { ref, inView } = useInView<HTMLDivElement>(0.3);
  const shown = useCountUp(claimed ?? 0, 1400, inView && claimed !== null);

  useEffect(() => {
    let stop = false;
    const tick = async () => {
      const [t, o, r] = await Promise.all([
        readContract(CONFIG.claim.address, SEL_CLAIM.totalClaimed),
        readContract(CONFIG.claim.address, SEL_CLAIM.claimOpen),
        readContract(CONFIG.claim.address, SEL_CLAIM.claimsRemaining),
      ]);
      if (stop) return;
      if (t !== null) setClaimed(Number(t));
      if (o !== null) setOpen(o > 0n);
      if (r !== null) setRemaining(Number(r));
    };
    tick();
    const id = window.setInterval(tick, 30000);
    return () => { stop = true; window.clearInterval(id); };
  }, []);

  const pctClaimed = claimed !== null ? Math.min(100, (claimed / CONFIG.claim.maxClaimable) * 100) : 0;

  return (
    <section id="claim" className="relative overflow-x-clip bg-ink/55 border-b border-steel/50">
      <div className="mx-auto max-w-[1400px] px-4 md:px-8 py-12 md:py-16">
        <SectionHead index="02 / Claim" title="Every cell carries $ZAP" sub="Each ZAPLO charge cell entitles its holder to claim 500,000 $ZAP: once per cell, no deadline, following whoever holds the cell today. Claims run through your agent only, exactly like the mint. $ZAP was never sold; a small anti-bot fee keeps the bots out." />

        <Reveal className="mb-4">
          <div className="flex flex-wrap items-end justify-between gap-4 bg-volt px-5 py-5 text-ink md:px-7">
            <div>
              <p className="label text-[10px] text-ink/60">Holder claim · per cell</p>
              <p className="display tnum text-4xl font-extrabold md:text-5xl">
                {num(CONFIG.claim.perNft)} <span className="text-2xl md:text-3xl">$ZAP</span>
              </p>
            </div>
            <div className="mono text-[12px] tnum text-right leading-relaxed">
              <p>CLAIMED <b>{claimed !== null ? num(claimed) : "—"}</b> / {num(CONFIG.claim.maxClaimable)} CELLS</p>
              <p>STATUS <b>{open === null ? "SYNCING" : open ? "CLAIM LIVE" : "CLAIM PAUSED"}</b> · NO DEADLINE</p>
            </div>
          </div>
        </Reveal>

        <div className="grid lg:grid-cols-[380px_1fr] gap-4">
          <Reveal className="min-w-0">
            <div className="border border-steel/70 bg-ink2/40 p-6 h-full flex flex-col">
              <Rack />
              <div className="flex items-baseline justify-between mt-6">
                <span className="label text-[11px] text-ash">Cells claimed</span>
                <span className="label text-[11px]" style={{ color: open === null ? "var(--color-ash)" : open ? "var(--color-live)" : "var(--color-volt)" }}>
                  {open === null ? "SYNCING" : open ? "CLAIM LIVE" : "OPENING SOON"}
                </span>
              </div>
              <div ref={ref}>
                <p className="display tnum text-5xl font-extrabold mt-2">
                  {claimed !== null ? num(shown) : "—"}<span className="text-ash text-3xl"> / {num(CONFIG.claim.maxClaimable)}</span>
                </p>
              </div>
              <div className="mt-4 h-2 bg-graphite overflow-hidden">
                <div className="h-full bg-volt transition-all duration-700" style={{ width: `${pctClaimed}%` }} />
              </div>
              <dl className="mono text-[13px] mt-6 space-y-1.5">
                <div className="flex justify-between"><span className="text-ash">Per cell</span><span className="text-volt">{num(CONFIG.claim.perNft)} $ZAP</span></div>
                <div className="flex justify-between"><span className="text-ash">Claims left</span><span>{remaining !== null ? num(remaining) : "—"}</span></div>
                <div className="flex justify-between"><span className="text-ash">Claim pool</span><span>{num(CONFIG.claim.pool)} $ZAP</span></div>
                <div className="flex justify-between"><span className="text-ash">Anti-bot fee</span><span>a few cents / claim</span></div>
                <div className="flex justify-between"><span className="text-ash">Deadline</span><span>none</span></div>
              </dl>
              <dl className="mono text-[12px] mt-6 space-y-1.5 border-t border-steel/50 pt-5">
                <div className="flex justify-between gap-4"><span className="text-ash">$ZAP token</span><a className="text-volt hover:underline" href={`https://bscscan.com/address/${CONFIG.claim.token.address}`} target="_blank" rel="noreferrer">{shortAddress(CONFIG.claim.token.address, 8, 6)} ↗</a></div>
                <div className="flex justify-between gap-4"><span className="text-ash">Claim contract</span><a className="text-volt hover:underline" href={`https://bscscan.com/address/${CONFIG.claim.address}`} target="_blank" rel="noreferrer">{shortAddress(CONFIG.claim.address, 8, 6)} ↗</a></div>
                <div className="flex justify-between gap-4"><span className="text-ash">NFT contract</span><a className="text-volt hover:underline" href={`https://bscscan.com/address/${CONFIG.contract.address}`} target="_blank" rel="noreferrer">{shortAddress(CONFIG.contract.address, 8, 6)} ↗</a></div>
              </dl>
            </div>
          </Reveal>
          <Reveal delay={90} className="min-w-0">
            <div className="border border-steel/70 bg-ink2/40 p-6 h-full">
              <p className="label text-[11px] text-ash mb-5">Claim in three steps, through your agent</p>
              <ol className="space-y-5">
                <li className="flex gap-4">
                  <span className="display text-2xl font-bold text-volt leading-none">I</span>
                  <div>
                    <p className="display text-lg font-bold">Hold a cell that has not claimed yet</p>
                    <p className="text-sm text-paper2/85 mt-1">Claims attach to the cell, not to a wallet's history: a cell bought second-hand may already have claimed. Check any cell number below before you start.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="display text-2xl font-bold text-volt leading-none">II</span>
                  <div className="flex-1 min-w-0">
                    <p className="display text-lg font-bold">Send your agent this prompt</p>
                    <div className="mt-2 border border-steel/60 bg-black/50 p-4">
                      <p className="mono text-[12.5px] leading-relaxed text-paper2">{PROMPT}</p>
                      <div className="mt-3 flex justify-end"><CopyBtn text={PROMPT} label="Copy prompt" /></div>
                    </div>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="display text-2xl font-bold text-volt leading-none">III</span>
                  <div>
                    <p className="display text-lg font-bold">Confirm in your wallet</p>
                    <p className="text-sm text-paper2/85 mt-1">500,000 $ZAP arrives in the same transaction. One call claims one cell; repeat for every cell you hold.</p>
                  </div>
                </li>
              </ol>
              <WorkCheck />
              <p className="mt-5 text-sm leading-relaxed text-paper2/75">
                A claim that fails almost always fails for one of five reasons: a cell already
                claimed, possibly by an earlier owner before a sale; a cell held in a different
                wallet than the agentic wallet calling; a fee that differs from claimFee() by
                even one wei; a skill file meant for another collection; or too little BNB for
                fee plus gas. Each one shows in the preview before anything is signed.
              </p>
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
