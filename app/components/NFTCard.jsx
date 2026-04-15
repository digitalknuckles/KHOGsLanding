'use client';
import { useRef } from 'react';

export default function NFTCard({ nfts, activeIndex, setActiveIndex }) {
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

    // 🎯 inertia logic
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

      <div className="dots">
        {nfts.map((_, i) => (
          <span key={i} className={i === activeIndex ? 'dot active' : 'dot'} />
        ))}
      </div>

      <button className="dropdown">
        Swipe to browse →
      </button>
    </div>
  );
}
