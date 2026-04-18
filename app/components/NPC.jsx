'use client';

import { useEffect, useRef } from 'react';

const WORLD_WIDTH = 2560;

export default function NPC({ data, onExit }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const buffer = 500;

    const startX =
      data.direction === 'right'
        ? -buffer
        : WORLD_WIDTH + buffer;

    const endX =
      data.direction === 'right'
        ? WORLD_WIDTH + buffer
        : -buffer;

    // RESET POSITION (NO TRANSITION)
    el.style.transition = 'none';
    el.style.transform = `translateX(${startX}px)`;

    // FORCE PAINT → THEN ANIMATE
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.style.transition = `transform ${data.duration}ms linear`;
        el.style.transform = `translateX(${endX}px)`;
      });
    });

    // ✅ FIX: TIME-BASED EXIT (NO DOM MEASUREMENTS)
    const timeout = setTimeout(() => {
      onExit(data.id);
    }, data.duration);

    return () => clearTimeout(timeout);
  }, [data, onExit]);

  return (
    <div
      ref={ref}
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        pointerEvents: 'none',
        zIndex: Math.floor(data.scale * 10)
      }}
    >
      {/* 🦶 BOUNCE LAYER */}
      <div
        className="npc-bounce"
        style={{
          animation: `npcBounce ${0.35 + Math.random() * 0.15}s infinite ease-in-out`
        }}
      >
        <img
          src={data.src}
          alt="npc"
          draggable={false}
          style={{
            width: `${data.size}px`,
            height: 'auto',

            // BASE ART FACES LEFT → flip when going right
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
