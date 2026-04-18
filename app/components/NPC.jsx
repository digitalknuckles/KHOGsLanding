'use client';

import { useEffect, useRef } from 'react';

const WORLD_WIDTH = 2560;

export default function NPC({ data, onExit }) {
  const ref = useRef(null);

useEffect(() => {
  const el = ref.current;
  if (!el) return;

  const buffer = 400;

  const startX = data.direction === 'right'
    ? -buffer
    : WORLD_WIDTH + buffer;

  const endX = data.direction === 'right'
    ? WORLD_WIDTH + buffer
    : -buffer;

  // reset
  el.style.transition = 'none';
  el.style.transform = `translateX(${startX}px)`;

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      el.style.transition = `transform ${data.duration}ms linear`;
      el.style.transform = `translateX(${endX}px)`;
    });
  });

  let raf;

  const checkExit = () => {
    const rect = el.getBoundingClientRect();

    const offLeft = rect.right < -100;
    const offRight = rect.left > window.innerWidth + 100;

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
        zIndex: data.scale > 0.9 ? 7 : 4
      }}
    >
      {/* 🦶 BOUNCE LAYER */}
      <div
        className="npc-bounce"
        style={{
          animationDuration: `${0.35 + Math.random() * 0.15}s` // ⚡ faster
        }}
      >
        <img
          src={data.src}
          alt="npc"
          draggable={false}
          style={{
            width: `${data.size}px`,
            height: 'auto',

            // 🎯 FIXED: base art faces LEFT
            transform:
              data.direction === 'right'
                ? 'scaleX(-1)' // flip to face right
                : 'scaleX(1)', // keep natural left

            transformOrigin: 'bottom center'
          }}
        />
      </div>
    </div>
  );
}
