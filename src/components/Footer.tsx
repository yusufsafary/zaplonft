import { CONFIG } from "@/config";
import { SECTIONS } from "@/data/content";

export default function Footer() {
  return (
    <footer id="footer" className="relative border-t border-steel/60">
      <div className="mx-auto max-w-[1400px] px-4 md:px-8 xl:pl-[108px] py-12">
        <div className="flex flex-wrap items-start justify-between gap-8">
          <div>
            <p className="display text-3xl font-extrabold">{CONFIG.brand} <span className="text-volt">⚡</span></p>
            <p className="serif-it text-paper2/80 mt-1">{CONFIG.tagline}</p>
            <p className="label text-[10px] text-ash mt-4">{CONFIG.supply.total.toLocaleString("en-US")} cells · {CONFIG.network.name} · {CONFIG.contract.standard}</p>
          </div>
          <nav className="grid grid-cols-2 gap-x-12 gap-y-2">
            {SECTIONS.slice(1, 7).map((s) => (
              <a key={s.id} href={`#${s.id}`} className="label text-[11px] text-ash hover:text-paper transition-colors">{s.label}</a>
            ))}
          </nav>
          <div className="flex flex-col gap-2">
            <a className="label text-[11px] text-ash hover:text-volt transition-colors" href={CONFIG.links.x} target="_blank" rel="noreferrer">X / Twitter ↗</a>
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
