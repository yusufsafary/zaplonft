import { CONFIG } from "@/config";
import { SECTIONS } from "@/data/content";

export default function Footer() {
  return (
    <footer id="footer" className="relative border-t border-steel/60">
      <div className="mx-auto max-w-[1400px] px-4 md:px-8 xl:pl-[108px] py-12">
        <div className="flex flex-wrap items-start justify-between gap-8">
          <div>
            <p className="display text-3xl font-extrabold">{CONFIG.brand} <svg viewBox="0 0 32 32" className="inline-block size-[0.72em] text-volt -translate-y-[0.08em]" aria-hidden="true"><path d="M18.5 3 8 18h6.2L12 29l11-16h-6.6z" fill="currentColor" /></svg></p>
            <p className="serif-it text-paper2/80 mt-1">{CONFIG.tagline}</p>
            <p className="label text-[10px] text-ash mt-4">{CONFIG.supply.total.toLocaleString("en-US")} cells · {CONFIG.network.name} · {CONFIG.contract.standard}</p>
          </div>
          <nav className="grid grid-cols-2 gap-x-12 gap-y-2">
            {SECTIONS.slice(1).map((s) => (
              <a key={s.id} href={`#${s.id}`} className="label text-[11px] text-ash hover:text-paper transition-colors">{s.label}</a>
            ))}
            <a href="/guide/" className="label text-[11px] text-ash hover:text-paper transition-colors">Guide</a>
            <a href="/guide/#idea" className="label text-[11px] text-ash hover:text-paper transition-colors">The Idea</a>
            <a href="/guide/#tiers" className="label text-[11px] text-ash hover:text-paper transition-colors">The Rack</a>
            <a href="/guide/#gate" className="label text-[11px] text-ash hover:text-paper transition-colors">The Gate</a>
            <a href="/guide/#faq" className="label text-[11px] text-ash hover:text-paper transition-colors">FAQ</a>
          </nav>
          <div className="flex flex-col gap-2">
            <a className="label text-[11px] text-ash hover:text-volt transition-colors" href={CONFIG.links.x} target="_blank" rel="noreferrer">X · @zaplonl ↗</a>
            <a className="label text-[11px] text-ash hover:text-volt transition-colors" href={CONFIG.links.discord} target="_blank" rel="noreferrer">Discord ↗</a>
            <a className="label text-[11px] text-ash hover:text-volt transition-colors" href="https://github.com/yusufsafary/zaplonft" target="_blank" rel="noreferrer">GitHub ↗</a>
            <a className="label text-[11px] text-ash hover:text-volt transition-colors" href={CONFIG.links.mirror} target="_blank" rel="noreferrer">Mirror ↗</a>
          </div>
        </div>
        <div className="hairline-t mt-10 pt-5 flex flex-wrap justify-between gap-3">
          <p className="label text-[10px] text-ash">© 2026 {CONFIG.brand} · {CONFIG.domain}</p>
          <p className="label text-[10px] text-ash">Five charges per agent. Then ground.</p>
        </div>
      </div>
    </footer>
  );
}
