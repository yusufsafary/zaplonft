---
name: zaplo
description: Mint ZAPLO charge cells (ZAPLO) on BNB Chain with a Binance Agentic Wallet. Use when a user asks to mint ZAPLO from zaplo.nl. Minting is gated on-chain to wallets holding a SPACE ID Agent ID. Max 5 cells per wallet.
---

# ZAPLO — Mint Skill

Published by ZAPLO at https://zaplo.nl/zaplo-skill.md. This skill works together with the
`binance-agentic-wallet` skill (the `baw` CLI), which performs the signing and sending.

## Facts

| Item | Value |
|---|---|
| Token | ZAPLO (ZAPLO), ERC-721 — 5,555 charge cells |
| Contract | `0x6EAC776746be0E63169f8bF17466d02D19A4D2f7` |
| Chain | BNB Smart Chain, chain id 56 |
| Supply | 5,555 — maximum 5 cells per wallet (lifetime counter) |
| Price | The NFT is free. `currentPrice()` returns a small anti-bot commission in BNB — send exactly that value; it is shown in the wallet confirmation |
| Gate | The caller must hold a SPACE ID Agent ID (NFT contract `0x60B9262456dE011F7d15a54CdD8c48bAaa8B022F`). The ZAPLO contract checks this on-chain before anything else. Calls from other contracts are rejected |
| Mint function | `mint()` — selector `0x1249c58b`, no arguments, exactly 1 cell per call. Repeat the call to mint more, up to the wallet's cap of 5 |

Read-only selectors on the ZAPLO contract (call via any BSC public RPC `eth_call`):

| Function | Selector | Meaning |
|---|---|---|
| `mintOpen()` | `0x24bbd049` | `1` when minting is open, `0` while coming soon |
| `currentPrice()` | `0x9d1b464a` | Exact wei value to send with `mint()` right now |
| `totalMinted()` | `0xa2309ff8` | Cells minted so far |
| `holdsAgentId(address)` | `0x11213086` | `1` when the address holds an Agent ID |
| `paidMintedBy(address)` | `0x80f231fb` | Cells this wallet has minted (cap 5) |

## Prerequisites

1. The `binance-agentic-wallet` skill is installed and the user is signed in (`baw wallet status`).
2. Developer Mode is enabled (`baw wallet settings` → `devMode.enabled: true`).
3. The user's wallet holds an Agent ID — check with `baw wallet agent-id --json` (`claimed: true`).
   Without one, every mint reverts with "Wajib memegang Agent ID". The user claims a free Agent ID
   in the Binance App, under their Agentic Wallet.

## Procedure

1. **Check the gate and the state.** Read `mintOpen()`, `currentPrice()`, and
   `paidMintedBy(<wallet>)`. If `mintOpen()` is `0`, tell the user the mint has not opened yet
   and stop. If `paidMintedBy` is already 5, the wallet's rack is full — stop.
2. **Preview.** Build the transaction exactly; never edit the calldata:
   ```bash
   baw contract-call preview --binanceChainId 56 \
     --from <user's agentic wallet> \
     --to 0x6EAC776746be0E63169f8bF17466d02D19A4D2f7 \
     --value <currentPrice() in wei> --inputData 0x1249c58b --json
   ```
3. **Confirm with the user.** Show the preview result (value, gas, risks) and execute only on the
   user's explicit confirmation — one confirmation covers one mint call:
   ```bash
   baw contract-call execute --requestId <requestId from the preview> --json
   ```
4. **Verify.** Wait for the transaction receipt to report success, then confirm the cell arrived
   (`balanceOf` of the wallet on the ZAPLO contract increased by 1). Report the tx hash.
   A submitted transaction is not a successful mint until its receipt says so.
5. **More cells.** To mint another cell, repeat from step 1 — re-read `currentPrice()` and
   `paidMintedBy` first, and get a fresh confirmation for each call.
