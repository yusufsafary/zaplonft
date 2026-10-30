import { useState } from "react";
import { CONFIG } from "@/config";
import { isAddress, shortAddress } from "@/lib/format";
import { readContract, SEL } from "@/lib/read";
import { Reveal, SectionHead } from "./Reveal";

type State =
  | { kind: "idle" }
  | { kind: "invalid" }
  | { kind: "checking" }
  | { kind: "done"; holds: boolean; minted: number };

export default function Gate() {
  const [addr, setAddr] = useState("");
  const [state, setState] = useState<State>({ kind: "idle" });
  const live = CONFIG.contract.address.length > 0;

  async function check() {
    const a = addr.trim();
    if (!isAddress(a)) { setState({ kind: "invalid" }); return; }
    if (!live) { setState({ kind: "idle" }); return; }
    setState({ kind: "checking" });
    const [holds, minted] = await Promise.all([
      readContract(CONFIG.contract.address, SEL.holdsAgentId + a.slice(2).toLowerCase().padStart(64, "0")),
      readContract(CONFIG.contract.address, SEL.paidMintedBy + a.slice(2).toLowerCase().padStart(64, "0")),
    ]);
    setState({ kind: "done", holds: holds !== null && holds > 0n, minted: minted !== null ? Number(minted) : 0 });
  }

  return (
    <section id="gate" className="relative">
      <div className="mx-auto max-w-[1400px] px-4 md:px-8 xl:pl-[108px] py-12 md:py-24">
        <SectionHead index="05 / The Gate" title="One gate: the Agent ID" sub="There is no whitelist and no application form. The contract checks one thing, on-chain, at the moment of minting: does the calling Binance Agentic Wallet hold a verified SPACE ID Agent ID?" />
        <div className="grid lg:grid-cols-2 gap-4">
          <Reveal>
            <div className="border border-steel/70 bg-ink2/60 p-6 h-full">
              <p className="label text-[11px] text-ash mb-4">How the gate works</p>
              <ol className="space-y-4 text-paper2/90">
                <li><span className="mono text-volt mr-3">01</span>Your agent wallet holds a SPACE ID Agent ID (a free claim inside the Binance App).</li>
                <li><span className="mono text-volt mr-3">02</span>At mint, the ZAPLO contract reads the Agent ID registry itself — before price, before supply, before anything.</li>
                <li><span className="mono text-volt mr-3">03</span>No Agent ID, no mint. Calls routed through other contracts are rejected as well — only real agentic wallets strike cells.</li>
              </ol>
              <p className="label text-[10px] text-ash mt-6">Agent ID contract · 0x60B9262456dE011F7d15a54CdD8c48bAaa8B022F · BNB Smart Chain</p>
            </div>
          </Reveal>
          <Reveal delay={90}>
            <div className="border border-steel/70 bg-ink2/60 p-6 h-full">
              <p className="label text-[11px] text-ash mb-4">Check a wallet</p>
              <div className="flex flex-col sm:flex-row gap-3">
                <input className="field flex-1" placeholder="0x… wallet address" value={addr} onChange={(e) => setAddr(e.target.value)} spellCheck={false} />
                <button className="btn btn-solid shrink-0" onClick={check} disabled={state.kind === "checking"}><span>{state.kind === "checking" ? "Checking…" : "Check"}</span></button>
              </div>
              <div className="mt-5 min-h-[76px]">
                {!live ? (
                  <p className="text-sm text-paper2/75">The contract is being deployed — this checker goes live with it. Paste any agentic wallet address then to see its Agent ID status and rack count, read straight from chain. No connection, no signature.</p>
                ) : state.kind === "invalid" ? (
                  <p className="label text-[11px] text-oxide">That is not a valid EVM address.</p>
                ) : state.kind === "done" ? (
                  <div className={`border px-4 py-3 ${state.holds ? "border-live/50 bg-live/10" : "border-oxide/50 bg-oxide/10"}`}>
                    <p className={`label text-[11px] ${state.holds ? "text-live" : "text-oxide"}`}>{state.holds ? "✓ Agent ID held — this wallet can mint" : "✗ No Agent ID — the gate will reject this wallet"}</p>
                    <p className="mono text-[13px] mt-2">{shortAddress(addr.trim())} · rack {state.minted}/{CONFIG.supply.maxPerWallet} cells struck</p>
                  </div>
                ) : (
                  <p className="text-sm text-paper2/70">Read-only check via public RPC — the page never connects to the wallet itself.</p>
                )}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
