import { CONFIG } from "@/config";
import { EPOCHS } from "@/data/content";
import { Reveal, SectionHead } from "./Reveal";

export default function Arc() {
  return (
    <section id="arc" className="relative">
      <div className="mx-auto max-w-[1400px] px-4 md:px-8 xl:pl-[108px] py-16 md:py-24">
        <SectionHead index="03 / The Arc" title={`${CONFIG.arc.totalHours} hours, then ground`} sub={`Every cell runs the same arc: ${CONFIG.arc.epochs} epochs of ${CONFIG.arc.hoursPerEpoch} hours, counted from its mint block. No staking, no claiming — the chain does the counting.`} />
        <div className="relative">
          <svg className="hidden md:block absolute left-0 right-0 top-[26px] w-full h-[10px]" preserveAspectRatio="none" viewBox="0 0 100 10" aria-hidden="true">
            <line x1="0" y1="5" x2="100" y2="5" stroke="var(--color-steel)" strokeWidth="1" />
            <line className="arc-dash" x1="0" y1="5" x2="100" y2="5" stroke="var(--color-volt)" strokeWidth="2" />
          </svg>
          <div className="grid md:grid-cols-5 gap-4">
            {EPOCHS.map((e, i) => (
              <Reveal key={e.n} delay={i * 80}>
                <article className="relative border border-steel/70 bg-ink2/60 p-5 h-full">
                  <span className="stamp inline-grid place-items-center size-[52px] rounded-full border-2 mono tnum font-semibold" style={{ borderColor: e.color, color: e.color }}>{e.n}</span>
                  <h3 className="display text-xl font-bold mt-4">{e.name}</h3>
                  <p className="label text-[10px] text-ash mt-1">Hours {e.hours} · {e.state}</p>
                  <p className="text-sm text-paper2/85 mt-3">{e.text}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
        <Reveal className="mt-8">
          <p className="border border-dashed border-steel px-5 py-4 text-sm text-paper2/85">
            At hour {CONFIG.arc.totalHours} the cell grounds: artwork turns monochrome for good and the stored charge — <span className="text-volt mono">{CONFIG.arc.reward}</span> — is released to the wallet that held the cell at the strike.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
