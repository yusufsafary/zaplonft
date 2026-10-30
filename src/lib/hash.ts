import { keccak256 } from "js-sha3";

/** keccak-256 hex (tanpa 0x) dari string apa pun. */
export function keccak(input: string): string {
  return keccak256(input);
}

/** Hash referensi yang deterministik untuk pengajuan whitelist. */
export function applicationHash(payload: string): string {
  return "0x" + keccak256(`ZAPLO/GATE/1\n${payload}`);
}

/** Hash palsu bergaya tx untuk mode simulasi (tetap deterministik-ish). */
export function simulatedTx(seed: string): string {
  const a = keccak256(`tx-a|${seed}|${Date.now()}|${Math.random()}`);
  const b = keccak256(`tx-b|${a}`);
  return `0x${a}${b.slice(0, 32)}`;
}

/** 4-byte selector dari signature fungsi Solidity. */
export function selector(signature: string): string {
  return "0x" + keccak256(signature).slice(0, 8);
}
