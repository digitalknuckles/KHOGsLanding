
export default function NFTCard({ nft }) {
  return (
    <div className="card show">
      <img src={nft.image} />

      <h3>{nft.name}</h3>

      <div>
        {nft.attributes?.map((a, i) => (
          <div key={i}>
            {a.trait_type}: {a.value}
          </div>
        ))}
      </div>
    </div>
  );
}
