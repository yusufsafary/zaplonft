import { Reveal } from "./Reveal";

/** $ZAP launch 18 November di PancakeSwap; $ZAP yang tidak diklaim dibakar saat launch (perintah Yusup 2026-11-13). */
export default function LaunchBand() {
  return (
    <section id="launch" className="border-b border-steel/50">
      <div className="mx-auto max-w-[1400px] px-4 md:px-8 py-12 md:py-16">
        <Reveal>
          <p className="label text-volt mb-3">Launch · PancakeSwap</p>
          <h2 className="display text-3xl md:text-5xl font-extrabold uppercase leading-[0.95]">
            $ZAP launches <span className="serif-it normal-case text-volt text-[1.15em]">18 November</span>.
          </h2>
          <p className="mt-4 max-w-2xl text-paper2/85 text-base md:text-lg leading-relaxed">
            The pool opens on PancakeSwap on 18 November, and the pool address is
            published at that moment. Claim before launch: every Pass still
            unclaimed when the pool opens loses its 500,000 $ZAP, and that $ZAP
            is burned. Until then $ZAP moves only one way: from the claim pool to
            holders, 500,000 at a time.
          </p>
          <p className="label text-[11px] text-volt mt-7">
            PancakeSwap · 18 November · Unclaimed $ZAP burns at launch
          </p>
        </Reveal>
      </div>
    </section>
  );
}
