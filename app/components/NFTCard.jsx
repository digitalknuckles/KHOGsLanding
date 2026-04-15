'use client';
import { useState, useRef } from 'react';

export default function NFTCard({ nfts, activeIndex, setActiveIndex }) {
  const [open, setOpen] = useState(false);
  const touchStartX = useRef(0);

  if (!nfts || nfts.length === 0) {
    return <div className="card show">No NFTs Found</div>;
  }

  const nft = nfts[activeIndex];

  function handleTouchStart(e) {
    touchStartX.current = e.touches[0].clientX;
  }

  function handleTouchEnd(e) {
    const delta = e.changedTouches[0].clientX - touchStartX.current;

    if (delta > 50 && activeIndex > 0) {
      setActiveIndex(activeIndex - 1);
    } else if (delta < -50 && activeIndex < nfts.length - 1) {
      setActiveIndex(activeIndex + 1);
    }
  }

  return (
    <div
      className="card show"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <img src={nft.image} className="nft-img" />

      <h3>{nft.name}</h3>

      {/* Carousel indicators */}
      <div className="dots">
        {nfts.map((_, i) => (
          <span
            key={i}
            className={i === activeIndex ? 'dot active' : 'dot'}
          />
        ))}
      </div>

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
