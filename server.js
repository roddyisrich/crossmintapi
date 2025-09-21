const path = require("path");
const fs = require("fs");
const express = require("express");
const cors = require("cors");

// Load env from .env.local if present, otherwise .env
require("dotenv").config({
  path: fs.existsSync(".env.local") ? ".env.local" : ".env",
});

const app = express();

// Add CORS to fix origin header issues
app.use(cors());

// Serve static files (so you can open your HTML directly)
app.use(express.static(path.join(__dirname)));

// Proxy: /api/crossmint/wallet-nfts?identifier=solana:WALLET&perPage=50
app.get("/api/crossmint/wallet-nfts", async (req, res) => {
  try {
    const API_KEY =
      process.env.CROSSMINT_CLIENT_SECRET || process.env.CROSSMINT_API_KEY;

    if (!API_KEY) {
      return res
        .status(500)
        .json({ error: "Server missing CROSSMINT_CLIENT_SECRET or CROSSMINT_API_KEY" });
    }

    const { identifier, page = "1", perPage = "50" } = req.query;
    if (!identifier) {
      return res.status(400).json({ error: "Missing 'identifier' (e.g. solana:YourWallet)" });
    }

    const upstream = new URL(
      `https://www.crossmint.com/api/2022-06-09/wallets/${encodeURIComponent(
        identifier
      )}/nfts`
    );
    upstream.searchParams.set("page", String(page));
    upstream.searchParams.set("perPage", String(perPage));

    // Use global fetch (Node 18+), otherwise dynamic import of node-fetch
    const doFetch =
      globalThis.fetch || (await import("node-fetch")).default;

    const r = await doFetch(upstream, {
      headers: {
        accept: "application/json",
        "X-API-KEY": API_KEY, // Crossmint expects this header
      },
      cache: "no-store",
    });

    const text = await r.text();
    res.status(r.status).setHeader("content-type", "application/json").send(text);
  } catch (err) {
    res.status(500).json({ error: "Proxy crashed", detail: String(err) });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`Server running → http://localhost:${PORT}`)
);