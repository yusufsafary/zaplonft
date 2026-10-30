/**
 * ============================================================================
 *  ZAPLO — SITE CONFIG
 * ============================================================================
 *  Satu-satunya file yang perlu kamu ubah untuk mengganti angka, tanggal,
 *  harga, alamat kontrak, dan tautan sosial.
 *
 *  PENTING — MODE SIMULASI vs MODE LIVE:
 *    contract.address = ""  ->  situs berjalan dalam MODE SIMULASI.
 *                               Tombol mint tetap berfungsi penuh sebagai demo
 *                               (log terminal, receipt, hash), tanpa transaksi.
 *    contract.address = "0x…" -> situs otomatis LIVE: connect wallet, baca
 *                               balanceOf/totalSupply dari chain, dan kirim
 *                               transaksi mint yang sesungguhnya.
 * ============================================================================
 */

export const CONFIG = {
  brand: "ZAPLO",
  domain: "zaplo.nl",
  repo: "https://github.com/OWNER/zaplo", // <- ganti dengan repo kamu
  tagline: "Five charges per agent.",
  lede: "5,555 charge cells on BNB Smart Chain. Whitelist only. A maximum of five cells per Binance Agentic Wallet — because one agent needs a full rack, not a single bolt.",

  /* ---------------- ekonomi koleksi ---------------- */
  supply: {
    total: 5555,
    maxPerWallet: 5,
    get wallets() {
      return Math.floor(this.total / this.maxPerWallet);
    },
  },
  price: {
    amount: "0.0055", // BNB, string agar presisi (tanpa float error)
    symbol: "BNB",
  },

  /* ---------------- mekanisme "arc" ---------------- */
  arc: {
    epochs: 5,
    hoursPerEpoch: 11,
    get totalHours() {
      return this.epochs * this.hoursPerEpoch;
    },
    reward: "5,555 $ZAP",
  },

  /* ---------------- jadwal ---------------- */
  schedule: {
    /** ISO 8601 / UTC. Otomatis jadi "MINT LIVE" kalau sudah lewat. */
    mintStart: "2026-11-05T15:05:00.000Z",
    whitelistOpen: "2026-10-05T00:00:00.000Z",
    whitelistClose: "2026-11-01T23:59:00.000Z",
    snapshotLabel: "Snapshot 01 Nov 2026 · 23:59 UTC",
    /** Paksa status kalau kamu tidak mau mengandalkan jam: upcoming|live|ended */
    forceStatus: null as null | "upcoming" | "live" | "ended",
  },

  /* ---------------- chain ---------------- */
  network: {
    name: "BNB Smart Chain",
    shortName: "BSC",
    chainId: 56,
    chainIdHex: "0x38",
    rpcUrl: "https://bsc-dataseed.binance.org/",
    explorer: "https://bscscan.com",
    currency: { name: "BNB", symbol: "BNB", decimals: 18 },
  },

  contract: {
    /** Kosongkan sampai kontrak di-deploy -> situs jalan di MODE SIMULASI */
    address: "",
    standard: "BEP-721 (ERC-721)",
    audited: false,
    /**
     * Function selector (4 byte pertama keccak-256 dari signature).
     * Sudah dihitung benar; sesuaikan kalau kontrak kamu memakai nama lain.
     */
    selectors: {
      mint: "0xa0712d68", // mint(uint256)
      balanceOf: "0x70a08231", // balanceOf(address)
      totalSupply: "0x18160ddd", // totalSupply()
      isWhitelisted: "0x3af32abf", // isWhitelisted(address)
      remaining: "0xb399b0bc", // remaining(address)
      maxPerWallet: "0x453c2310", // maxPerWallet()
      price: "0xa035b1fe", // price()
    },
  },

  /* ---------------- whitelist ---------------- */
  whitelist: {
    /**
     * Opsional: URL publik berisi daftar alamat (CSV/JSON/TXT, satu alamat per
     * baris). Kosongkan untuk memakai daftar demo lokal di src/data/content.ts.
     * Catatan GitHub Pages: file harus di-serve dengan header CORS
     * (mis. raw.githubusercontent.com sudah mengizinkan).
     */
    sourceUrl: "",
    requirement: "A wallet must hold a verified Binance Agent ID",
    note: "A slot is bound to its Agent ID and cannot be transferred. One Agent ID = one slot, five cells maximum.",
  },

  links: {
    x: "https://x.com/zaplo",
    discord: "https://discord.gg/zaplo",
    github: "https://github.com/OWNER/zaplo",
    mirror: "https://mirror.xyz/zaplo.eth",
    opensea: "https://opensea.io/collection/zaplo",
    bscscan: "",
  },
} as const;

export type SiteConfig = typeof CONFIG;
