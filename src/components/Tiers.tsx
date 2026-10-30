import { TIERS, TIER_TOTAL } from "@/data/content";
import { num, pct } from "@/lib/format";
import { Reveal, SectionHead } from "./Reveal";

const HUE: Record<string, string> = {
  volt: "var(--color-volt)",
  cobalt: "var(--color-cobalt)",
  oxide: "var(--color-oxide)",
  live: "var(--color-live)",
  paper: "var(--color-paper)",
};

export default function Tiers() {
  return (
    <section id="tiers" className="relative bg-ink2/40 border-y border-steel/50">
      <div className="mx-auto max-w-[1400px] px-4 md:px-8 xl:pl-[108px] py-12 md:py-24">
        <SectionHead index="02 / The Rack" title="Five cells, five tempers" sub={`The rack holds ${num(TIER_TOTAL)} cells across five tiers. Voltage is not a rarity score — it is what the cell does while it carries its charge.`} />
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4">
          {TIERS.map((t, i) => (
            <Reveal key={t.numeral} delay={i * 70}>
              <article className="h-full border border-steel/70 bg-ink p-4 md:p-5 flex flex-col relative overflow-hidden">
                <span className="absolute inset-x-0 top-0 h-[3px]" style={{ background: HUE[t.hue] }} />
                <div className="flex items-baseline justify-between">
                  <span className="serif-it text-4xl" style={{ color: HUE[t.hue] }}>{t.numeral}</span>
                  <span className="mono tnum text-sm text-ash">{t.volts}</span>
                </div>
                <h3 className="display text-2xl font-bold mt-3">{t.name}</h3>
                <p className="mono tnum text-volt text-lg mt-1">{num(t.count)} cells</p>
                <p className="label text-[10px] text-ash">{pct(t.count, TIER_TOTAL)} of supply</p>
                <p className="text-sm text-paper2/85 mt-4 flex-1">{t.blurb}</p>
                <p className="label text-[10px] mt-5 pt-4 border-t border-steel/50" style={{ color: HUE[t.hue] }}>{t.trait}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
