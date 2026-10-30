import { CONFIG } from "@/config";
import { ethToWei, padAddress, toHex32 } from "@/lib/format";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */
type RequestArgs = { method: string; params?: unknown[] | Record<string, unknown> };

export type EIP1193 = {
  request: (args: RequestArgs) => Promise<any>;
  on?: (event: string, handler: (...args: any[]) => void) => void;
  removeListener?: (event: string, handler: (...args: any[]) => void) => void;
  isMetaMask?: boolean;
  isBinanceWallet?: boolean;
  isCoinbaseWallet?: boolean;
  isBraveWallet?: boolean;
  isTrust?: boolean;
  providers?: EIP1193[];
};

declare global {
  interface Window {
    ethereum?: EIP1193;
    BinanceChain?: EIP1193;
  }
}

export type WalletKind = {
  id: string;
  name: string;
  hint: string;
  get: () => EIP1193 | null;
};

export const WALLETS: WalletKind[] = [
  {
    id: "binance",
    name: "Binance Wallet",
    hint: "Native untuk Agentic Wallet / Agent ID",
    get: () => window.BinanceChain ?? pickProvider((p) => !!p.isBinanceWallet),
  },
  {
    id: "metamask",
    name: "MetaMask",
    hint: "Injected · EIP-1193",
    get: () => pickProvider((p) => !!p.isMetaMask),
  },
  {
    id: "injected",
    name: "Browser Wallet",
    hint: "Apa pun yang menyuntikkan window.ethereum",
    get: () => window.ethereum ?? null,
  },
];

/** Mode LIVE hanya kalau alamat kontrak sudah diisi di src/config.ts */
export const isLive: boolean = CONFIG.contract.address.length > 0;

let active: EIP1193 | null = null;
export function getActiveProvider(): EIP1193 | null {
  return active;
}
export function setActiveProvider(p: EIP1193 | null): void {
  active = p;
}

function pickProvider(pred: (p: EIP1193) => boolean): EIP1193 | null {
  const eth = window.ethereum;
  if (!eth) return null;
  if (Array.isArray(eth.providers) && eth.providers.length) {
    return eth.providers.find(pred) ?? eth.providers[0] ?? null;
  }
  return pred(eth) ? eth : null;
}

export function detectWallets(): WalletKind[] {
  return WALLETS.filter((w) => w.get() !== null);
}

/* ------------------------------------------------------------------ */
/*  Connect / chain                                                    */
/* ------------------------------------------------------------------ */
export async function connectWallet(kind: WalletKind): Promise<string> {
  const provider = kind.get();
  if (!provider) throw new Error(`${kind.name} was not detected in this browser.`);
  setActiveProvider(provider);
  const accounts = (await provider.request({
    method: "eth_requestAccounts",
  })) as string[];
  if (!accounts?.length) throw new Error("No account was authorised.");
  return accounts[0];
}

export async function currentChainId(): Promise<number | null> {
  const p = active ?? window.ethereum ?? null;
  if (!p) return null;
  try {
    const id = (await p.request({ method: "eth_chainId" })) as string;
    return parseInt(id, 16);
  } catch {
    return null;
  }
}

export async function ensureChain(): Promise<"ok" | "switched" | "failed"> {
  const p = active ?? window.ethereum;
  if (!p) return "failed";
  const id = await currentChainId();
  if (id === CONFIG.network.chainId) return "ok";
  const hex = CONFIG.network.chainIdHex;
  try {
    await p.request({ method: "wallet_switchEthereumChain", params: [{ chainId: hex }] });
    return "switched";
  } catch (err: any) {
    if (err?.code === 4902 || /Unrecognized chain ID/i.test(String(err?.message))) {
      try {
        await p.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: hex,
              chainName: CONFIG.network.name,
              nativeCurrency: CONFIG.network.currency,
              rpcUrls: [CONFIG.network.rpcUrl],
              blockExplorerUrls: [CONFIG.network.explorer],
            },
          ],
        });
        return "switched";
      } catch {
        return "failed";
      }
    }
    return "failed";
  }
}

/* ------------------------------------------------------------------ */
/*  Raw RPC (dipakai untuk membaca chain tanpa wallet ter-connect)     */
/* ------------------------------------------------------------------ */
const RPCS = [
  CONFIG.network.rpcUrl,
  "https://bsc-rpc.publicnode.com",
  "https://bsc-dataseed.binance.org",
];

export async function rpc<T = any>(method: string, params: unknown[]): Promise<T> {
  const body = JSON.stringify({ jsonrpc: "2.0", id: 1, method, params });
  let lastErr: unknown;
  for (const url of RPCS) {
    try {
      const ctl = new AbortController();
      const t = setTimeout(() => ctl.abort(), 7000);
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
        signal: ctl.signal,
      });
      clearTimeout(t);
      const json = (await res.json()) as { result?: T; error?: { message?: string } };
      if (json.error) throw new Error(json.error.message ?? "RPC error");
      return json.result as T;
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr instanceof Error ? lastErr : new Error("RPC unreachable");
}

const CONTRACT = () => CONFIG.contract.address;

async function ethCall(data: string): Promise<string> {
  if (active) {
    return (await active.request({
      method: "eth_call",
      params: [{ to: CONTRACT(), data }, "latest"],
    })) as string;
  }
  return rpc<string>("eth_call", [{ to: CONTRACT(), data }, "latest"]);
}

export async function readTotalSupply(): Promise<number | null> {
  if (!isLive) return null;
  try {
    const out = await ethCall(CONFIG.contract.selectors.totalSupply);
    if (!out || out === "0x") return null;
    const n = parseInt(out, 16);
    return Number.isFinite(n) ? n : null;
  } catch {
    return null;
  }
}

export async function readBalanceOf(owner: string): Promise<number | null> {
  if (!isLive || !owner) return null;
  try {
    const out = await ethCall(
      CONFIG.contract.selectors.balanceOf + padAddress(owner),
    );
    return parseInt(out, 16);
  } catch {
    return null;
  }
}

export async function readRemaining(owner: string): Promise<number | null> {
  if (!isLive || !owner) return null;
  try {
    const out = await ethCall(CONFIG.contract.selectors.remaining + padAddress(owner));
    return parseInt(out, 16);
  } catch {
    const bal = await readBalanceOf(owner);
    return bal === null ? null : Math.max(0, CONFIG.supply.maxPerWallet - bal);
  }
}

/* ------------------------------------------------------------------ */
/*  Mint                                                               */
/* ------------------------------------------------------------------ */
export function encodeMint(qty: number): string {
  return CONFIG.contract.selectors.mint + toHex32(qty);
}

export function mintValue(qty: number): string {
  const one = ethToWei(CONFIG.price.amount);
  return "0x" + (one * BigInt(qty)).toString(16);
}

export async function sendMint(qty: number, from: string): Promise<string> {
  if (!isLive) throw new Error("Contract not deployed — the site is in SIMULATION mode.");
  const p = active ?? window.ethereum;
  if (!p) throw new Error("Wallet is not connected.");
  const hash = (await p.request({
    method: "eth_sendTransaction",
    params: [
      {
        from,
        to: CONTRACT(),
        data: encodeMint(qty),
        value: mintValue(qty),
      },
    ],
  })) as string;
  return hash;
}
