import { CONFIG } from "@/config";
import { SECTIONS } from "@/data/content";
import { getMintStatus, statusLabel, statusTone } from "@/lib/status";

export default function Nav() {
  const status = getMintStatus();
  return (
    <header className="fixed top-0 inset-x-0 z-50 border-b border-steel/60 bg-ink/95 lg:bg-ink/85 lg:backdrop-blur-md">
      <div className="mx-auto flex h-[64px] max-w-[1400px] items-center gap-6 px-4 md:px-8">
        <a href="#top" className="flex items-center gap-3 shrink-0">
          <span className="grid size-9 place-items-center rounded-[7px] bg-volt text-ink">
            <svg viewBox="0 0 32 32" className="size-5" aria-hidden="true"><path d="M18.5 3 8 18h6.2L12 29l11-16h-6.6z" fill="currentColor" /></svg>
          </span>
          <span className="display text-xl font-extrabold tracking-wide">{CONFIG.brand}</span>
        </a>
        <nav className="hidden lg:flex items-center gap-5 ml-4">
          {SECTIONS.slice(1).map((s) => (
            <a key={s.id} href={`#${s.id}`} className="label text-[11px] text-ash hover:text-paper transition-colors">
              {s.label.split("/")[1]?.trim() ?? s.label}
            </a>
          ))}
          <a href="/guide/" className="label text-[11px] text-ash hover:text-paper transition-colors">
            Guide
          </a>
        </nav>
        <div className="ml-auto flex items-center gap-3">
          <span className="label hidden sm:inline-flex items-center gap-2 text-[11px]" style={{ color: statusTone(status) }}>
            <span className="pulse-dot inline-block size-2 rounded-full" style={{ background: statusTone(status) }} />
            {statusLabel(status)}
          </span>
          <a href="#mint" className="btn btn-solid !py-2.5 !px-4 text-[11px]"><span>Mint</span></a>
        </div>
      </div>
    </header>
  );
}
