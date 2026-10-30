import { CONFIG } from "@/config";

/* ------------------------------------------------------------------ */
/*  TICKER                                                             */
/* ------------------------------------------------------------------ */
export const TICKER_ITEMS = [
  `WHITELIST ONLY`,
  `TOTAL SUPPLY ${CONFIG.supply.total.toLocaleString("en-US")}`,
  `MAX ${CONFIG.supply.maxPerWallet} PER AGENTIC WALLET`,
  `${CONFIG.supply.wallets.toLocaleString("en-US")} WALLETS ELIGIBLE`,
  `${CONFIG.network.name.toUpperCase()}`,
  CONFIG.contract.standard.toUpperCase(),
  `${CONFIG.arc.epochs} EPOCHS × ${CONFIG.arc.hoursPerEpoch}H = ${CONFIG.arc.totalHours}H`,
  `MINT ${CONFIG.price.amount} ${CONFIG.price.symbol}`,
  `${CONFIG.domain.toUpperCase()}`,
];

/* ------------------------------------------------------------------ */
/*  NAV / SECTIONS                                                     */
/* ------------------------------------------------------------------ */
export const SECTIONS = [
  { id: "top", label: "00 / Index" },
  { id: "idea", label: "01 / The Idea" },
  { id: "tiers", label: "02 / The Rack" },
  { id: "arc", label: "03 / The Arc" },
  { id: "agent", label: "04 / Agent Math" },
  { id: "whitelist", label: "05 / Whitelist" },
  { id: "mint", label: "06 / Mint" },
  { id: "roadmap", label: "07 / Roadmap" },
  { id: "faq", label: "08 / FAQ" },
];

/* ------------------------------------------------------------------ */
/*  TIERS — "the rack" of five cells                                   */
/* ------------------------------------------------------------------ */
export type Tier = {
  numeral: string;
  name: string;
  count: number;
  volts: string;
  hue: "volt" | "cobalt" | "oxide" | "live" | "paper";
  blurb: string;
  trait: string;
};

export const TIERS: Tier[] = [
  {
    numeral: "I",
    name: "Spark",
    count: 2500,
    volts: "0.55 kV",
    hue: "paper",
    blurb:
      "The common cell. A single static discharge, held for eleven hours. Most agents never see past this one — and that is the point.",
    trait: "Copper shell · unpolished",
  },
  {
    numeral: "II",
    name: "Arc",
    count: 1500,
    volts: "1.10 kV",
    hue: "live",
    blurb:
      "The current jumps the gap. Arc cells carry a visible filament that keeps moving long after the epoch counter stops.",
    trait: "Live filament · animated",
  },
  {
    numeral: "III",
    name: "Surge",
    count: 900,
    volts: "2.75 kV",
    hue: "cobalt",
    blurb:
      "A grid event. Surge cells were struck while the chain was busy, so their metadata stores the block gas price of the moment they were minted.",
    trait: "Block-stamped gas sigil",
  },
  {
    numeral: "IV",
    name: "Storm",
    count: 500,
    volts: "5.50 kV",
    hue: "oxide",
    blurb:
      "Rare enough to be weather. Storm cells flicker on a five-second rhythm and are the only tier allowed to hold two epochs at once.",
    trait: "Flicker loop · dual epoch",
  },
  {
    numeral: "V",
    name: "Prime",
    count: 155,
    volts: "11.11 kV",
    hue: "volt",
    blurb:
      "The full rack. Prime only exists when one wallet holds all four cells below it — the circuit closes and the fifth slot strikes itself.",
    trait: "Circuit-closed · 1 of 155",
  },
];

export const TIER_TOTAL = TIERS.reduce((n, t) => n + t.count, 0);

/* ------------------------------------------------------------------ */
/*  ARC — five epochs                                                  */
/* ------------------------------------------------------------------ */
export const EPOCHS = [
  {
    n: 1,
    name: "Strike",
    hours: "0 – 11",
    state: "Charged",
    color: "var(--color-volt)",
    text: "The cell is minted and takes its first charge. Metadata is written once, at the block height of the strike.",
  },
  {
    n: 2,
    name: "Carry",
    hours: "11 – 22",
    state: "Live",
    color: "var(--color-live)",
    text: "Current holds steady. Nothing to run, nothing to stake, no gas to pay. The chain counts for you.",
  },
  {
    n: 3,
    name: "Surge",
    hours: "22 – 33",
    state: "Peaking",
    color: "var(--color-cobalt)",
    text: "Peak output. Cells that share a wallet begin to resonate — a full rack reads as one circuit on-chain.",
  },
  {
    n: 4,
    name: "Drain",
    hours: "33 – 44",
    state: "Fading",
    color: "var(--color-oxide)",
    text: "The cell goes dim. Artwork desaturates epoch by epoch, read live from the contract every time you look.",
  },
  {
    n: 5,
    name: "Ground",
    hours: "44 – 55",
    state: "Grounded",
    color: "var(--color-ash)",
    text: "Hour 55. The cell grounds, turns monochrome for good, and releases its stored charge to your wallet.",
  },
];

/* ------------------------------------------------------------------ */
/*  STEPS                                                              */
/* ------------------------------------------------------------------ */
export const STEPS = [
  {
    numeral: "I",
    title: "Get whitelisted",
    body: "Bind a Binance Agentic Wallet that holds a verified Agent ID, submit it to the gate, and wait for the snapshot. One Agent ID earns one slot — never two.",
    meta: "Snapshot 01 Nov · 23:59 UTC",
  },
  {
    numeral: "II",
    title: "Mint up to five",
    body: "Your agent calls mint() and pays 0.0055 BNB per cell. The contract hard-caps every wallet at five; anything above reverts, no exceptions, no owner override.",
    meta: "Max 5 · 0.0055 BNB each",
  },
  {
    numeral: "III",
    title: "Let it ground",
    body: "Five epochs of eleven hours start the second your cell is struck. At hour 55 the cell goes monochrome forever and its stored charge is yours.",
    meta: "55 hours · automatic",
  },
];

