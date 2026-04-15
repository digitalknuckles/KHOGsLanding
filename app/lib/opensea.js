export async function fetchNFT(address) {
  const res = await fetch(`/api/opensea?address=${address}`);
  const data = await res.json();
  return data.nfts?.[0];
}
