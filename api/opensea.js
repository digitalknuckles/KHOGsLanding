// /api/opensea.js
export default async function handler(req, res) {
  const { address } = req.query;

  const response = await fetch(`https://api.opensea.io/api/v2/chain/polygon/account/${address}/nfts`, {
    headers: {
      "X-API-KEY": process.env.DK_KHOGS_OPENSEA_API
    }
  });

  const data = await response.json();

  const filtered = data.nfts.filter(nft =>
    nft.contract.toLowerCase() === "0x2b5323b91887b3ea02f7fe3785808c7f68545a87"
  );

  res.status(200).json(filtered);
}

