// /api/opensea.js
// simple in-memory cache (persists across invocations on warm server)
let cache = {};

export default async function handler(req, res) {
  try {
    const { address } = req.query;

    if (!address) {
      return res.status(400).json({ error: "Missing address" });
    }

    // Your Polygon contract
    const CONTRACT = "0x2b5323b91887b3ea02f7fe3785808c7f68545a87".toLowerCase();

    const response = await fetch(
      `https://api.opensea.io/api/v2/chain/polygon/account/${address}/nfts`,
      {
        headers: {
          "X-API-KEY": process.env.DK_KHOGS_OPENSEA_API
        }
      }
    );

    const data = await response.json();

    // return cached if exists
    if (cache[address]) {
      return res.status(200).json(cache[address]);
    }

    console.log("OS RAW:", data);

    const nfts = (data.nfts || [])
      .filter(n => {
        // Handle multiple contract field shapes
        const addr =
          n.contract ||
          n.contract_address ||
          n.collection?.contract_address;

        return addr?.toLowerCase() === CONTRACT;
      })
      .map(n => {
        const metadata = n.metadata || {};

        return {
          image:
            n.display_image_url ||
            n.image_url ||
            n.image ||
            metadata.image,

          name: n.name || metadata.name || "Unnamed NFT",

          attributes:
            n.traits ||
            metadata.attributes ||
            []
        };
      })
      .filter(n => n.image);

    console.log("FILTERED NFTs:", nfts.length);

    const result = { nfts };

    // store in cache
    cache[address] = result;

    return res.status(200).json(result);

  } catch (err) {
    console.error("API ERROR:", err);
    return res.status(500).json({
      error: "Internal Server Error",
      details: err.message
    });
  }
}
