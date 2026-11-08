import { Reveal } from "./Reveal";

/** $ZAP belum live di PancakeSwap; tanggal peluncuran baru diumumkan terpisah (perintah Yusup 2026-11-08). */
export default function LaunchBand() {
  return (
    <section id="launch" className="border-b border-steel/50">
      <div className="mx-auto max-w-[1400px] px-4 md:px-8 py-12 md:py-16">
        <Reveal>
          <p className="label text-volt mb-3">Launch · PancakeSwap</p>
          <h2 className="display text-3xl md:text-5xl font-extrabold uppercase leading-[0.95]">
            $ZAP is <span className="serif-it normal-case text-volt text-[1.15em]">not live</span> yet.
          </h2>
          <p className="mt-4 max-w-2xl text-paper2/85 text-base md:text-lg leading-relaxed">
            $ZAP does not trade anywhere yet. A new PancakeSwap launch date will be
            announced here and on X first, and the pool address is published at that
            moment. Until then $ZAP moves only one way: from the claim pool to
            holders, 500,000 at a time.
          </p>
          <p className="label text-[11px] text-volt mt-7">
            Not on PancakeSwap yet · New launch date to be announced
          </p>
        </Reveal>
      </div>
    </section>
  );
}
