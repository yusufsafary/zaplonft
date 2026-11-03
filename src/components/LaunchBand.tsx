import { useCountdown } from "@/hooks";
import { Reveal } from "./Reveal";

/** Peluncuran $ZAP di PancakeSwap: 8 November 2026, 00.00 UTC. */
export const LAUNCH_ISO = "2026-11-08T00:00:00Z";

function Cell({ v, label }: { v: string; label: string }) {
  return (
    <div className="border border-steel/60 px-3 py-3 text-center md:px-5">
      <p className="display tnum text-2xl font-extrabold leading-none text-volt md:text-4xl">{v}</p>
      <p className="label text-[9px] text-ash mt-2">{label}</p>
    </div>
  );
}

export default function LaunchBand() {
  const cd = useCountdown(LAUNCH_ISO);
  const p = (n: number) => String(n).padStart(2, "0");
  return (
    <section id="launch" className="border-b border-steel/50">
      <div className="mx-auto max-w-[1400px] px-4 md:px-8 py-12 md:py-16">
        <Reveal>
          <p className="label text-volt mb-3">Launch · PancakeSwap</p>
          <h2 className="display text-3xl md:text-5xl font-extrabold uppercase leading-[0.95] tracking-tight">
            $ZAP goes live.
          </h2>
          <p className="mt-4 max-w-2xl text-paper2/85 text-base md:text-lg leading-relaxed">
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
            <div className="mt-8 grid max-w-lg grid-cols-4 gap-2">
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
