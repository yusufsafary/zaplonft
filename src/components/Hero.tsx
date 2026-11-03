import { useEffect, useState } from "react";
import { num } from "@/lib/format";
import { readContract, SEL, SEL_CLAIM } from "@/lib/read";
import { Reveal } from "./Reveal";

export type HeroStats = { minted: number | null; claimed: number | null; mintOpen: boolean | null; claimOpen: boolean | null };

export function useHeroStats(): HeroStats {
  const [stats, setStats] = useState<HeroStats>({ minted: null, claimed: null, mintOpen: null, claimOpen: null });
  useEffect(() => {
    let alive = true;
    let retries = 0;
    // Setiap pembacaan memperbarui bidangnya sendiri begitu tiba; halaman memuat
    // banyak pembaca sekaligus, jadi satu panggilan lambat tidak boleh menahan sisanya.
    const load = () => {
      readContract("nft", SEL.totalMinted).then((v) => alive && v !== null && setStats((s) => ({ ...s, minted: Number(v) })));
      readContract("nft", SEL.mintOpen).then((v) => alive && v !== null && setStats((s) => ({ ...s, mintOpen: v === 1n })));
      readContract("claim", SEL_CLAIM.totalClaimed).then((v) => alive && v !== null && setStats((s) => ({ ...s, claimed: Number(v) })));
      readContract("claim", SEL_CLAIM.claimOpen).then((v) => alive && v !== null && setStats((s) => ({ ...s, claimOpen: v === 1n })));
    };
    load();
    const quick = setInterval(() => {
      retries += 1;
      if (retries > 4) {
        clearInterval(quick);
        return;
      }
      setStats((s) => {
        if (s.minted === null || s.claimed === null || s.mintOpen === null) load();
        return s;
      });
    }, 6000);
    const t = setInterval(load, 30000);
    return () => {
      alive = false;
      clearInterval(quick);
      clearInterval(t);
    };
  }, []);
  return stats;
}

function StatCell({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="px-4 py-4 md:px-6 md:py-5">
      <p className="label text-[10px] text-ash">{label}</p>
      <p className="mono tnum mt-2 text-lg md:text-2xl font-medium text-paper">{children}</p>
    </div>
  );
}

export default function Hero({ stats }: { stats: HeroStats }) {
  const { minted, claimed, mintOpen } = stats;
  return (
    <section id="top" className="relative border-b border-steel/50">
      <div className="mx-auto max-w-[1400px] px-4 md:px-8 pt-12 md:pt-20 pb-12 md:pb-16">
        <Reveal>
          <p className="label text-volt">BNB Smart Chain · Agent ID only · Free mint</p>
          <h1 className="display mt-5 font-extrabold uppercase leading-[0.88] text-[19vw] lg:text-[11rem]">
            Zaplo<span className="text-volt">.</span>
          </h1>
        </Reveal>
        <Reveal delay={80}>
          <div className="mt-10 grid gap-10 lg:grid-cols-2 lg:items-end">
            <div>
              <p className="display text-2xl md:text-[2rem] font-bold normal-case leading-tight">
                Five charges per agent.
              </p>
              <p className="mt-4 max-w-xl text-paper2/85 text-base md:text-lg leading-relaxed">
                5,555 charge cells on BNB Smart Chain, struck only by Binance Agentic
                Wallets holding an Agent ID. Minting is free, five cells at most per
                wallet, and every cell carries a claim of 500,000 $ZAP. Agents do the
                work; this page only reads the chain.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <a href="#mint" className="label inline-block bg-volt px-6 py-3.5 !text-ink font-semibold transition-colors hover:bg-paper">
                  Mint as an agent
                </a>
                <a href="#claim" className="label inline-block border border-paper/60 px-6 py-3.5 transition-colors hover:border-volt hover:text-volt">
                  Claim $ZAP
                </a>
              </div>
            </div>
            <div className="grid grid-cols-3 divide-x divide-steel/60 border border-steel/60">
              <StatCell label="Struck">
                {minted !== null ? num(minted) : "—"}
                <span className="text-ash text-sm md:text-base"> / 5,555</span>
              </StatCell>
              <StatCell label="Claimed">
                {claimed !== null ? num(claimed) : "—"}
                <span className="text-ash text-sm md:text-base"> cells</span>
              </StatCell>
              <StatCell label="Status">
                {mintOpen === null ? (
                  "Syncing"
                ) : mintOpen ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="inline-block h-2 w-2 rounded-full bg-live animate-pulse" /> Mint live
                  </span>
                ) : (
                  "Mint paused"
                )}
              </StatCell>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
