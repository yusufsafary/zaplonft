import { CONFIG } from "@/config";
import { useCountdown } from "@/hooks";
import { num } from "@/lib/format";
import { Reveal } from "./Reveal";
import type { HeroStats } from "./Hero";

/** Peluncuran $ZAP di PancakeSwap: 8 November 2026, 00.00 UTC. */
export const LAUNCH_ISO = "2026-11-08T00:00:00Z";

function Cell({ v, label }: { v: string; label: string }) {
  return (
    <div className="border border-steel/70 bg-ink px-3 py-3 text-center md:px-5">
      <p className="display tnum text-3xl font-extrabold leading-none text-volt md:text-5xl">{v}</p>
      <p className="label text-[9px] text-ash mt-2">{label}</p>
    </div>
  );
}

export default function LaunchBand({ stats }: { stats: HeroStats }) {
  const cd = useCountdown(LAUNCH_ISO);
  const p = (n: number) => String(n).padStart(2, "0");
  return (
    <section id="launch" className="relative overflow-x-clip border-b border-steel/50 bg-ink">
      <div className="mx-auto max-w-[1400px] px-4 md:px-8 py-12 md:py-16">
        <Reveal>
          <p className="label text-volt mb-3">Launch · PancakeSwap</p>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <h2 className="display text-4xl md:text-6xl font-extrabold uppercase leading-[0.95] tracking-tight">
              $ZAP goes live.
            </h2>
            <p className="mono tnum text-[13px] text-paper2/85">
              STRUCK <b className="text-volt">{stats.minted !== null ? num(stats.minted) : "—"}</b>
              <span className="text-ash"> / {num(CONFIG.supply.total)}</span>
              {"  ·  "}CLAIMED <b className="text-volt">{stats.claimed !== null ? num(stats.claimed) : "—"}</b>
              <span className="text-ash"> CELLS</span>
            </p>
          </div>
          <p className="mt-4 max-w-2xl text-paper2/80 text-base md:text-lg">
            Trading opens on PancakeSwap on 8 November 2026, 00.00 UTC. Until then $ZAP
            moves only one way: from the claim pool to holders, 500,000 at a time. Pool
            address and opening details are published here and on X at the moment trading opens.
          </p>
        </Reveal>
        <Reveal delay={90}>
          {cd.past ? (
            <p className="mono tnum mt-8 border border-volt/60 bg-volt/10 px-4 py-3 text-volt">
              $ZAP IS LIVE ON PANCAKESWAP · 8 NOVEMBER 2026
            </p>
          ) : (
            <div className="mt-8 grid max-w-xl grid-cols-4 gap-2">
              <Cell v={String(cd.days)} label="Days" />
              <Cell v={p(cd.hours)} label="Hours" />
              <Cell v={p(cd.minutes)} label="Minutes" />
              <Cell v={p(cd.seconds)} label="Seconds" />
            </div>
          )}
        </Reveal>
      </div>
    </section>
  );
}
