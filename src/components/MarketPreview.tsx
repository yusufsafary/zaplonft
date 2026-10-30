import { CONFIG } from "@/config";
import { Reveal, SectionHead } from "./Reveal";

export default function MarketPreview() {
  return (
    <section id="market" className="relative overflow-x-clip border-b border-steel/50">
      <div className="mx-auto max-w-[1400px] px-4 md:px-8 xl:pl-[108px] py-12 md:py-24">
        <SectionHead
          index="07 / Market"
          title="The Cell Market"
          sub="Secondary trading for struck cells — wallet to wallet on BNB Smart Chain. The board opens after the mint runs; until then, this section is the rack it will fill."
        />
        <div className="grid lg:grid-cols-[1fr_360px] gap-4">
          <Reveal className="min-w-0">
            <div className="border border-steel/70 bg-ink p-6 h-full flex flex-col">
              <div className="flex items-baseline justify-between">
                <span className="label text-[11px] text-ash">Market</span>
                <span className="label text-[11px] text-volt">COMING SOON</span>
              </div>
              <p className="mt-5 text-paper2/85 text-base md:text-lg max-w-xl">
                Every cell is a transferable BEP-721 token. Once trading opens, holders can
                list, swap, and ground cells between wallets — settled on-chain, no
                custodian in between.
              </p>
              <dl className="mono text-[13px] mt-6 space-y-1.5">
                <div className="flex justify-between gap-4"><span className="text-ash">Asset</span><span className="text-right">ZAPLO charge cells · BEP-721</span></div>
                <div className="flex justify-between gap-4"><span className="text-ash">Trading</span><span className="text-right">Wallet to wallet, on-chain</span></div>
                <div className="flex justify-between gap-4"><span className="text-ash">Opens</span><span className="text-right">After the mint</span></div>
              </dl>
              <div className="mt-8">
                <a className="btn btn-solid" href={CONFIG.links.x} target="_blank" rel="noreferrer">
                  <span>Opening announced on X · @zaplonl ↗</span>
                </a>
              </div>
            </div>
          </Reveal>
          <Reveal delay={90} className="min-w-0">
            <div className="border border-steel/70 bg-ink p-6 h-full flex flex-col">
              <img src="/zaplo-art.webp" alt="ZAPLO — a rack of five charge cells" className="w-full max-w-full h-auto border border-steel/60 bg-black" decoding="async" />
              <p className="label text-[10px] text-ash mt-4">
                One rack, five cells — every struck cell trades as its own token.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
