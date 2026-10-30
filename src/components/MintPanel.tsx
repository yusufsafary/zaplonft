import { useEffect, useRef, useState } from "react";
import { CONFIG } from "@/config";
import { useLocalState } from "@/hooks";
import {
  WALLETS, connectWallet, detectWallets, ensureChain, isLive,
  readBalanceOf, readRemaining, sendMint, type WalletKind,
} from "@/lib/chain";
import { clockStamp, num, shortAddress } from "@/lib/format";
import { keccak } from "@/lib/hash";
import { getMintStatus, statusLabel, statusTone } from "@/lib/status";
import { Reveal, SectionHead } from "./Reveal";

type Line = { t: string; text: string; tone?: "ok" | "err" | "dim" };

export default function MintPanel() {
  const status = getMintStatus();
  const [account, setAccount] = useState<string | null>(null);
  const [qty, setQty] = useState(1);
  const [busy, setBusy] = useState(false);
  const [lines, setLines] = useState<Line[]>([
    { t: clockStamp(), text: isLive ? "console ready — contract live" : "console ready — SIMULATION MODE (no contract deployed)", tone: "dim" },
  ]);
  const [simMinted, setSimMinted] = useLocalState<Record<string, number>>("zaplo:sim:minted", {});
  const [liveOwned, setLiveOwned] = useState<number | null>(null);
  const [liveRemaining, setLiveRemaining] = useState<number | null>(null);
  const logRef = useRef<HTMLDivElement>(null);

  const log = (text: string, tone?: Line["tone"]) =>
    setLines((prev) => [...prev.slice(-60), { t: clockStamp(), text, tone }]);

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight });
  }, [lines]);

  const owned = isLive ? (liveOwned ?? 0) : account ? (simMinted[account] ?? 0) : 0;
  const remaining = isLive ? (liveRemaining ?? CONFIG.supply.maxPerWallet - owned) : CONFIG.supply.maxPerWallet - owned;
  const total = (parseFloat(CONFIG.price.amount) * qty).toFixed(4);

  async function refreshLive(addr: string) {
    const [b, r] = await Promise.all([readBalanceOf(addr), readRemaining(addr)]);
    if (b !== null) setLiveOwned(b);
    if (r !== null) setLiveRemaining(r);
  }

  async function connectSim() {
    const seed = keccak(`ZAPLO/SIM/WALLET\n${Date.now()}\n${Math.random()}`);
    const addr = "0x" + seed.slice(0, 40);
    setAccount(addr);
    log(`simulated agentic wallet connected: ${addr}`);
    log("network: BNB Smart Chain (simulated) · Agent ID verified (simulated)", "dim");
  }

  async function connectLive(kind: WalletKind) {
    try {
      setBusy(true);
      const addr = await connectWallet(kind);
      setAccount(addr);
      log(`wallet connected via ${kind.name}: ${addr}`);
      const chain = await ensureChain();
      log(chain === "failed" ? "chain switch rejected — switch to BSC (56) in your wallet" : "network: BNB Smart Chain (56)", chain === "failed" ? "err" : "ok");
      await refreshLive(addr);
    } catch (e) {
      log(`connect failed: ${e instanceof Error ? e.message : String(e)}`, "err");
    } finally { setBusy(false); }
  }

  async function mintSim() {
    if (!account) return;
    if (qty > remaining) { log(`revert MAX_PER_WALLET — this wallet already struck ${owned}/${CONFIG.supply.maxPerWallet}`, "err"); return; }
    setBusy(true);
    log(`mint(${qty}) → value ${total} BNB (simulated)`);
    await new Promise((r) => setTimeout(r, 650));
    const hash = "0x" + keccak(`ZAPLO/SIM/MINT\n${account}\n${qty}\n${Date.now()}`);
    const next = { ...simMinted, [account]: owned + qty };
    setSimMinted(next);
    log(`tx ${hash}`, "ok");
    log(`receipt: block ${48215505 + Object.values(next).reduce((a, b) => a + b, 0)} · ${qty} cell(s) struck · rack ${owned + qty}/${CONFIG.supply.maxPerWallet}`, "ok");
    setBusy(false);
  }

  async function mintLive() {
    if (!account) return;
    try {
      setBusy(true);
      log(`mint(${qty}) → sending ${total} BNB…`);
      const hash = await sendMint(qty, account);
      log(`tx ${hash}`, "ok");
      log(`track it: ${CONFIG.network.explorer}/tx/${hash}`, "dim");
      await refreshLive(account);
    } catch (e) {
      log(`mint failed: ${e instanceof Error ? e.message : String(e)}`, "err");
    } finally { setBusy(false); }
  }

  const detected = typeof window !== "undefined" ? detectWallets() : [];

  return (
    <section id="mint" className="relative bg-ink2/40 border-y border-steel/50">
      <div className="mx-auto max-w-[1400px] px-4 md:px-8 xl:pl-[108px] py-16 md:py-24">
        <SectionHead index="06 / Mint" title="The mint console" sub={isLive ? "Live contract connected. Your agent signs, the rack fills." : "The contract is not deployed yet, so the console runs a faithful simulation — same caps, same math, no real funds."} />
        <div className="grid lg:grid-cols-[380px_1fr] gap-4">
          <Reveal>
            <div className="border border-steel/70 bg-ink p-6 h-full flex flex-col">
              <div className="flex items-center justify-between">
                <span className="label text-[11px] text-ash">Status</span>
                <span className="label text-[11px]" style={{ color: statusTone(status) }}>{statusLabel(status)}</span>
              </div>
              <div className="mt-6">
                <p className="label text-[11px] text-ash mb-2">Wallet</p>
                {account ? (
                  <p className="mono text-sm break-all">{account}<span className="block text-ash text-[12px] mt-1">{shortAddress(account)} · rack {owned}/{CONFIG.supply.maxPerWallet} · {remaining} slot(s) left</span></p>
                ) : isLive ? (
                  <div className="flex flex-col gap-2">
                    {(detected.length ? detected : WALLETS).map((w) => (
                      <button key={w.id} className="btn btn-ghost justify-start" onClick={() => connectLive(w)} disabled={busy}><span>{w.name} — {w.hint}</span></button>
                    ))}
                  </div>
                ) : (
                  <button className="btn btn-solid w-full" onClick={connectSim} disabled={busy}><span>Connect (simulation)</span></button>
                )}
              </div>
              <div className="mt-6">
                <p className="label text-[11px] text-ash mb-2">Cells</p>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button key={n} onClick={() => setQty(n)} className={`mono tnum flex-1 py-2.5 border text-sm transition-colors ${qty === n ? "border-volt bg-volt text-ink font-semibold" : "border-steel text-paper2 hover:border-volt/60"}`}>{n}</button>
                  ))}
                </div>
              </div>
              <dl className="mono text-[13px] mt-6 space-y-1.5">
                <div className="flex justify-between"><span className="text-ash">Price / cell</span><span>{CONFIG.price.amount} {CONFIG.price.symbol}</span></div>
                <div className="flex justify-between"><span className="text-ash">Quantity</span><span>{qty}</span></div>
                <div className="flex justify-between border-t border-steel/60 pt-2"><span className="text-ash">Total</span><span className="text-volt">{total} {CONFIG.price.symbol}</span></div>
              </dl>
              <button className="btn btn-solid w-full mt-6" disabled={!account || busy || status === "ended"} onClick={isLive ? mintLive : mintSim}>
                <span>{busy ? "Working…" : status === "ended" ? "Mint closed" : `Strike ${qty} cell${qty > 1 ? "s" : ""}`}</span>
              </button>
              <p className="label text-[10px] text-ash mt-4">{isLive ? `Contract ${shortAddress(CONFIG.contract.address, 10, 8)} · verified flow via window.ethereum` : "Simulation — no wallet, no gas, no real transaction."}</p>
            </div>
          </Reveal>
          <Reveal delay={90}>
            <div className="border border-steel/70 bg-black/50 h-full flex flex-col min-h-[420px]">
              <div className="flex items-center justify-between border-b border-steel/60 px-4 py-2.5">
                <span className="label text-[10px] text-ash">zaplo · mint console</span>
                <span className="label text-[10px] text-ash">{num(lines.length)} lines</span>
              </div>
              <div ref={logRef} className="mono text-[12.5px] leading-relaxed p-4 overflow-y-auto flex-1 max-h-[520px]">
                {lines.map((l, i) => (
                  <p key={i} className={l.tone === "ok" ? "text-live" : l.tone === "err" ? "text-oxide" : l.tone === "dim" ? "text-ash" : "text-paper2"}>
                    <span className="text-steel">[{l.t}]</span> {l.text}
                  </p>
                ))}
                <p className="text-ash"><span className="blink">▌</span></p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
