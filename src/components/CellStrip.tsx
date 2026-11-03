import { num } from "@/lib/format";

/**
 * Strip sel terbaru yang sudah ter-strike, bergerak pelan.
 * Diturunkan langsung dari totalMinted on-chain: sel #N sampai #N-23.
 */
export default function CellStrip({ minted }: { minted: number | null }) {
  if (minted === null || minted <= 0) return null;
  const count = Math.min(24, minted);
  const ids = Array.from({ length: count }, (_, i) => minted - i);
  return (
    <div className="marquee-host relative overflow-hidden border-y border-steel/60 bg-ink2/60 py-3" aria-hidden="true">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-ink to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-ink to-transparent" />
      <div className="marquee-track flex w-max whitespace-nowrap" style={{ ["--speed" as string]: "46s" }}>
        {[0, 1].map((half) => (
          <span key={half} className="flex">
            {ids.map((id) => (
              <span key={`${half}-${id}`} className="mx-2 inline-flex items-center gap-2.5 border border-steel/60 bg-ink px-3 py-1.5">
                <svg viewBox="0 0 32 32" className="size-[11px] text-volt" aria-hidden="true">
                  <path d="M18.5 3 8 18h6.2L12 29l11-16h-6.6z" fill="currentColor" />
                </svg>
                <span className="mono text-[11px] tnum text-paper2">CELL #{num(id).padStart(4, "0")}</span>
                <span className="label text-[9px] text-live">STRUCK</span>
              </span>
            ))}
          </span>
        ))}
      </div>
    </div>
  );
}
