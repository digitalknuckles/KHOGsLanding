'use client';

import { useState, useRef } from 'react';

const CLOSED =
  "https://ipfs.io/ipfs/bafkreicelhsdslcflfflph3hwsez3ytdle53nbnyr3i7f4yain4d5tbtqy";

const OPEN =
  "https://ipfs.io/ipfs/bafkreicngryldkw3ntzgndo3dsoowfee7i7jbp5kmerrdadrjonqhzsome";

export default function Door({ onEnter }) {
  const [isOpen, setIsOpen] = useState(false);
  const [pressed, setPressed] = useState(false);
  const holdRef = useRef(null);

  // 🎯 NOW MATCHES YOUR TRUE SCENE (2560x1440)
  const doorX = 2135; // ← convert from your placement
  const doorY = 1225;

  return (
    <div
      className={`door ${isOpen ? 'open' : ''} ${pressed ? 'pressed' : ''}`}
      style={{
        position: 'absolute',
        left: `${(doorX / 2560) * 100}%`,
        top: `${(doorY / 1440) * 100}%`,
        transform: 'translate(-50%, -100%)',
        zIndex: 5,
        cursor: 'pointer'
      }}

      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => {
        setIsOpen(false);
        setPressed(false);
      }}

      onTouchStart={() => {
        setPressed(true);
        setIsOpen(true);

        holdRef.current = setTimeout(() => {
          if (onEnter) onEnter();
        }, 300);
      }}

      onTouchEnd={() => {
        clearTimeout(holdRef.current);
        setPressed(false);

        if (onEnter) onEnter();
      }}

      onClick={() => {
        if (onEnter) onEnter();
      }}
    >
      <img
        src={isOpen ? OPEN : CLOSED}
        alt="door"
        draggable={false}
      />
    </div>
  );
}
