export async function fetchNFTs(address) {
  if (!address) return [];

  try {
    const res = await fetch(`/api/opensea?address=${address}`);

    if (!res.ok) {
      throw new Error('Failed to fetch NFTs');
    }

    const data = await res.json();

    return data.nfts || [];
  } catch (err) {
    console.error('fetchNFTs error:', err);
    return [];
  }
}