/* ------------------------------------------------------------------ */
/*  ROADMAP                                                            */
/* ------------------------------------------------------------------ */
export const ROADMAP = [
  {
    at: "0%",
    title: "Gate opens",
    body: "Whitelist submissions open. Agent ID verification runs against the Binance agentic registry.",
    status: "done" as const,
  },
  {
    at: "555",
    title: "The registry",
    body: "Public registry of every whitelisted Agent ID, verifiable on-chain. Sybil list published alongside it.",
    status: "done" as const,
  },
  {
    at: "1,389 · 25%",
    title: "Cells struck",
    body: "Art engine frozen, contract deployed and verified on BscScan. Ownership renounced at 25%.",
    status: "live" as const,
  },
  {
    at: "2,778 · 50%",
    title: "The rack",
    body: "Rack view ships: any wallet holding five cells gets a composite circuit artwork generated from its own token IDs.",
    status: "next" as const,
  },
  {
    at: "4,166 · 75%",
    title: "Agent hooks",
    body: "Read-only API + MCP tool so an agent can query, display and trade its own cells without a human in the loop.",
    status: "next" as const,
  },
  {
    at: "5,555 · 100%",
    title: "Grounded",
    body: "Sold out. The last cell strikes, the mint function is disabled permanently, and the relic ledger goes public.",
    status: "next" as const,
  },
];

/* ------------------------------------------------------------------ */
/*  FAQ                                                                */
/* ------------------------------------------------------------------ */
export const FAQ = [
  {
    q: "What exactly is a Binance Agentic Wallet?",
    a: "A wallet that an autonomous agent controls through a registered Binance Agent ID. The Agent ID is what the whitelist checks — not your exchange account, not your trading history. If your agent can sign on its own behalf, it qualifies for the gate.",
  },
  {
    q: "Why is the cap five cells per wallet?",
    a: "Because 5,555 divided by five is exactly 1,111 wallets. The cap is the shape of the collection: a rack of five cells, one rack per agent. It is enforced inside the contract, so no owner function, team allocation or back door can lift it.",
  },
  {
    q: "What happens if I try to mint a sixth cell?",
    a: "The transaction reverts with MAX_PER_WALLET. You pay no mint price and only the failed gas. The counter is read from balanceOf, so cells you send away after grounding do not reopen your slot — the cap counts lifetime mints, not current holdings.",
  },
  {
    q: "Is the whitelist transferable?",
    a: "No. A slot is bound to the Agent ID that claimed it. Submitting someone else's address, or running one Agent ID across several wallets, gets every related address removed at snapshot.",
  },
  {
    q: "What does grounding actually do to the NFT?",
    a: "At hour 55 the cell's artwork desaturates to monochrome and freezes — that state is permanent and lives in the token URI. You keep the cell forever as a relic, and the stored charge (5,555 $ZAP) is released to the wallet that held it at the strike.",
  },
  {
    q: "Do I have to run anything, or pay gas after the mint?",
    a: "Nothing. There is no staking, no claiming loop, no node. The chain counts the epochs from your mint block height, so the arc runs identically whether your agent is awake or dead.",
  },
  {
    q: "Which chain, which standard, what fee?",
    a: "BNB Smart Chain (chain ID 56), BEP-721. Mint price is 0.0055 BNB per cell plus roughly a cent of gas. 55% of the mint goes to the charge pool, 25% to the studio, 20% stays in the treasury for the agent hooks.",
  },
  {
    q: "Is the contract verified and renounced?",
    a: "It will be published and verified on BscScan before the gate opens, with the mint cap and supply hard-coded as immutables. Ownership is renounced at 25% of supply minted — that milestone is on the roadmap and is not optional.",
  },
];

/* ------------------------------------------------------------------ */
/*  DEMO WHITELIST                                                     */
/* ------------------------------------------------------------------ */
/**
 * Daftar demo supaya gate bisa diuji langsung di GitHub Pages.
 * Ganti dengan Merkle root / sourceUrl di config untuk produksi.
 */
export const DEMO_WHITELIST: {
  address: string;
  agentId: string;
  slots: number;
  tier: string;
  block: number;
}[] = [
  { address: "0x5a510d3e0f2c8b7a4e6d1c9f0a2b3c4d5e6f7081", agentId: "AGT-0001", slots: 5, tier: "Full rack", block: 48215505 },
  { address: "0x7d4f2b9c1e8a6053d9f4c2b7a1e8064932d5c1f0", agentId: "AGT-0142", slots: 5, tier: "Full rack", block: 48215505 },
  { address: "0x3a9e51c7b2d84f60e1a9c53b7d24f8e60c1b9d43", agentId: "AGT-0555", slots: 3, tier: "Partial", block: 48215505 },
  { address: "0xb0c4de97a25f18e63c9b0a72d54f8e19c6b3a270", agentId: "AGT-1111", slots: 5, tier: "Full rack", block: 48215505 },
  { address: "0x91f6a2c40d8b53e71a9c6f24b0d8e5371a4c9f62", agentId: "AGT-0055", slots: 1, tier: "Single cell", block: 48215505 },
];
