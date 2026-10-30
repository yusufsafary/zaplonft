import { CONFIG } from "@/config";

/* ------------------------------------------------------------------ */
/*  TICKER                                                             */
/* ------------------------------------------------------------------ */
export const TICKER_ITEMS = [
  `AGENT ID ONLY`,
  `FREE MINT`,
  `TOTAL SUPPLY ${CONFIG.supply.total.toLocaleString("en-US")}`,
  `MAX ${CONFIG.supply.maxPerWallet} PER AGENTIC WALLET`,
  `${CONFIG.supply.wallets.toLocaleString("en-US")} WALLETS ELIGIBLE`,
  `${CONFIG.network.name.toUpperCase()}`,
  CONFIG.contract.standard.toUpperCase(),
  `${CONFIG.arc.epochs} EPOCHS × ${CONFIG.arc.hoursPerEpoch}H = ${CONFIG.arc.totalHours}H`,
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
  { id: "gate", label: "05 / The Gate" },
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
    title: "Hold an Agent ID",
    body: "Minting is gated on-chain: your Binance Agentic Wallet must hold a verified SPACE ID Agent ID. No whitelist, no application form — the contract reads the Agent ID registry directly.",
    meta: "Checked on-chain · every mint",
  },
  {
    numeral: "II",
    title: "Mint up to five",
    body: "Your agent calls mint() — the cell itself is free; the wallet only confirms a small anti-bot commission of a few cents. The contract hard-caps every wallet at five; anything above reverts, no exceptions, no owner override.",
    meta: "Max 5 · free mint",
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
    body: "The Agent ID gate goes live. Only Binance Agentic Wallets holding a verified SPACE ID Agent ID can strike a cell.",
    status: "done" as const,
  },
  {
    at: "555",
    title: "The registry",
    body: "Public registry of every rack struck, verifiable on-chain — one wallet, one rack of five, no exceptions.",
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
    a: "A wallet that an autonomous agent controls through a registered Binance Agent ID. The Agent ID is what the gate checks — not your exchange account, not your trading history. If your agent can sign on its own behalf, it qualifies for the gate.",
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
    q: "Who can mint — and how?",
    a: "Any Binance Agentic Wallet that holds a verified SPACE ID Agent ID. There is no whitelist and no browser mint: your agent reads the mint skill at zaplo.nl/zaplo-skill.md and calls mint() for you. This website is read-only — it never connects to your wallet.",
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
    a: "BNB Smart Chain (chain ID 56), BEP-721. The mint is free — the only charge is a small anti-bot commission of a few cents per cell, shown in your Agentic Wallet before you confirm, plus roughly a cent of gas.",
  },
  {
    q: "Is the contract verified and renounced?",
    a: "It will be published and verified on BscScan before the gate opens, with the mint cap and supply hard-coded as immutables. Ownership is renounced at 25% of supply minted — that milestone is on the roadmap and is not optional.",
  },
];
