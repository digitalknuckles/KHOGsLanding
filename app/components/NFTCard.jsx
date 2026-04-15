'use client';
import { useState, useRef } from 'react';

export default function NFTCard({ nfts, activeIndex, setActiveIndex }) {
  const [open, setOpen] = useState(false);
  const startX = useRef(0);
  const startTime = useRef(0);

  if (!nfts || nfts.length === 0) {
    return <div className="card show">No NFTs Found</div>;
  }

  const nft = nfts[activeIndex];

  function onTouchStart(e) {
    startX.current = e.touches[0].clientX;
    startTime.current = Date.now();
  }

  function onTouchEnd(e) {
    const dx = e.changedTouches[0].clientX - startX.current;
    const dt = Date.now() - startTime.current;

    const velocity = dx / dt;

    // 👉 swipe navigation
    if (dx > 50 || velocity > 0.5) {
      if (activeIndex > 0) setActiveIndex(activeIndex - 1);
    } else if (dx < -50 || velocity < -0.5) {
      if (activeIndex < nfts.length - 1) setActiveIndex(activeIndex + 1);
    }
  }

  return (
    <div
      className="card show"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <img src={nft.image} className="nft-img" />

      <h3>{nft.name}</h3>

      {/* dots */}
      <div className="dots">
        {nfts.map((_, i) => (
          <span key={i} className={i === activeIndex ? 'dot active' : 'dot'} />
        ))}
      </div>

      {/* ✅ FIXED DROPDOWN */}
      <button
        className="dropdown"
        onClick={() => setOpen(!open)}
      >
        {open ? 'Hide Traits ▲' : 'Show Traits ▼'}
      </button>

      {/* ✅ TRAITS PANEL */}
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
