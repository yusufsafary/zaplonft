import { Reveal } from "./Reveal";

/** $ZAP launch malam ini 21 November 17:00 UTC di PancakeSwap (dipercepat dari 2 Desember, perintah Yusup 2026-11-21); $ZAP yang tidak diklaim dibakar saat launch. */
export default function LaunchBand() {
  return (
    <section id="launch" className="border-b border-steel/50">
      <div className="mx-auto max-w-[1400px] px-4 md:px-8 py-12 md:py-16">
        <Reveal>
          <p className="label text-volt mb-3">Launch · PancakeSwap</p>
          <h2 className="display text-3xl md:text-5xl font-extrabold uppercase leading-[0.95]">
            $ZAP launches <span className="serif-it normal-case text-volt text-[1.15em]">tonight</span>.
          </h2>
          <p className="mt-4 max-w-2xl text-paper2/85 text-base md:text-lg leading-relaxed">
            The pool opens on PancakeSwap today, 21 November at 17:00 UTC, and the pool address is
            published at that moment. Claim before launch: every Pass still
            unclaimed when the pool opens loses its 500,000 $ZAP, and that $ZAP
            is burned. Until then $ZAP moves only one way: from the claim pool to
            holders, 500,000 at a time.
          </p>
          <p className="label text-[11px] text-volt mt-7">
            PancakeSwap · 21 November · 17:00 UTC · Unclaimed $ZAP burns at launch
          </p>
        </Reveal>
      </div>
    </section>
  );
}
