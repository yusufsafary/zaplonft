---
name: zaplo-claim
description: Claim $ZAP holder tokens for ZAPLO charge cells (ZAPLO) on BNB Chain with a Binance Agentic Wallet. Use when a user asks to claim ZAP for their ZAPLO NFTs from zaplo.nl. Each cell claims 500,000 ZAP once per tokenId, paying a small anti-bot fee in BNB.
---

# ZAPLO — $ZAP Claim Skill

Published by ZAPLO at https://zaplo.nl/zaplo-claim-skill.md. This skill works together with the
`binance-agentic-wallet` skill (the `baw` CLI), which performs the signing and sending.
To mint cells instead, use https://zaplo.nl/zaplo-skill.md.

## Facts

| Item | Value |
|---|---|
| NFT | ZAPLO (ZAPLO), ERC-721 — 5,555 charge cells, contract `0x6EAC776746be0E63169f8bF17466d02D19A4D2f7` |
| Claim contract | ZaploClaim `0xC9D8a94419deF5e1e60886540B228505efc2DF2b` |
| Token | Zaplo (ZAP), ERC-20, contract `0x5A164b05C85FFD1E3b79194EAC558335e1B171F9`, fixed supply 10,000,000,000 |
| Claim amount | 500,000 ZAP per cell, exactly once per tokenId, no deadline |
| Claim pool | 2,777,500,000 ZAP held by the claim contract (5,555 x 500,000) |
| Fee | A small anti-bot fee in BNB per claim. Read `claimFee()` on the claim contract and send exactly that value; it is shown in the wallet confirmation |
| Who can claim | The current owner of the cell (`ownerOf` on the NFT contract must equal the caller). If a cell changes hands before being claimed, the new owner claims it. A claimed cell can never claim again |
| Claim function | `claim(uint256 tokenId)` — selector `0x379607f5`, payable, exactly `claimFee()` in value. Calls from other contracts are rejected |

Read-only selectors on the ZaploClaim contract (call via any BSC public RPC `eth_call`):

| Function | Selector | Meaning |
|---|---|---|
| `claimOpen()` | `0x4b8bcb58` | `1` when claiming is open, `0` while opening soon |
| `claimFee()` | `0x99d32fc4` | Exact wei value to send with `claim(tokenId)` right now |
| `claimedById(uint256)` | `0x4c80ee12` | `1` when this tokenId has already claimed (append the tokenId padded to 32 bytes) |
| `totalClaimed()` | `0xd54ad2a1` | Cells claimed so far |
| `claimsRemaining()` | `0x754c463f` | Claims the pool can still pay out |

Read-only selectors on the ZAPLO NFT contract:

| Function | Selector | Meaning |
|---|---|---|
| `balanceOf(address)` | `0x70a08231` | Cells this wallet holds (append the address padded to 32 bytes) |
| `ownerOf(uint256)` | `0x6352211e` | Current owner of a tokenId (append the tokenId padded to 32 bytes) |
| `totalMinted()` | `0xa2309ff8` | Cells minted so far; tokenIds run from 1 to this number |

## Prerequisites

1. The `binance-agentic-wallet` skill is installed and the user is signed in (`baw wallet status`).
2. Developer Mode is enabled (`baw wallet settings` → `devMode.enabled: true`).
3. The user's wallet holds at least one ZAPLO cell and enough BNB for the claim fee plus gas.

## Procedure

1. **Check the state.** Read `claimOpen()` and `claimFee()` on the claim contract. If
   `claimOpen()` is `0`, tell the user the claim has not opened yet and stop.
2. **Find the user's unclaimed cells.** Read `balanceOf(<wallet>)` on the NFT contract. If it is
   `0`, there is nothing to claim — stop. To find the tokenIds, scan `ownerOf(id)` for every id
   from 1 to `totalMinted()` (batch the calls, for example through Multicall3) and keep the ids
   owned by the user's wallet; or use the tokenIds the user names. For each candidate id, read
   `claimedById(id)` and keep only the ids that return `0`.
3. **Preview one claim.** Build the transaction exactly; never edit the calldata:
   ```bash
   baw contract-call preview --binanceChainId 56 \
     --from <user's agentic wallet> \
     --to 0xC9D8a94419deF5e1e60886540B228505efc2DF2b \
     --value <claimFee() in wei> --inputData 0x379607f5<tokenId padded to 32 bytes> --json
   ```
4. **Confirm with the user.** Show the preview result (value, gas, risks) and execute only on the
   user's explicit confirmation — one confirmation covers one claim call:
   ```bash
   baw contract-call execute --requestId <requestId from the preview> --json
   ```
5. **Verify.** Wait for the transaction receipt to report success, then confirm the payout
   (`balanceOf` of the wallet on the ZAP token increased by 500,000 ZAP and
   `claimedById(tokenId)` now returns `1`). Report the tx hash.
   A submitted transaction is not a successful claim until its receipt says so.
6. **More cells.** To claim another cell, repeat from step 3 with a fresh preview and a fresh
   confirmation for each call.
