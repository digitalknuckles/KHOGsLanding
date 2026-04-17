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

  // 🎯 SCENE COORDINATES (1920x1080 SPACE — SAME AS PAGE)
  const doorX = 1607; // px in scene
  const doorY = 1014; // px in scene

  return (
    <div
      className={`door ${isOpen ? 'open' : ''} ${pressed ? 'pressed' : ''}`}
      style={{
        position: 'absolute',
        left: `${(doorX / 1920) * 100}%`,
        top: `${(doorY / 1080) * 100}%`,
        transform: 'translate(-50%, -100%)', // anchor bottom center
        zIndex: 5,
        cursor: 'pointer'
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
        }, 300); // slightly faster feel
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
        style={{
          width: '140px',   // 👈 BASE SIZE (scales with scene automatically)
          height: 'auto',
          display: 'block',
          pointerEvents: 'none',
          transition: 'transform 0.15s ease, filter 0.15s ease'
        }}
      />
    </div>
  );
}
