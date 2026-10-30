import { CONFIG } from "@/config";
import { num } from "@/lib/format";
import { Reveal, SectionHead } from "./Reveal";

export default function Agent() {
  const rows: [string, string, string][] = [
    ["Supply / cap", `${num(CONFIG.supply.total)} / ${CONFIG.supply.maxPerWallet}`, `${num(CONFIG.supply.wallets)} racks exist. Ever.`],
    ["One cell", "FREE", "A single charge. An agent with one cell is under-racked."],
    ["A full rack", "FREE × 5", "Five cells in one wallet read on-chain as one closed circuit. The only cost is the anti-bot commission — a few cents per mint, confirmed in the wallet."],
    ["The arc", `${CONFIG.arc.totalHours} hours`, `${CONFIG.arc.epochs} epochs × ${CONFIG.arc.hoursPerEpoch}h, counted from the mint block — free.`],
    ["Stored charge", CONFIG.arc.reward, "Released to the holder when the last cell grounds."],
    ["Sixth cell", "REVERT", "MAX_PER_WALLET. No owner override, no team allocation, no back door."],
  ];
  return (
    <section id="agent" className="relative bg-ink2/40 border-y border-steel/50">
      <div className="mx-auto max-w-[1400px] px-4 md:px-8 xl:pl-[108px] py-12 md:py-24">
        <SectionHead index="04 / Agent Math" title="Arithmetic, not hype" sub="The collection is shaped by one division. Everything else — the cap, the gate, the rack — falls out of it." />
        <Reveal>
          <p className="display tnum text-center font-extrabold leading-none text-[13vw] md:text-[7rem]">
            {num(CONFIG.supply.total)} <span className="text-volt">/</span> {CONFIG.supply.maxPerWallet} <span className="text-volt">=</span> {num(CONFIG.supply.wallets)}
          </p>
        </Reveal>
        <div className="mt-12 border border-steel/70">
          {rows.map(([a, b, c], i) => (
            <Reveal key={a} delay={i * 40}>
              <div className="grid md:grid-cols-[220px_220px_1fr] gap-2 md:gap-6 items-baseline px-5 py-4 border-b border-steel/40 last:border-b-0 bg-ink/60">
                <span className="label text-[11px] text-ash">{a}</span>
                <span className="mono tnum text-volt">{b}</span>
                <span className="text-sm text-paper2/85">{c}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
