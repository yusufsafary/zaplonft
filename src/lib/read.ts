import { CONFIG } from "@/config";

/** Selector baca-saja kontrak ZAPLO (sama seperti zaplo-skill.md). */
export const SEL = {
  mintOpen: "0x24bbd049",
  currentPrice: "0x9d1b464a",
  totalMinted: "0xa2309ff8",
  holdsAgentId: "0x11213086",
  paidMintedBy: "0x80f231fb",
} as const;

const RPCS = [CONFIG.network.rpcUrl, "https://bsc-rpc.publicnode.com", "https://bsc-dataseed.binance.org"];

/** eth_call read-only lewat RPC publik; null kalau semua RPC gagal. */
export async function readContract(to: string, data: string): Promise<bigint | null> {
  for (const url of RPCS) {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "eth_call", params: [{ to, data }, "latest"] }),
      });
      const j = (await res.json()) as { result?: string };
      if (j.result && j.result !== "0x") return BigInt(j.result);
    } catch {
      /* coba RPC berikutnya */
    }
  }
  return null;
}
