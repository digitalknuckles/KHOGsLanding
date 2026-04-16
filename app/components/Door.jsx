'use client';

import { useState, useRef } from 'react';

const CLOSED =
  "https://ipfs.io/ipfs/bafkreicelhsdslcflfflph3hwsez3ytdle53nbnyr3i7f4yain4d5tbtqy";

const OPEN =
  "https://ipfs.io/ipfs/bafkreicngryldkw3ntzgndo3dsoowfee7i7jbp5kmerrdadrjonqhzsome";

export default function Door({ onEnter, scale = 1 }) {
  const [isOpen, setIsOpen] = useState(false);
  const [pressed, setPressed] = useState(false);
  const holdRef = useRef(null);

  // 🎯 POSITION (based on your background)
  const doorX = 1200 / 1920;
  const doorY = 540 / 1080;

  return (
    <div
      className={`door ${isOpen ? 'open' : ''} ${pressed ? 'pressed' : ''}`}
      style={{
        left: `${doorX * 100}%`,
        top: `${doorY * 100}%`,
        '--scale': scale
      }}

      // 🖱 DESKTOP
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => {
        setIsOpen(false);
        setPressed(false);
      }}

      // 📱 TOUCH
      onTouchStart={() => {
        setPressed(true);
        setIsOpen(true);

        holdRef.current = setTimeout(() => {
          if (onEnter) onEnter();
        }, 350);
      }}

      onTouchEnd={() => {
        clearTimeout(holdRef.current);
        setPressed(false);

        if (onEnter) onEnter();
      }}

      // 🖱 CLICK
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
