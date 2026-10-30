import { FAQ } from "@/data/content";
import { Reveal, SectionHead } from "./Reveal";

export default function Faq() {
  return (
    <section id="faq" className="relative bg-ink2/40 border-t border-steel/50">
      <div className="mx-auto max-w-[1400px] px-4 md:px-8 xl:pl-[108px] py-16 md:py-24">
        <SectionHead index="08 / FAQ" title="Asked, answered" />
        <div className="grid lg:grid-cols-2 gap-x-10">
          {FAQ.map((f, i) => (
            <Reveal key={f.q} delay={(i % 4) * 50}>
              <details className="group border-b border-steel/60 py-5" {...(i === 0 ? { open: true } : {})}>
                <summary className="flex items-baseline justify-between gap-4">
                  <span className="display text-lg md:text-xl font-bold">{f.q}</span>
                  <span className="mono text-volt text-xl leading-none group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="text-paper2/85 mt-3 max-w-xl">{f.a}</p>
              </details>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
