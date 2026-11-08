// Market Zaplo: grid listing dari kontrak ZaploMarket, beli/delist dengan
// wallet browser, jual dua langkah (approve lalu list). Fee 2,5% dari sisi
// penjual, dibayar instan saat terjual. Bacaan rantai via RPC race.
(function () {
  const MARKET = "0x4F6542b61D77C9140fD8189Bf2fAB87cA2a386Aa";
  const NFT = "0x6EAC776746be0E63169f8bF17466d02D19A4D2f7";
  const RPCS = [
    "https://bsc-dataseed.binance.org",
    "https://bsc-mainnet.public.blastapi.io",
    "https://bsc-rpc.publicnode.com",
    "https://bsc-dataseed1.binance.org",
  ];
  const SEL = {
    listedIds: "0x023bea53",
    listingOf: "0xe3404981",
    getApproved: "0x081812fc",
  };
  const WRITE_SEL = { list: "0x50fd7367", buy: "0xd96a094a", delist: "0x964bc33f", approve: "0x095ea7b3" };
  const $ = (id) => document.getElementById(id);
  const fmt = (n) => n.toLocaleString("en-US");
  const bnb = (wei) => (Number(wei) / 1e18).toFixed(5).replace(/0+$/, "").replace(/\.$/, ".0") + " BNB";
  const padNum = (v) => BigInt(v).toString(16).padStart(64, "0");
  const padAddr = (a) => a.toLowerCase().replace(/^0x/, "").padStart(64, "0");
  let account = null;
  let provider = null;
  let busy = false;

  let statusTimer = null;
  function say(msg, kind) {
    const bar = $("m-status");
    if (bar) {
      bar.textContent = msg;
      bar.className = "show " + (kind || "info");
      clearTimeout(statusTimer);
      if (kind !== "work") statusTimer = setTimeout(() => bar.classList.remove("show"), 7000);
    }
    const s = $("sell-status");
    if (s) s.textContent = msg;
  }
  function fail(prefix, e) {
    const m = (e && (e.shortMessage || e.message)) || String(e);
    if (e && (e.code === 4001 || /user rejected|user denied|rejected the request/i.test(m))) {
      say(prefix + " cancelled in your wallet. Nothing was sent.", "err");
    } else if (/No browser wallet/i.test(m)) {
      say("No wallet found. Open this page inside a wallet browser (Binance or Trust Wallet), then tap again.", "err");
    } else {
      say(prefix + " failed: " + m.slice(0, 140), "err");
    }
  }

  async function callOnce(rpc, to, data) {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 6000);
    try {
      const res = await fetch(rpc, {
        method: "POST",
        signal: ctrl.signal,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "eth_call", params: [{ to, data }, "latest"] }),
      });
      const j = await res.json();
      if (j.error) throw new Error(j.error.message || "rpc error");
      return j.result;
    } finally {
      clearTimeout(t);
    }
  }
  async function call(to, data) {
    const settled = await Promise.allSettled(RPCS.map((r) => callOnce(r, to, data)));
    for (const s of settled) if (s.status === "fulfilled" && s.value && s.value !== "0x") return s.value;
    const first = settled.find((s) => s.status === "fulfilled");
    if (first) return first.value;
    throw new Error("All RPC endpoints failed");
  }

  function cellFace(id) {
    return `<svg viewBox="0 0 120 120" aria-hidden="true">
      <polygon points="60,6 106,33 106,87 60,114 14,87 14,33" fill="#f2d024"/>
      <polygon points="60,14 99,37 99,83 60,106 21,83 21,37" fill="none" stroke="#0b0e0f" stroke-opacity="0.25" stroke-width="2"/>
      <path d="M66 30 44 66h13l-5 24 24-38H62z" fill="#0b0e0f"/>
    </svg>`;
  }

  async function loadListings() {
    const grid = $("grid");
    try {
      const raw = await call(MARKET, SEL.listedIds);
      const words = raw && raw !== "0x" ? raw.slice(2).match(/.{64}/g).map((w) => BigInt("0x" + w)) : [];
      const count = words.length > 1 ? Number(words[1]) : 0;
      $("m-count").textContent = fmt(count);
      let floor = null;
      const cards = [];
      for (let i = 0; i < count; i++) {
        const id = words[2 + i];
        const l = await call(MARKET, SEL.listingOf + padNum(id));
        if (!l || l === "0x") continue;
        const w = l.slice(2).match(/.{64}/g).map((x) => BigInt("0x" + x));
        const seller = "0x" + l.slice(2, 66).slice(-40);
        const price = w[1];
        if (floor === null || price < floor) floor = price;
        cards.push({ id, seller, price });
      }
      cards.sort((a, b) => (a.price < b.price ? -1 : a.price > b.price ? 1 : 0));
      $("m-floor").textContent = floor !== null ? bnb(floor) : "-";
      if (!cards.length) {
        grid.innerHTML = '<div class="empty"><p class="display" style="font-size:24px; color:var(--paper)">No cells listed yet.</p><p style="margin-top:8px">Be the first seller. Every cell still carries a claim of 500,000 $ZAP for its holder.</p></div>';
        return;
      }
      grid.innerHTML = cards.map((c) => {
        const mine = account && c.seller.toLowerCase() === account.toLowerCase();
        return `<div class="card">
          <div class="cellface">${cellFace(c.id)}</div>
          <div class="cid display">Cell Nº ${c.id}</div>
          <div class="meta label" style="letter-spacing:.14em">Seller ${c.seller.slice(0, 6)}...${c.seller.slice(-4)} · Claim 500,000 $ZAP inside</div>
          <div class="price tnum">${bnb(c.price)}</div>
          ${mine
            ? `<button class="btn btn-ghost" data-delist="${c.id}">Delist</button>`
            : `<button class="btn btn-volt" data-buy="${c.id}" data-price="${c.price}">Buy · ${bnb(c.price)}</button>`}
        </div>`;
      }).join("");
      grid.querySelectorAll("[data-buy]").forEach((b) => b.addEventListener("click", () => buy(b, BigInt(b.dataset.buy), BigInt(b.dataset.price))));
      grid.querySelectorAll("[data-delist]").forEach((b) => b.addEventListener("click", () => delist(b, BigInt(b.dataset.delist))));
    } catch (e) {
      grid.innerHTML = '<div class="empty"><p class="display" style="font-size:24px; color:var(--paper)">Chain read failed.</p><p style="margin-top:8px">Try again in a moment.</p></div>';
    }
  }

  async function ensureWallet() {
    if (!window.ethereum) throw new Error("No browser wallet found. Open this page in a wallet browser.");
    if (!provider) provider = new ethers.BrowserProvider(window.ethereum);
    const net = await provider.getNetwork();
    if (Number(net.chainId) !== 56) {
      say("Switching your wallet to BNB Chain...", "work");
      await window.ethereum.request({ method: "wallet_switchEthereumChain", params: [{ chainId: "0x38" }] });
      provider = new ethers.BrowserProvider(window.ethereum);
    }
    if (!account) {
      const accs = await window.ethereum.request({ method: "eth_requestAccounts" });
      account = accs[0];
      $("connect-btn").textContent = account.slice(0, 6) + "..." + account.slice(-4);
      loadListings();
    }
    return provider.getSigner();
  }

  async function send(to, data, value, btn, label) {
    const signer = await ensureWallet();
    if (btn) { btn.disabled = true; btn.textContent = "Confirm in wallet..."; }
    say("Confirm the transaction in your wallet.", "work");
    const tx = await signer.sendTransaction({ to, data, value: value || 0n });
    if (btn) btn.textContent = "Confirming...";
    say("Sent: " + tx.hash.slice(0, 16) + "... waiting for confirmation.", "work");
    await tx.wait();
    say((label || "Done") + " confirmed: " + tx.hash.slice(0, 16) + "...", "ok");
    if (btn) btn.disabled = false;
  }

  async function buy(btn, id, price) {
    if (busy) return; busy = true;
    try { await send(MARKET, WRITE_SEL.buy + padNum(id), price, btn, "Purchase"); await loadListings(); }
    catch (e) { if (btn) { btn.disabled = false; btn.textContent = "Buy · " + bnb(price); } fail("Buy", e); }
    busy = false;
  }
  async function delist(btn, id) {
    if (busy) return; busy = true;
    try { await send(MARKET, WRITE_SEL.delist + padNum(id), 0n, btn, "Delist"); await loadListings(); }
    catch (e) { if (btn) { btn.disabled = false; btn.textContent = "Delist"; } fail("Delist", e); }
    busy = false;
  }

  async function sell() {
    const idRaw = $("sell-id").value;
    const priceEth = $("sell-price").value.trim();
    if (!idRaw || !priceEth) { say("Enter a cell number and a price in BNB first.", "err"); return; }
    const id = BigInt(idRaw);
    let price;
    try { price = ethers.parseEther(priceEth); } catch (e) { say("Price format not valid. Use BNB, e.g. 0.01", "err"); return; }
    if (price <= 0n) { say("Price must be above zero.", "err"); return; }
    const btn = $("sell-btn");
    try {
      const approved = await call(NFT, SEL.getApproved + padNum(id));
      const approvedAddr = approved && approved !== "0x" ? "0x" + approved.slice(-40) : "";
      if (approvedAddr.toLowerCase() !== MARKET.toLowerCase()) {
        say("Step 1 of 2: approve the market to hold Cell Nº " + id + ".", "work");
        await send(NFT, WRITE_SEL.approve + padAddr(MARKET) + padNum(id), 0n, btn, "Approve");
      }
      say("Step 2 of 2: listing Cell Nº " + id + " for " + priceEth + " BNB.", "work");
      await send(MARKET, WRITE_SEL.list + padNum(id) + padNum(price), 0n, btn, "Listing");
      btn.textContent = "List for sale";
      await loadListings();
    } catch (e) { btn.disabled = false; btn.textContent = "List for sale"; fail("Sell", e); }
  }

  $("connect-btn").addEventListener("click", async () => {
    try { await ensureWallet(); say("Wallet connected: " + account.slice(0, 6) + "..." + account.slice(-4), "ok"); }
    catch (e) { fail("Connect", e); }
  });
  $("sell-btn").addEventListener("click", sell);
  if (window.ethereum && window.ethereum.on) {
    window.ethereum.on("accountsChanged", () => location.reload());
    window.ethereum.on("chainChanged", () => location.reload());
  }
  loadListings();
  setInterval(loadListings, 90000);
})();
