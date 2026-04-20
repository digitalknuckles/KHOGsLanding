'use client';

import { useEffect, useRef, useState } from 'react';

const BASE_CID =
  "https://ipfs.io/ipfs/bafybeide4mwhz4hzck5tnpchd4h5tsexsj6ij4nxddz2jaeqwb3bib5wyy";

const WORLD_WIDTH = 2560;

export default function ShopWalker() {
  const ref = useRef(null);
  const [src, setSrc] = useState(null);
  const [active, setActive] = useState(false);

  function getRandomNPC() {
    const i = Math.floor(Math.random() * 46) + 1;
    return `${BASE_CID}/KnuckleheadsOG%23${i}.png`;
  }

  useEffect(() => {
    let timeout;

    function startCycle() {
      setSrc(getRandomNPC());
      setActive(true);

      const el = ref.current;
      if (!el) return;

      const buffer = 400;

      // 🟢 STEP 1: ENTER FROM LEFT
      //el.style.transition = 'none';
      const duration = 5000 + Math.random() * 3000;
      el.style.transition = `transform ${duration}ms linear`;
      el.style.transform = `translateX(${-buffer}px) scale(0.65) scaleX(1)`;

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          el.style.transition = 'transform 6s linear';
          el.style.transform = `translateX(${WORLD_WIDTH - 300}px) scale(0.65) scaleX(1)`;
        });
      });

      // 🟡 STEP 2: PAUSE AT RIGHT
      const pauseTime = 7000 + Math.random() * 7000;

      setTimeout(() => {
        // 🔁 flip direction
        el.style.transition = 'none';
        el.style.transform = `translateX(${WORLD_WIDTH - 300}px) scale(0.65) scaleX(-1)`;

        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            // 🔴 STEP 3: WALK BACK LEFT
            el.style.transition = 'transform 6s linear';
            el.style.transform = `translateX(${-buffer}px) scale(0.65) scaleX(-1)`;
          });
        });

        // 🧹 CLEANUP AFTER EXIT
        setTimeout(() => {
          setActive(false);

          // 🔁 NEXT CYCLE (30–45s)
          timeout = setTimeout(startCycle, 30000 + Math.random() * 15000);
        }, 6000);

      }, 6000 + pauseTime); // walk duration + pause

    }

    // initial delay so it doesn’t fire instantly
    timeout = setTimeout(startCycle, 2000 + Math.random() * 3000);

    return () => clearTimeout(timeout);
  }, []);

  if (!active || !src) return null;

  return (
    <div
      ref={ref}
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        zIndex: 2, // 👈 BETWEEN BG AND COUNTER
        pointerEvents: 'none'
      }}
    >
      <div className="npc-bounce">
        <img
          src={src}
          alt="shop walker"
          draggable={false}
          style={{
            width: '500px',
            height: 'auto',
            transformOrigin: 'bottom center'
          }}
        />
      </div>
    </div>
  );
}
