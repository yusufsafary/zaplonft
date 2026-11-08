import { CONFIG } from "@/config";
import { shortAddress } from "@/lib/format";
import { Reveal } from "./Reveal";

const ROWS = [
  { name: "Zaplo Pass", kind: "NFT · ZaploAgenticPass", addr: CONFIG.contract.address, bscscan: true },
  { name: "$ZAP", kind: "Token · ZAPToken", addr: CONFIG.claim.token.address, bscscan: false },
  { name: "Zaplo Claim", kind: "Claim · ZaploClaim", addr: CONFIG.claim.address, bscscan: false },
  { name: "Zaplo Market", kind: "Market · ZaploMarket", addr: "0x4F6542b61D77C9140fD8189Bf2fAB87cA2a386Aa", bscscan: false },
];

function Chip({ children, strong = false }: { children: React.ReactNode; strong?: boolean }) {
  return (
    <span
      className={`label text-[10px] inline-flex items-center gap-1.5 border px-2.5 py-1.5 ${
        strong ? "border-volt bg-volt text-ink font-semibold" : "border-volt/50 text-volt"
      }`}
    >
      {children}
    </span>
  );
}

export default function Verified() {
  return (
    <section id="verified" className="relative border-b border-steel/50">
      <div className="mx-auto max-w-[1400px] px-4 md:px-8 py-12 md:py-16">
        <Reveal>
          <p className="label text-volt mb-3">Verification · On-chain proof</p>
          <h2 className="display text-3xl md:text-5xl font-extrabold uppercase leading-[0.95]">
            Verified, <span className="serif-it normal-case text-volt text-[1.15em]">twice.</span>
          </h2>
          <p className="mt-4 max-w-2xl text-paper2/85 text-base md:text-lg leading-relaxed">
            Every Zaplo contract is public and verified. The code that runs the
            cells is the code you can read, byte for byte. No trust required.
          </p>
        </Reveal>
        <Reveal delay={90}>
          <div className="mt-9 border-t border-steel/50">
            {ROWS.map((r) => (
              <div
                key={r.addr}
                className="group flex flex-wrap items-center gap-x-5 gap-y-3 border-b border-steel/50 py-5 transition-colors hover:bg-volt/[0.04]"
              >
                <div className="min-w-[180px] flex-1">
                  <p className="display text-xl font-bold">{r.name}</p>
                  <p className="label text-[10px] text-ash mt-1">{r.kind}</p>
                </div>
                <p className="mono tnum text-sm text-paper2/85">{shortAddress(r.addr, 10, 8)}</p>
                <div className="flex flex-wrap items-center gap-2">
                  <Chip>Sourcify · Exact match</Chip>
                  {r.bscscan && <Chip strong>BscScan · Verified</Chip>}
                </div>
                <div className="flex items-center gap-4">
                  <a
                    className="label text-[11px] text-ash transition-colors hover:text-volt"
                    href={`https://bscscan.com/address/${r.addr}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    BscScan ↗
                  </a>
                  <a
                    className="label text-[11px] text-ash transition-colors hover:text-volt"
                    href={`https://sourcify.dev/#/lookup/${r.addr}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Sourcify ↗
                  </a>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
