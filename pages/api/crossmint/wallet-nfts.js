// pages/api/crossmint/wallet-nfts.js
export default async function handler(req, res) {
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
      return res.status(400).json({ error: "Missing required 'identifier' (e.g. solana:YourWallet)" });
    }

    const upstream = new URL(
      \`https://www.crossmint.com/api/2022-06-09/wallets/\${encodeURIComponent(identifier)}/nfts\`
    );
    upstream.searchParams.set("page", page);
    upstream.searchParams.set("perPage", perPage);

    const r = await fetch(upstream, {
      headers: {
        accept: "application/json",
        "X-API-KEY": API_KEY,
      },
      cache: "no-store",
    });

    const text = await r.text();
    res.status(r.status).setHeader("content-type", "application/json").send(text);
  } catch (err) {
    res.status(500).json({ error: "Proxy crashed", detail: String(err) });
  }
}
