import { STEPS } from "@/data/content";
import { Reveal, SectionHead } from "./Reveal";

export default function Idea() {
  return (
    <section id="idea" className="relative">
      <div className="mx-auto max-w-[1400px] px-4 md:px-8 xl:pl-[108px] py-12 md:py-24">
        <SectionHead index="01 / The Idea" title="One rack per agent" sub="An agent does not need a vault of bolts. It needs one rack — five cells that strike, carry, surge, drain and ground together, on a timer the chain keeps for free." />
        <div className="grid md:grid-cols-3 gap-4">
          {STEPS.map((s, i) => (
            <Reveal key={s.numeral} delay={i * 90}>
              <article className="h-full border border-steel/70 bg-ink2/60 p-6 flex flex-col">
                <span className="serif-it text-5xl text-volt">{s.numeral}</span>
                <h3 className="display text-2xl font-bold mt-4">{s.title}</h3>
                <p className="text-paper2/85 mt-3 flex-1">{s.body}</p>
                <p className="label text-[11px] text-ash mt-6 pt-4 border-t border-steel/50">{s.meta}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
