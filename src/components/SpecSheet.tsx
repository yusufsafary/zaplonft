import { CONFIG } from "@/config";
import { num, utcStamp } from "@/lib/format";
import { Reveal } from "./Reveal";

const rows: [string, string][] = [
  ["Collection", `${CONFIG.brand} — charge cells`],
  ["Total supply", `${num(CONFIG.supply.total)} cells`],
  ["Max per wallet", `${CONFIG.supply.maxPerWallet} cells · lifetime counter`],
  ["Eligible wallets", `${num(CONFIG.supply.wallets)} (supply / cap)`],
  ["Mint price", "Free — anti-bot commission only, confirmed in your Agentic Wallet"],
  ["Chain", `${CONFIG.network.name} · chainId ${CONFIG.network.chainId}`],
  ["Standard", CONFIG.contract.standard],
  ["The arc", `${CONFIG.arc.epochs} epochs × ${CONFIG.arc.hoursPerEpoch}h = ${CONFIG.arc.totalHours}h`],
  ["Stored charge", CONFIG.arc.reward],
  ["Gate", "SPACE ID Agent ID, checked on-chain at every mint"],
  ["Mint opens (UTC)", utcStamp(CONFIG.schedule.mintStart)],
  ["Contract", CONFIG.contract.address ? CONFIG.contract.address : "Not deployed yet — site runs in simulation mode"],
];

export default function SpecSheet() {
  return (
    <section className="relative">
      <div className="mx-auto max-w-[1400px] px-4 md:px-8 xl:pl-[108px] py-14 md:py-20">
        <Reveal>
          <div className="border border-steel/70">
            <div className="flex items-center justify-between border-b border-steel/70 px-5 py-3 bg-ink2/70">
              <span className="label text-[11px] text-ash">Spec sheet</span>
              <span className="label text-[11px] text-volt">Read before you strike</span>
            </div>
            <dl className="grid md:grid-cols-2">
              {rows.map(([k, v], i) => (
                <div key={k} className={`flex items-baseline justify-between gap-6 px-5 py-3.5 ${i % 2 === 0 ? "md:border-r" : ""} border-b border-steel/40`}>
                  <dt className="label text-[11px] text-ash shrink-0">{k}</dt>
                  <dd className="mono text-[13px] text-right text-paper">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
