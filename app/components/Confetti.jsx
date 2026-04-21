'use client';

import { useEffect, useState } from 'react';

const CONFETTI_SRC = "https://ipfs.io/ipfs/bafkreiftwyllxleqocv23bwiorpxf5rse4mirzcrci6w4b52cq435nnbpu";

export default function Confetti({ trigger }) {
  const [pieces, setPieces] = useState([]);

  useEffect(() => {
    if (!trigger) return;

    const count = 60;

    const newPieces = Array.from({ length: count }, (_, i) => {
      const angle = Math.random() * Math.PI * 2;
      const velocity = 6 + Math.random() * 6;

      return {
        id: i + '-' + Date.now(),

        x: window.innerWidth / 2,
        y: window.innerHeight / 2,

        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity - 8,

        size: 48 + Math.random() * 24,

        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 12,

        sway: Math.random() * 2,
        swaySpeed: 0.02 + Math.random() * 0.03
      };
    });

    setPieces(newPieces);

    let raf;

    function animate() {
      setPieces(prev =>
        prev
          .map(p => {
            let next = { ...p };

            // gravity
            next.vy += 0.25;

            // movement
            next.x += next.vx + Math.sin(Date.now() * next.swaySpeed) * next.sway;
            next.y += next.vy;

            // rotation
            next.rotation += next.rotationSpeed;

            return next;
          })
          .filter(p => p.y < window.innerHeight + 120) // cleanup
      );

      raf = requestAnimationFrame(animate);
    }

    raf = requestAnimationFrame(animate);

    // 🔥 auto destroy after ~4s
    const timeout = setTimeout(() => {
      setPieces([]);
      cancelAnimationFrame(raf);
    }, 4000);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timeout);
    };
  }, [trigger]);

  if (!pieces.length) return null;

  return (
    <div className="confetti-layer">
      {pieces.map(p => (
        <img
          key={p.id}
          src={CONFETTI_SRC}
          alt=""
          draggable={false}
          style={{
            position: 'fixed',
            left: 0,
            top: 0,

            transform: `
              translate3d(${p.x}px, ${p.y}px, 0)
              rotate(${p.rotation}deg)
            `,

            width: `${p.size}px`,
            height: 'auto',

            pointerEvents: 'none',
            zIndex: 9999
          }}
        />
      ))}
    </div>
  );
}
