import { CONFIG } from "@/config";
import type { Countdown } from "@/hooks";

export type MintStatus = "upcoming" | "live" | "ended";

export function getMintStatus(): MintStatus {
  if (CONFIG.schedule.forceStatus) return CONFIG.schedule.forceStatus;
  const start = new Date(CONFIG.schedule.mintStart).getTime();
  if (Number.isNaN(start)) return "upcoming";
  if (Date.now() < start) return "upcoming";
  // setelah mulai, mint dianggap live selama 55 jam (satu arc penuh)
  return Date.now() < start + CONFIG.arc.totalHours * 3_600_000 ? "live" : "ended";
}

export function statusLabel(s: MintStatus): string {
  // Kontrak belum di-deploy: setelah jam buka pun statusnya "MINT OPENING",
  // bukan live — mint berjalan lewat agen begitu kontrak terpasang.
  const deployed = CONFIG.contract.address.length > 0;
  return s === "upcoming"
    ? "MINT OPENS · 11:30 UTC"
    : s === "live"
      ? deployed
        ? "MINT OPEN"
        : "MINT OPENING"
      : "MINT CLOSED";
}

export function statusTone(s: MintStatus): string {
  return s === "upcoming" ? "var(--color-volt)" : s === "live" ? "var(--color-live)" : "var(--color-ash)";
}

export function formatCountdown(c: Countdown): string {
  if (c.past) return "T-00:00:00";
  const p = (n: number) => String(n).padStart(2, "0");
  return `${p(c.days)}d ${p(c.hours)}:${p(c.minutes)}:${p(c.seconds)}`;
}
