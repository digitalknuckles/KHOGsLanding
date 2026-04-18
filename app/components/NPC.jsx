'use client';

import { useEffect, useRef } from 'react';

const WORLD_WIDTH = 2560;

export default function NPC({ data, onExit }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const buffer = 600; // 🔥 ensures full off-screen spawn + exit

    const startX =
      data.direction === 'right'
        ? -buffer
        : WORLD_WIDTH + buffer;

    const endX =
      data.direction === 'right'
        ? WORLD_WIDTH + buffer
        : -buffer;

    // RESET
    el.style.transition = 'none';
    el.style.transform = `translateX(${startX}px)`;

    // FORCE PAINT → START ANIMATION
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.style.transition = `transform ${data.duration}ms linear`;
        el.style.transform = `translateX(${endX}px)`;
      });
    });

    // 🔥 EDGE DETECTION EXIT (REAL FIX)
    let raf;

    const checkExit = () => {
      const rect = el.getBoundingClientRect();

      const offLeft = rect.right < -600;
      const offRight = rect.left > window.innerWidth + 600;

      if (offLeft || offRight) {
        onExit(data.id);
        return;
      }

      raf = requestAnimationFrame(checkExit);
    };

    raf = requestAnimationFrame(checkExit);

    return () => cancelAnimationFrame(raf);
  }, [data, onExit]);

  return (
    <div
      ref={ref}
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        pointerEvents: 'none',

        // 🔥 depth layering
        zIndex: data.z
      }}
    >
      {/* 🦶 BOUNCE LAYER */}
      <div
        style={{
          animation: `npcBounce ${0.3 + Math.random() * 0.2}s infinite ease-in-out`
        }}
      >
        <img
          src={data.src}
          alt="npc"
          draggable={false}
          style={{
            width: `${data.size}px`,
            height: 'auto',

            // 🎯 BASE ART FACES LEFT
            transform:
              data.direction === 'right'
                ? 'scaleX(-1)'
                : 'scaleX(1)',

            transformOrigin: 'bottom center'
          }}
        />
      </div>
    </div>
  );
}
