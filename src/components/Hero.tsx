import { useEffect, useState } from "react";
import { CONFIG } from "@/config";
import { TICKER_ITEMS } from "@/data/content";
import { useCountdown, useCountUp, useInView } from "@/hooks";
import { formatCountdown } from "@/lib/status";
import { isLive, readTotalSupply } from "@/lib/chain";
import { num } from "@/lib/format";

const SIM_MINTED = 1389;

export default function Hero() {
  const cd = useCountdown(CONFIG.schedule.mintStart);
  const [minted, setMinted] = useState<number>(SIM_MINTED);
  const { ref, inView } = useInView<HTMLDivElement>(0.3);
  const shown = useCountUp(minted, 1600, inView);

  useEffect(() => {
    if (!isLive) return;
    let stop = false;
    const tick = async () => {
      const v = await readTotalSupply();
      if (!stop && v !== null) setMinted(v);
    };
    tick();
    const id = window.setInterval(tick, 20000);
    return () => { stop = true; window.clearInterval(id); };
  }, []);

  const pctMinted = Math.min(100, (minted / CONFIG.supply.total) * 100);
  return (
    <section id="top" className="noise gridlines relative overflow-hidden pt-[64px]">
      <div className="mx-auto max-w-[1400px] px-4 md:px-8 xl:pl-[108px] pt-14 md:pt-24 pb-16">
        <div ref={ref} className="reveal-mask is-in">
          <p className="label text-volt mb-5">{CONFIG.network.name} · {CONFIG.contract.standard} · Whitelist only</p>
          <h1 className="display font-extrabold uppercase leading-[0.88] tracking-tight text-[17vw] sm:text-[13vw] lg:text-[9.5rem]">
            Five<br />charges<br /><span className="text-volt">per agent.</span>
          </h1>
        </div>
        <div className="mt-10 grid gap-10 lg:grid-cols-[1.2fr_1fr]">
          <p className="text-lg md:text-xl text-paper2/90 max-w-xl">{CONFIG.lede}</p>
          <div className="border border-steel/70 bg-ink2/70 p-5">
            <div className="flex items-baseline justify-between gap-4">
              <span className="label text-[11px] text-ash">Cells struck</span>
              <span className="label text-[11px] text-ash">{isLive ? "LIVE · on-chain" : "SIMULATION"}</span>
            </div>
            <p className="display tnum text-5xl md:text-6xl font-extrabold mt-2">
              {num(shown)}<span className="text-ash text-3xl md:text-4xl"> / {num(CONFIG.supply.total)}</span>
            </p>
            <div className="mt-4 h-2 bg-graphite overflow-hidden">
              <div className="h-full bg-volt transition-all duration-700" style={{ width: `${pctMinted}%` }} />
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2">
              <span className="label text-[11px] text-ash">Mint opens</span>
              <span className="mono tnum text-volt text-lg">{formatCountdown(cd)}</span>
              <span className="label text-[11px] text-ash">{new Date(CONFIG.schedule.mintStart).toUTCString().slice(0, 25)} UTC</span>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="#mint" className="btn btn-solid"><span>Open the mint console</span></a>
              <a href="#whitelist" className="btn btn-ghost"><span>Check the gate</span></a>
            </div>
          </div>
        </div>
      </div>
      <div className="marquee-host overflow-hidden border-y border-steel/60 bg-ink2/60 py-3">
        <div className="marquee-track flex whitespace-nowrap gap-0 w-max">
          {[0, 1].map((n) => (
            <span key={n} className="label text-[12px] text-ash">
              {TICKER_ITEMS.map((t, i) => (
                <span key={i} className="mx-6"><span className="text-volt mr-6">⚡</span>{t}</span>
              ))}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
