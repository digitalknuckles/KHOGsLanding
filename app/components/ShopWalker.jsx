'use client';

import { useEffect, useRef, useState } from 'react';

const WORLD_WIDTH = 2560;
const BASE_CID = "https://ipfs.io/ipfs/bafybeide4mwhz4hzck5tnpchd4h5tsexsj6ij4nxddz2jaeqwb3bib5wyy";

function getRandomNPC() {
  const i = Math.floor(Math.random() * 46) + 1;
  return `${BASE_CID}/KnuckleheadsOG%23${i}.png`;
}

export default function ShopWalker() {
  const ref = useRef(null);

  const [npc, setNpc] = useState(null);

  useEffect(() => {
    let raf;

    function spawn() {
      const newNpc = {
        src: getRandomNPC(),
        x: -400,
        direction: 'right',
        speed: 0.18 + Math.random() * 0.12,
        state: 'walking-right',
        pauseUntil: null
      };

      setNpc(newNpc);
    }

    function loop() {
      setNpc(prev => {
        if (!prev) return prev;

        let next = { ...prev };

        // 👉 WALK RIGHT
        if (next.state === 'walking-right') {
          next.x += next.speed * 16;

          if (next.x >= WORLD_WIDTH - 200) {
            next.state = 'pause';
            next.pauseUntil = performance.now() + (7000 + Math.random() * 7000);
          }
        }

        // 👉 PAUSE
        else if (next.state === 'pause') {
          if (performance.now() >= next.pauseUntil) {
            next.state = 'walking-left';
            next.direction = 'left';
          }
        }

        // 👉 WALK LEFT (EXIT)
        else if (next.state === 'walking-left') {
          next.x -= next.speed * 16;

          if (next.x < -500) {
            // despawn and schedule next spawn
            setTimeout(() => spawn(), 30000 + Math.random() * 15000);
            return null;
          }
        }

        return next;
      });

      raf = requestAnimationFrame(loop);
    }

    spawn();
    raf = requestAnimationFrame(loop);

    return () => cancelAnimationFrame(raf);
  }, []);

  if (!npc) return null;

  return (
    <div
      ref={ref}
      style={{
        position: 'absolute',
        bottom: '52%', // 🔥 adjust Y position here
        left: 0,
        transform: `translateX(${npc.x}px)`,
        zIndex: 2, // between bg and counter1
        pointerEvents: 'none'
      }}
    >
      <div
        className="npc-bounce"
        style={{
          animationDuration: '0.35s'
        }}
      >
        <img
          src={npc.src}
          alt="shop-walker"
          draggable={false}
          style={{
            width: '420px', // 🔥 tuned size
            height: 'auto',
            transform:
              npc.direction === 'right'
                ? 'scaleX(-1)'
                : 'scaleX(1)',
            transformOrigin: 'bottom center'
          }}
        />
      </div>
    </div>
  );
}
