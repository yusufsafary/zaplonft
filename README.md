# ⚡ ZAPLO — five charges per agent

Landing page untuk koleksi NFT **ZAPLO** (`zaplo.nl`): 5.555 sel muatan di BNB Smart Chain,
whitelist-only, **maksimal 5 NFT per Binance Agentic Wallet**.

Dibangun dengan React 19 + Vite 7 + Tailwind CSS 4, dan di-bundle jadi **satu file
`dist/index.html`** (via `vite-plugin-singlefile`) — jadi hosting di GitHub Pages tidak
perlu konfigurasi path apa pun.

---

## 1. Menjalankan lokal

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # hasil di ./dist (satu file index.html + CNAME)
npm run preview  # cek hasil build
```

## 2. Push ke GitHub kamu

Repo ini belum terhubung ke remote mana pun. Dari folder proyek:

```bash
git init -b main
git add .
git commit -m "ZAPLO — landing page, gate whitelist, mint console"
git remote add origin https://github.com/<USER>/<REPO>.git
git push -u origin main
```

> Aku tidak punya kredensial ke akun GitHub-mu, jadi push-nya harus kamu jalankan sendiri.
> Semua file yang dibutuhkan (workflow, `CNAME`, `.nojekyll`) sudah ada di repo ini.

## 3. Deploy ke GitHub Pages

1. Buka repo → **Settings → Pages**.
2. **Source** = `GitHub Actions` (bukan "Deploy from a branch").
3. Push ke `main` → workflow `.github/workflows/deploy.yml` otomatis build & publish.
4. Di **Settings → Pages → Custom domain**, isi `zaplo.nl`, centang **Enforce HTTPS**
   (tunggu sertifikat terbit, biasanya beberapa menit).

File `public/CNAME` sudah berisi `zaplo.nl`, jadi domain ikut ter-deploy bersama artefak.

### DNS untuk `zaplo.nl`

| Type  | Name | Value                                            |
| ----- | ---- | ------------------------------------------------ |
| A     | @    | 185.199.108.153                                  |
| A     | @    | 185.199.109.153                                  |
| A     | @    | 185.199.110.153                                  |
| A     | @    | 185.199.111.153                                  |
| AAAA  | @    | 2606:50c0:8000::153 (dan ::154, ::155, ::156)    |
| CNAME | www  | `<USER>.github.io`                               |

## 4. Mengubah angka, tanggal, harga, dan copy

Semua ada di **`src/config.ts`** — tidak perlu menyentuh komponen.

```ts
supply.total          // 5555
supply.maxPerWallet   // 5  -> whitelist slots otomatis = 5555/5 = 1111
price.amount          // "0.0055" BNB (string, presisi)
arc.epochs / hoursPerEpoch / totalHours   // 5 × 11 = 55 jam
schedule.mintStart    // ISO UTC, countdown & status mengikuti
contract.address      // "" = MODE SIMULASI, "0x…" = MODE LIVE
whitelist.sourceUrl   // opsional: URL publik daftar alamat (CSV/TXT/JSON)
links.*               // X, Discord, GitHub, Mirror, BscScan
```

Konten naratif (tier, epoch, langkah, roadmap, FAQ, daftar whitelist demo) ada di
**`src/data/content.ts`**.

## 5. Dari simulasi ke transaksi asli

Selama `contract.address` kosong, seluruh halaman berjalan dalam **MODE SIMULASI**:
mint console tetap berfungsi (log, hash keccak, receipt) tetapi tidak mengirim transaksi.

Begitu kamu isi alamat kontrak:

- `window.ethereum` dipakai langsung (EIP-1193) — **tanpa ethers/wagmi**, bundle tetap ringan.
- Panel otomatis memanggil `eth_requestAccounts`, `wallet_switchEthereumChain` (chainId 56),
  `balanceOf(address)` untuk menghitung sisa slot, lalu `mint(uint256)` dengan
  `value = harga × jumlah`.
- `totalSupply()` dibaca tiap 20 detik untuk angka "minted" di hero, spec sheet, dan roadmap.

Selector fungsi sudah dihitung dengan keccak-256 (`src/lib/hash.ts`) dan disimpan di
`CONFIG.contract.selectors`. Kalau kontrakmu memakai nama fungsi lain, jalankan:

```bash
node -e "const{keccak256}=require('js-sha3');console.log('0x'+keccak256('namaFungsi(uint256)').slice(0,8))"
```

### Syarat minimum kontrak (agar cocok dengan halaman ini)

```solidity
uint256 public constant MAX_SUPPLY    = 5555;
uint256 public constant MAX_PER_WALLET = 5;
uint256 public constant PRICE = 0.0055 ether;

function mint(uint256 qty) external payable {
    require(totalSupply() + qty <= MAX_SUPPLY, "SOLD_OUT");
    require(_lifetimeMinted[msg.sender] + qty <= MAX_PER_WALLET, "MAX_PER_WALLET");
    require(msg.value >= PRICE * qty, "BAD_VALUE");
    // ...
}
```

Cap dihitung dari **lifetime mint**, bukan `balanceOf` saat ini, supaya mengirim sel ke
wallet lain tidak membuka slot keenam.

## 6. Struktur

```
index.html                     meta, OG, favicon, Google Fonts
public/CNAME                   zaplo.nl
public/og.jpg                  kartu share 1200×600
.github/workflows/deploy.yml   build + publish ke GitHub Pages
src/config.ts                  ← SEMUA parameter proyek
src/data/content.ts            tier, epoch, langkah, roadmap, FAQ, whitelist demo
src/lib/chain.ts               EIP-1193: connect, switch chain, eth_call, mint
src/lib/hash.ts                keccak-256 (js-sha3): selector, receipt, tx simulasi
src/lib/format.ts              wei ↔ BNB, alamat, angka, jam UTC
src/hooks/index.ts             countdown, count-up, in-view, active section, progress
src/components/*               Nav, Rail, Hero, SpecSheet, Idea, Tiers, Arc,
                               Agent, WhitelistGate, MintPanel, Roadmap, Faq, Footer
```

## 7. Sebelum produksi — checklist

- [ ] Ganti `links.*` dan `repo` di `src/config.ts` dengan akun asli.
- [ ] Ganti `DEMO_WHITELIST` di `src/data/content.ts` dengan snapshot asli
      (atau isi `whitelist.sourceUrl` / pakai Merkle root di kontrak).
- [ ] Deploy + verify kontrak di BscScan, lalu isi `contract.address`.
- [ ] Sambungkan form pengajuan whitelist ke backend (Tally, Formspree, Supabase,
      atau Cloudflare Worker) — sekarang datanya hanya tersimpan di `localStorage`.
- [ ] Uji `mint()` di BSC testnet (chainId 97) sebelum mainnet.
