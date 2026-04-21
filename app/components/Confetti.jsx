'use client';

import { useEffect, useState } from 'react';

const CONFETTI_SRC = "https://ipfs.io/ipfs/bafkreiftwyllxleqocv23bwiorpxf5rse4mirzcrci6w4b52cq435nnbpu";

export default function Confetti({ active, onDone }) {
  const [pieces, setPieces] = useState([]);

  useEffect(() => {
    if (!active) return;

    const count = 60; // 🔥 number of confetti pieces

    const newPieces = Array.from({ length: count }).map((_, i) => {
      const size = 48 + Math.random() * 24;

      return {
        id: i,
        x: window.innerWidth / 2 + (Math.random() - 0.5) * 200, // burst center
        y: window.innerHeight / 2,

        vx: (Math.random() - 0.5) * 6, // horizontal burst
        vy: -8 - Math.random() * 6,    // upward burst

        gravity: 0.25 + Math.random() * 0.1,
        drift: (Math.random() - 0.5) * 0.3,

        rotation: Math.random() * 360,
        spin: (Math.random() - 0.5) * 10,

        size
      };
    });

    setPieces(newPieces);

    let raf;

    function animate() {
      setPieces(prev =>
        prev
          .map(p => {
            const next = { ...p };

            next.vy += next.gravity;
            next.vx += next.drift;

            next.x += next.vx;
            next.y += next.vy;

            next.rotation += next.spin;

            return next;
          })
          .filter(p => p.y < window.innerHeight + 100) // remove offscreen
      );

      raf = requestAnimationFrame(animate);
    }

    raf = requestAnimationFrame(animate);

    // cleanup after animation
    const timeout = setTimeout(() => {
      setPieces([]);
      onDone?.();
    }, 4000);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timeout);
    };
  }, [active]);

  if (!active) return null;

  return (
    <div className="confetti-layer">
      {pieces.map(p => (
        <img
          key={p.id}
          src={CONFETTI_SRC}
          alt="confetti"
          style={{
            position: 'fixed',
            left: 0,
            top: 0,
            width: `${p.size}px`,
            height: 'auto',

            transform: `
              translate(${p.x}px, ${p.y}px)
              rotate(${p.rotation}deg)
            `,

            pointerEvents: 'none',
            zIndex: 9999
          }}
          draggable={false}
        />
      ))}
    </div>
  );
}
