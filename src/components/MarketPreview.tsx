import { CONFIG } from "@/config";
import { num, shortAddress } from "@/lib/format";
import { Reveal, SectionHead } from "./Reveal";

export default function MarketPreview() {
  return (
    <section id="market" className="relative overflow-x-clip">
      <div className="mx-auto max-w-[1400px] px-4 md:px-8 py-12 md:py-24">
        <SectionHead
          index="03 / Market"
          title="Hand to hand."
          sub="Cells are ordinary BEP-721 tokens after the strike: list them, gift them, or buy a rack someone else assembled. Trading settles wallet to wallet on Element, and a cell's $ZAP claim travels with the cell, whoever holds it on claim day."
        />
        <div className="grid lg:grid-cols-[1fr_360px] gap-4">
          <Reveal className="min-w-0">
            <div className="border border-steel/70 bg-ink2/40 p-6 h-full flex flex-col">
              <div className="flex items-baseline justify-between">
                <span className="label text-[11px] text-ash">Secondary market</span>
                <span className="label text-[11px] text-live">OPEN</span>
              </div>
              <p className="mt-5 text-paper2/85 text-base md:text-lg max-w-xl">
                Buying a cell second-hand buys its claim too, as long as that cell has not
                claimed yet. Check any cell number in the claim section above before you
                pay for one: claimed cells trade as pure collectibles.
              </p>
              <dl className="mono text-[13px] mt-6 space-y-1.5">
                <div className="flex justify-between gap-4"><span className="text-ash">Asset</span><span className="text-right">ZAPLO charge cells · BEP-721</span></div>
                <div className="flex justify-between gap-4"><span className="text-ash">Supply</span><span className="text-right">{num(CONFIG.supply.total)} cells, hard cap</span></div>
                <div className="flex justify-between gap-4"><span className="text-ash">Venue</span><span className="text-right">Element · BNB Chain</span></div>
                <div className="flex justify-between gap-4"><span className="text-ash">Contract</span><a className="text-volt hover:underline" href={`https://bscscan.com/address/${CONFIG.contract.address}`} target="_blank" rel="noreferrer">{shortAddress(CONFIG.contract.address, 8, 6)} ↗</a></div>
              </dl>
              <div className="mt-8 flex flex-wrap gap-3">
                <a className="btn btn-solid" href="https://element.market/collections/zaplo" target="_blank" rel="noreferrer">
                  <span>Trade on Element ↗</span>
                </a>
                <a className="btn btn-ghost" href="#claim">
                  <span>Check a cell first</span>
                </a>
              </div>
            </div>
          </Reveal>
          <Reveal delay={90} className="min-w-0">
            <div className="border border-steel/70 bg-ink p-6 h-full flex flex-col">
              <img src="/zaplo-art.webp" alt="ZAPLO: a rack of five charge cells" className="w-full max-w-full h-auto border border-steel/60 bg-black" decoding="async" />
              <p className="label text-[10px] text-ash mt-4">
                One rack, five cells. Every struck cell trades as its own token, claim attached until claimed.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
