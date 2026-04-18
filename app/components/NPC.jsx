'use client';

import { useEffect, useRef } from 'react';

const WORLD_WIDTH = 2560;

export default function NPC({ data, onExit }) {
  const ref = useRef(null);
  const exitedRef = useRef(false); // 🔒 prevent double removal

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const buffer = 400;

    const startX =
      data.direction === 'right'
        ? -buffer
        : WORLD_WIDTH + buffer;

    const endX =
      data.direction === 'right'
        ? WORLD_WIDTH + buffer
        : -buffer;

    // 🧼 reset
    el.style.transition = 'none';
    el.style.transform = `translateX(${startX}px)`;

    // 🎬 start movement (double RAF = reliable)
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.style.transition = `transform ${data.duration}ms linear`;
        el.style.transform = `translateX(${endX}px)`;
      });
    });

    // 🧠 WORLD-BASED EXIT (NOT viewport)
    const timeout = setTimeout(() => {
      if (!exitedRef.current) {
        exitedRef.current = true;
        onExit(data.id);
      }
    }, data.duration + 100); // small buffer

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
        zIndex: data.scale > 0.9 ? 7 : 4
      }}
    >
      {/* 🦶 BOUNCE LAYER */}
      <div
        className="npc-bounce"
        style={{
          animation: `npcBounce ${
            0.35 + (data.id % 3) * 0.08
          }s infinite ease-in-out`
        }}
      >
        <img
          src={data.src}
          alt="npc"
          draggable={false}
          style={{
            width: `${data.size}px`,
            height: 'auto',

            // 🎯 base art faces LEFT
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
