import type { ReactNode } from "react";
import { useInView } from "@/hooks";

export function Reveal({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const { ref, inView } = useInView<HTMLDivElement>(0.12);
  return (
    <div ref={ref} className={`reveal ${inView ? "is-in" : ""} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

export function SectionHead({ index, title, sub }: { index: string; title: string; sub?: string }) {
  return (
    <Reveal>
      <div className="mb-10 md:mb-14">
        <p className="label text-volt mb-3">{index}</p>
        <h2 className="display text-4xl md:text-6xl font-extrabold uppercase leading-[0.95] tracking-tight">{title}</h2>
        {sub ? <p className="mt-4 max-w-2xl text-paper2/80 text-base md:text-lg">{sub}</p> : null}
      </div>
    </Reveal>
  );
}
