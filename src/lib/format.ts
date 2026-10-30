export function shortAddress(a: string, head = 6, tail = 4): string {
  if (!a) return "—";
  if (a.length <= head + tail + 2) return a;
  return `${a.slice(0, head)}…${a.slice(-tail)}`;
}

export function num(n: number, digits = 0): string {
  return n.toLocaleString("en-US", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

export function pct(part: number, whole: number, digits = 1): string {
  if (!whole) return "0%";
  return `${((part / whole) * 100).toFixed(digits)}%`;
}

export function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

export function isAddress(v: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(v.trim());
}

export function padAddress(a: string): string {
  return a.toLowerCase().replace(/^0x/, "").padStart(64, "0");
}

export function toHex32(n: number | bigint): string {
  return BigInt(n).toString(16).padStart(64, "0");
}

/** BNB (string desimal) -> wei, tanpa float error. */
export function ethToWei(amount: string): bigint {
  const clean = amount.trim().replace(/,/g, "");
  const [intPart = "0", fracRaw = ""] = clean.split(".");
  const frac = (fracRaw + "0".repeat(18)).slice(0, 18);
  return BigInt(intPart || "0") * 10n ** 18n + BigInt(frac || "0");
}

export function weiToEth(wei: string | bigint): string {
  const v = BigInt(wei).toString().padStart(19, "0");
  const int = v.slice(0, v.length - 18).replace(/^0+(?=\d)/, "");
  const frac = v.slice(v.length - 18).replace(/0+$/, "");
  return frac ? `${int || "0"}.${frac}` : int || "0";
}

export function utcStamp(iso: string): string {
  const d = new Date(iso);
  return d
    .toISOString()
    .replace("T", " ")
    .replace(/:\d\d\.\d\d\dZ$/, " UTC");
}

export function clockStamp(d = new Date()): string {
  return d.toISOString().slice(11, 19);
}
