import { useEffect, useRef, useState } from "react";
import { CONFIG } from "@/config";
import { readContract, SEL, SEL_CLAIM } from "@/lib/read";
import { num } from "@/lib/format";

/**
 * ChargeField — kanvas grid sel baterai di belakang wordmark.
 * Setiap sel terisi volt mengikuti gelombang; sesekali satu sel "menyambar".
 * Diam saat di luar layar, statis bila prefers-reduced-motion.
 */
function ChargeField() {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let running = true;
    let W = 0;
    let H = 0;
    const DPR = Math.min(1.5, window.devicePixelRatio || 1);

    const resize = () => {
      const r = cv.getBoundingClientRect();
      W = r.width;
      H = r.height;
      cv.width = Math.max(1, Math.floor(W * DPR));
      cv.height = Math.max(1, Math.floor(H * DPR));
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = (t: number) => {
      ctx.clearRect(0, 0, W, H);
      const cell = 54;
      const gap = 10;
      const cols = Math.ceil(W / (cell + gap)) + 1;
      const rows = Math.ceil(H / (cell * 1.42 + gap)) + 1;
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const px = x * (cell + gap);
          const py = y * (cell * 1.42 + gap);
          const ph = Math.sin(t / 1600 + x * 0.55 + y * 0.9) * 0.5 + 0.5;
          const ph2 = Math.sin(t / 2600 - x * 0.3 + y * 0.5) * 0.5 + 0.5;
          const charge = Math.max(0, Math.min(1, ph * 0.65 + ph2 * 0.45 - 0.12));
          const h = cell * 1.42;
          ctx.strokeStyle = "rgba(140,148,145,0.20)";
          ctx.lineWidth = 1;
          ctx.strokeRect(px + 0.5, py + 0.5, cell - 1, h - 1);
          if (charge > 0.03) {
            const fh = (h - 8) * charge;
            ctx.fillStyle = `rgba(242,208,36,${0.05 + charge * 0.16})`;
            ctx.fillRect(px + 4, py + h - 4 - fh, cell - 8, fh);
          }
          const strike = Math.sin(t / 700 + x * 12.9898 + y * 78.233) > 0.9985;
          if (strike) {
            ctx.fillStyle = "rgba(242,208,36,0.85)";
            ctx.fillRect(px + cell / 2 - 1, py + 6, 2, h - 12);
          }
        }
      }
    };

    if (reduced) {
      draw(1200);
    } else {
      const loop = (t: number) => {
        if (running) draw(t);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
      const io = new IntersectionObserver(
        (es) => es.forEach((e) => (running = e.isIntersecting)),
        { threshold: 0 },
      );
      io.observe(cv);
      return () => {
        cancelAnimationFrame(raf);
        io.disconnect();
        window.removeEventListener("resize", resize);
      };
    }
    return () => window.removeEventListener("resize", resize);
  }, []);

  return <canvas ref={ref} className="absolute inset-0 h-full w-full" aria-hidden="true" />;
}

export type HeroStats = {
  minted: number | null;
  open: boolean | null;
  claimed: number | null;
};

export function useHeroStats(): HeroStats {
  const [stats, setStats] = useState<HeroStats>({ minted: null, open: null, claimed: null });
  useEffect(() => {
    let stop = false;
    const tick = async () => {
      const [m, o, c] = await Promise.all([
        readContract(CONFIG.contract.address, SEL.totalMinted),
        readContract(CONFIG.contract.address, SEL.mintOpen),
        readContract(CONFIG.claim.address, SEL_CLAIM.totalClaimed),
      ]);
      if (stop) return;
      setStats({
        minted: m !== null ? Number(m) : null,
        open: o !== null ? o > 0n : null,
        claimed: c !== null ? Number(c) : null,
      });
    };
    tick();
    const id = window.setInterval(tick, 30000);
    return () => {
      stop = true;
      window.clearInterval(id);
    };
  }, []);
  return stats;
}

export default function Hero({ stats }: { stats: HeroStats }) {
  const { minted, open, claimed } = stats;
  return (
    <section id="top" className="relative overflow-hidden">
      <ChargeField />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(11,14,15,0.55)_78%,rgba(11,14,15,0.92)_100%)]" />
      <div className="relative mx-auto max-w-[1400px] px-4 md:px-8 pt-10 md:pt-16 pb-10 md:pb-12">
        <p className="label text-volt mb-5">
          {CONFIG.network.name} · {CONFIG.contract.standard} · Agent ID only · Free mint
        </p>
        <h1 className="display font-extrabold uppercase leading-[0.84] tracking-tight text-[21vw] lg:text-[12.5rem]">
          Zaplo<span className="text-volt">.</span>
        </h1>
        <div className="mt-8 grid gap-8 lg:grid-cols-[1.2fr_1fr] items-end">
          <div>
            <p className="serif-it text-2xl md:text-3xl text-paper">{CONFIG.tagline}</p>
            <p className="mt-4 text-base md:text-lg text-paper2/85 max-w-xl">
              5,555 charge cells on BNB Smart Chain, struck only by Binance Agentic
              Wallets holding an Agent ID. Minting is free, five cells at most per
              wallet, and every cell carries a claim of 500,000 $ZAP. Agents do the
              work; this page only reads the chain.
            </p>
            <div className="mt-7 flex flex-wrap gap-3 pointer-events-auto">
              <a href="#mint" className="btn btn-solid"><span>Mint as an agent</span></a>
              <a href="#claim" className="btn btn-ghost"><span>Claim $ZAP</span></a>
            </div>
          </div>
          <div className="flex flex-wrap gap-2.5 lg:justify-end">
            <span className="border border-steel/70 bg-ink/80 px-3.5 py-2 mono text-[12px] tnum">
              STRUCK <b className="text-volt font-semibold">{minted !== null ? num(minted) : "—"}</b>
              <span className="text-ash"> / {num(CONFIG.supply.total)}</span>
            </span>
            <span className="border border-steel/70 bg-ink/80 px-3.5 py-2 mono text-[12px] tnum">
              CLAIMED <b className="text-volt font-semibold">{claimed !== null ? num(claimed) : "—"}</b>
              <span className="text-ash"> CELLS</span>
            </span>
            <span className="border border-steel/70 bg-ink/80 px-3.5 py-2 mono text-[12px] inline-flex items-center gap-2">
              <span
                className="pulse-dot relative inline-block size-2 rounded-full"
                style={{ background: open === null ? "var(--color-ash)" : open ? "var(--color-live)" : "var(--color-volt)", color: open ? "var(--color-live)" : "var(--color-ash)" }}
              />
              {open === null ? "SYNCING" : open ? "MINT LIVE" : "MINT PAUSED"}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
