'use client';
import { useState } from 'react';

export default function NFTCard({ nft }) {
  const [open, setOpen] = useState(false);

  if (!nft) {
    return <div className="card show">No NFT Found</div>;
  }

  return (
    <div className="card show">
      <img src={nft.image} className="nft-img" />

      <h3>{nft.name}</h3>

      <button className="dropdown" onClick={() => setOpen(!open)}>
        {open ? 'Hide Traits ▲' : 'Show Traits ▼'}
      </button>

      {open && (
        <div className="traits">
          {nft.attributes?.map((a, i) => (
            <div key={i} className="trait">
              <span>{a.trait_type}</span>
              <span>{a.value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
