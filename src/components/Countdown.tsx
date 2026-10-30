import { useCountdown } from "@/hooks";

/** Target tetap: 2026-10-30T11:30:00Z (18:30 WIB). String ISO berakhiran Z
 *  supaya hitung mundur benar di semua zona waktu pengunjung. */
export const MINT_OPEN_ISO = "2026-10-30T11:30:00Z";

const p = (n: number) => String(n).padStart(2, "0");

export default function Countdown() {
  const cd = useCountdown(MINT_OPEN_ISO);
  return (
    <section aria-label="Mint countdown" className="relative border-y border-volt/50 bg-ink2/70">
      <div className="mx-auto max-w-[1400px] px-4 md:px-8 xl:pl-[108px] py-8 md:py-12 text-center">
        {cd.past ? (
          <>
            <p className="display font-extrabold uppercase leading-[0.95] tracking-tight text-3xl md:text-5xl">
              MINT OPENING — VIA YOUR BINANCE AGENT
            </p>
            <p className="label text-[11px] text-ash mt-4">
              Free mint · max 5 per wallet · exclusively through Binance Agentic Wallet
            </p>
          </>
        ) : (
          <>
            <p className="label text-volt text-sm md:text-base">MINT OPENS · 11:30 UTC</p>
            <p className="display tnum font-extrabold leading-none mt-4 text-[19vw] sm:text-8xl md:text-9xl">
              {p(cd.days * 24 + cd.hours)}<span className="text-volt">:</span>{p(cd.minutes)}<span className="text-volt">:</span>{p(cd.seconds)}
            </p>
            <p className="label text-[11px] text-ash mt-4">
              Countdown to 11:30 UTC · free mint · max 5 per wallet · via your Binance Agentic Wallet
            </p>
          </>
        )}
      </div>
    </section>
  );
}
