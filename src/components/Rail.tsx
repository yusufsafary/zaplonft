import { SECTIONS } from "@/data/content";
import { useActiveSection, useScrollProgress } from "@/hooks";

export default function Rail() {
  const active = useActiveSection(SECTIONS.map((s) => s.id));
  const p = useScrollProgress();
  return (
    <aside className="fixed left-0 top-0 bottom-0 z-40 hidden xl:flex w-[76px] flex-col items-center border-r border-steel/60 bg-ink/60 backdrop-blur-sm pt-[96px] pb-6">
      <div className="flex flex-col gap-4">
        {SECTIONS.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            title={s.label}
            className={`label text-[10px] writing-mode-vertical transition-colors ${active === s.id ? "text-volt" : "text-ash hover:text-paper"}`}
            style={{ writingMode: "vertical-rl" }}
          >
            {s.label}
          </a>
        ))}
      </div>
      <div className="mt-auto w-[3px] h-28 bg-steel/70 relative overflow-hidden rounded-full">
        <div className="absolute top-0 left-0 w-full bg-volt" style={{ height: `${Math.round(p * 100)}%` }} />
      </div>
    </aside>
  );
}
