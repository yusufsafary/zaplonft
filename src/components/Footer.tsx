import { CONFIG } from "@/config";
import { SECTIONS } from "@/data/content";
import { shortAddress } from "@/lib/format";

const CONTRACTS = [
  { label: "NFT · ZaploAgenticPass", addr: CONFIG.contract.address },
  { label: "$ZAP token", addr: CONFIG.claim.token.address },
  { label: "Claim · ZaploClaim", addr: CONFIG.claim.address },
];

export default function Footer() {
  return (
    <footer id="footer" className="relative border-t border-steel/60">
      <div className="mx-auto max-w-[1400px] px-4 md:px-8 py-12">
        <div className="flex flex-wrap items-start justify-between gap-10">
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
            <a href="/zaplo-skill.md" className="label text-[11px] text-ash hover:text-paper transition-colors">Mint skill file</a>
            <a href="/zaplo-claim-skill.md" className="label text-[11px] text-ash hover:text-paper transition-colors">Claim skill file</a>
          </nav>
          <div className="flex flex-col gap-2">
            <p className="label text-[10px] text-ash mb-1">Contracts · BscScan</p>
            {CONTRACTS.map((c) => (
              <a
                key={c.addr}
                className="mono text-[12px] text-paper2/85 hover:text-volt transition-colors"
                href={`https://bscscan.com/address/${c.addr}`}
                target="_blank"
                rel="noreferrer"
              >
                {c.label} · {shortAddress(c.addr, 8, 6)} ↗
              </a>
            ))}
            <a className="label text-[11px] text-ash hover:text-volt transition-colors mt-3" href={CONFIG.links.x} target="_blank" rel="noreferrer">X · @zaplonl ↗</a>
          </div>
        </div>
        <div className="hairline-t mt-10 pt-5 flex flex-wrap justify-between gap-3">
          <p className="label text-[10px] text-ash">© 2026 {CONFIG.brand} · {CONFIG.domain}</p>
          <p className="label text-[10px] text-ash">Read-only page. Agents mint and claim; keys never touch this site.</p>
        </div>
      </div>
    </footer>
  );
}
