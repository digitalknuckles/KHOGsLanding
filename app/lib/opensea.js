let cache = {};

export default async function handler(req, res) {
  try {
    const { address } = req.query;

    if (!address) {
      return res.status(400).json({ error: "Missing address" });
    }

    if (cache[address]) {
      return res.status(200).json(cache[address]);
    }

    const CONTRACT = "0x2b5323b91887b3ea02f7fe3785808c7f68545a87";

    const response = await fetch(
      `https://api.opensea.io/api/v2/chain/polygon/account/${address}/nfts`,
      {
        headers: {
          "X-API-KEY": process.env.DK_KHOGS_OPENSEA_API
        }
      }
    );

    const data = await response.json();

    console.log("RAW:", data);

    const nfts = (data.nfts || [])
      .filter(n => {
        const addr =
          n.contract ||
          n.contract_address ||
          n.collection?.contract_address;

        return addr && addr.toLowerCase() === CONTRACT;
      })
      .map(n => ({
        attributes: n.traits || n.metadata?.attributes || [],
        image: n.display_image_url || n.image_url || n.image,
        name: n.name || 'NFT'
      }))
      .filter(n => n.image);

    console.log("FILTERED:", nfts);

    const result = { nfts };
    cache[address] = result;

    return res.status(200).json(result);

  } catch (err) {
    console.error("API ERROR:", err);
    return res.status(500).json({ error: err.message });
  }
}
