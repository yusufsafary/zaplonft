import { CONFIG } from "@/config";
import { padAddress, toHex32 } from "@/lib/format";

/** Selector baca-saja kontrak ZAPLO (sama seperti zaplo-skill.md). */
export const SEL = {
  mintOpen: "0x24bbd049",
  currentPrice: "0x9d1b464a",
  totalMinted: "0xa2309ff8",
  holdsAgentId: "0x11213086",
  paidMintedBy: "0x80f231fb",
  balanceOf: "0x70a08231",
  remaining: "0xb399b0bc",
  ownerOf: "0x6352211e",
} as const;

/** Selector baca-saja kontrak ZaploClaim (sama seperti zaplo-claim-skill.md). */
export const SEL_CLAIM = {
  claimOpen: "0x4b8bcb58",
  claimFee: "0x99d32fc4",
  totalClaimed: "0xd54ad2a1",
  claimsRemaining: "0x754c463f",
  claimedById: "0x4c80ee12",
} as const;

/**
 * RPC publik BSC. Semua endpoint DIPACU bersamaan (Promise.any) dengan
 * timeout per endpoint — pola yang sama seperti nomio.uk. Pola lama yang
 * berurutan bisa menggantung 20 detik per endpoint dan membuat ledger
 * tampil 0 di koneksi lambat.
 */
const RPCS = [
  CONFIG.network.rpcUrl,
  "https://bsc-dataseed1.binance.org",
  "https://bsc-dataseed-public.bnbchain.org",
  "https://bsc-rpc.publicnode.com",
  "https://bsc-mainnet.public.blastapi.io",
];

async function ethCall(url: string, to: string, data: string): Promise<string> {
  const ctrl = new AbortController();
  const t = window.setTimeout(() => ctrl.abort(), 6000);
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "eth_call",
        params: [{ to, data }, "latest"],
      }),
      signal: ctrl.signal,
    });
    const j = (await res.json()) as { result?: string };
    if (j.result && j.result !== "0x") return j.result;
    throw new Error("empty result");
  } finally {
    window.clearTimeout(t);
  }
}

async function callRaw(to: string, data: string): Promise<string | null> {
  try {
    return await Promise.any(RPCS.map((u) => ethCall(u, to, data)));
  } catch {
    return null;
  }
}

/** eth_call read-only lewat RPC publik; null kalau semua RPC gagal. */
export async function readContract(to: string, data: string): Promise<bigint | null> {
  const r = await callRaw(to, data);
  if (r === null) return null;
  try {
    return BigInt(r);
  } catch {
    return null;
  }
}

/** Baca nilai address (mis. ownerOf) — null kalau gagal. */
export async function readAddress(to: string, data: string): Promise<string | null> {
  const r = await callRaw(to, data);
  if (r === null || r.length < 42) return null;
  return "0x" + r.slice(-40);
}

export function addrArg(a: string): string {
  return padAddress(a);
}

export function uintArg(n: number | bigint): string {
  return toHex32(n);
}
