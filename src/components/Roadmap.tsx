import { ROADMAP } from "@/data/content";
import { Reveal, SectionHead } from "./Reveal";

const TONE: Record<string, string> = {
  done: "var(--color-live)",
  live: "var(--color-volt)",
  next: "var(--color-ash)",
};

export default function Roadmap() {
  return (
    <section id="roadmap" className="relative">
      <div className="mx-auto max-w-[1400px] px-4 md:px-8 xl:pl-[108px] py-12 md:py-24">
        <SectionHead index="07 / Roadmap" title="Milestones, struck in order" sub="The roadmap is indexed to the mint counter, not the calendar. When the counter crosses a line, the line ships." />
        <div className="border-t border-steel/60">
          {ROADMAP.map((r, i) => (
            <Reveal key={r.at} delay={i * 40}>
              <div className="grid md:grid-cols-[180px_1fr_auto] gap-3 md:gap-8 items-baseline py-6 border-b border-steel/60">
                <span className="mono tnum text-2xl md:text-3xl text-paper">{r.at}</span>
                <div>
                  <h3 className="display text-xl md:text-2xl font-bold">{r.title}</h3>
                  <p className="text-paper2/85 mt-1 max-w-2xl">{r.body}</p>
                </div>
                <span className="label text-[11px]" style={{ color: TONE[r.status] }}>{r.status.toUpperCase()}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
