import { useState } from "react";
import { CONFIG } from "@/config";
import { DEMO_WHITELIST } from "@/data/content";
import { useLocalState } from "@/hooks";
import { clockStamp, isAddress, shortAddress } from "@/lib/format";
import { applicationHash } from "@/lib/hash";
import { Reveal, SectionHead } from "./Reveal";

type Found = { address: string; agentId: string; slots: number; tier: string; block: number } | null;
type Application = { address: string; agentId: string; hash: string; at: string };

export default function WhitelistGate() {
  const [addr, setAddr] = useState("");
  const [result, setResult] = useState<{ kind: "idle" | "found" | "missing" | "invalid" | "checking"; entry?: Found }>({ kind: "idle" });
  const [agentId, setAgentId] = useState("");
  const [apps, setApps] = useLocalState<Application[]>("zaplo:applications", []);
  const [receipt, setReceipt] = useState<Application | null>(null);

  async function check() {
    const a = addr.trim();
    if (!isAddress(a)) { setResult({ kind: "invalid" }); return; }
    setResult({ kind: "checking" });
    const lower = a.toLowerCase();
    if (CONFIG.whitelist.sourceUrl) {
      try {
        const res = await fetch(CONFIG.whitelist.sourceUrl);
        const text = await res.text();
        let list: string[] = [];
        try {
          const j = JSON.parse(text);
          list = Array.isArray(j) ? j.map((x) => String(x).toLowerCase()) : [];
        } catch {
          list = text.split(/[\s,;]+/).map((x) => x.trim().toLowerCase()).filter(Boolean);
        }
        setResult(list.includes(lower) ? { kind: "found", entry: { address: a, agentId: "—", slots: CONFIG.supply.maxPerWallet, tier: "Whitelisted", block: 0 } } : { kind: "missing" });
        return;
      } catch { /* jatuh ke daftar demo */ }
    }
    const hit = DEMO_WHITELIST.find((w) => w.address.toLowerCase() === lower) ?? null;
    setResult(hit ? { kind: "found", entry: hit } : { kind: "missing" });
  }

  function apply() {
    const a = addr.trim();
    if (!isAddress(a) || !agentId.trim()) return;
    const entry: Application = { address: a, agentId: agentId.trim(), hash: applicationHash(`${a.toLowerCase()}\n${agentId.trim()}`), at: new Date().toISOString() };
    setApps([entry, ...apps].slice(0, 12));
    setReceipt(entry);
  }

  return (
    <section id="whitelist" className="relative">
      <div className="mx-auto max-w-[1400px] px-4 md:px-8 xl:pl-[108px] py-16 md:py-24">
        <SectionHead index="05 / Whitelist" title="The gate" sub={`${CONFIG.whitelist.requirement}. ${CONFIG.whitelist.note}`} />
        <div className="grid lg:grid-cols-2 gap-4">
          <Reveal>
            <div className="border border-steel/70 bg-ink2/60 p-6 h-full">
              <p className="label text-[11px] text-ash mb-4">Check an address</p>
              <div className="flex flex-col sm:flex-row gap-3">
                <input className="field flex-1" placeholder="0x… wallet address" value={addr} onChange={(e) => setAddr(e.target.value)} spellCheck={false} />
                <button className="btn btn-solid shrink-0" onClick={check} disabled={result.kind === "checking"}><span>{result.kind === "checking" ? "Checking…" : "Check"}</span></button>
              </div>
              <div className="mt-5 min-h-[92px]">
                {result.kind === "found" && result.entry ? (
                  <div className="border border-live/50 bg-live/10 px-4 py-3">
                    <p className="label text-[11px] text-live">✓ Whitelisted · slot secured</p>
                    <dl className="mono text-[13px] mt-2 grid grid-cols-2 gap-x-6 gap-y-1">
                      <span className="text-ash">Agent ID</span><span>{result.entry.agentId}</span>
                      <span className="text-ash">Slots</span><span>{result.entry.slots} cells</span>
                      <span className="text-ash">Tier</span><span>{result.entry.tier}</span>
                      {result.entry.block ? (<><span className="text-ash">Snapshot block</span><span>{result.entry.block}</span></>) : null}
                    </dl>
                  </div>
                ) : result.kind === "missing" ? (
                  <div className="border border-oxide/50 bg-oxide/10 px-4 py-3">
                    <p className="label text-[11px] text-oxide">✗ Not on the list</p>
                    <p className="text-sm text-paper2/85 mt-2">This address holds no slot in the current snapshot ({CONFIG.schedule.snapshotLabel}). Submit it below before the gate closes.</p>
                  </div>
                ) : result.kind === "invalid" ? (
                  <p className="label text-[11px] text-oxide">That is not a valid EVM address.</p>
                ) : (
                  <p className="text-sm text-paper2/70">Demo registry loaded — {DEMO_WHITELIST.length} addresses from the snapshot are wired in for testing. Try one: <button className="mono text-volt underline decoration-dotted" onClick={() => setAddr(DEMO_WHITELIST[0].address)}>{shortAddress(DEMO_WHITELIST[0].address)}</button></p>
                )}
              </div>
              <p className="label text-[10px] text-ash mt-4">Whitelist window: {CONFIG.schedule.whitelistOpen.slice(0, 10)} → {CONFIG.schedule.whitelistClose.slice(0, 10)} · {CONFIG.schedule.snapshotLabel}</p>
            </div>
          </Reveal>
          <Reveal delay={90}>
            <div className="border border-steel/70 bg-ink2/60 p-6 h-full">
              <p className="label text-[11px] text-ash mb-4">Submit for the snapshot — {clockStamp()} UTC</p>
              <div className="flex flex-col gap-3">
                <input className="field" placeholder="0x… wallet address" value={addr} onChange={(e) => setAddr(e.target.value)} spellCheck={false} />
                <input className="field" placeholder="Agent ID (e.g. yourname.ai)" value={agentId} onChange={(e) => setAgentId(e.target.value)} spellCheck={false} />
                <button className="btn btn-ghost" onClick={apply}><span>Submit application</span></button>
              </div>
              {receipt ? (
                <div className="mt-5 border border-volt/50 bg-volt/10 px-4 py-3">
                  <p className="label text-[11px] text-volt">Application recorded locally</p>
                  <p className="mono text-[12px] break-all mt-2">{receipt.hash}</p>
                  <p className="text-[12px] text-paper2/75 mt-2">Reference hash for {shortAddress(receipt.address)} · {receipt.agentId}. Demo build: applications live in this browser only — wire a backend before production.</p>
                </div>
              ) : apps.length ? (
                <p className="label text-[10px] text-ash mt-5">{apps.length} application(s) stored in this browser.</p>
              ) : null}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
