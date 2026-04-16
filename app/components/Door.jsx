'use client';

import { useState, useRef } from 'react';

const DOOR_ASSET =
  "https://ipfs.io/ipfs/bafkreicngryldkw3ntzgndo3dsoowfee7i7jbp5kmerrdadrjonqhzsome";

export default function Door({ onEnter }) {
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);
  const holdRef = useRef(null);

  // 🎯 POSITION (relative to 1920x1080 background)
const doorX = 1745 / 1920; // ✅ correct
const doorY = 320 / 1080;  // 🔥 FIX (NOT 0)

  return (
    <div
      className={`door ${hovered || pressed ? 'active' : ''}`}
      style={{
        left: `${doorX * 100}%`,
        top: `${doorY * 100}%`
      }}

      // 🖱 DESKTOP
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        setPressed(false);
      }}

      // 📱 TOUCH
      onTouchStart={() => {
        setPressed(true);

        // simulate hold
        holdRef.current = setTimeout(() => {
          console.log('🚪 HOLD TRIGGER');
        }, 300);
      }}

      onTouchEnd={() => {
        clearTimeout(holdRef.current);
        setPressed(false);

        // 🎯 CLICK ACTION (transition placeholder)
        if (onEnter) onEnter();
      }}

      onClick={() => {
        if (onEnter) onEnter();
      }}
    >
      <img src={DOOR_ASSET} alt="door" />
    </div>
  );
}
