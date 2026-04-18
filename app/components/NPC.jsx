'use client';

import { useEffect, useRef } from 'react';

export default function NPC({ data, onExit }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const startX = data.direction === 'right' ? -300 : 2860;
    const endX = data.direction === 'right' ? 2860 : -300;

    // 🧭 movement ONLY
    el.style.transform = `translateX(${startX}px)`;

    requestAnimationFrame(() => {
      el.style.transition = `transform ${data.duration}ms linear`;
      el.style.transform = `translateX(${endX}px)`;
    });

    // ⏱ delay removal slightly AFTER leaving screen
    const timeout = setTimeout(() => {
      onExit(data.id);
    }, data.duration + 300);

    return () => clearTimeout(timeout);
  }, [data, onExit]);

  return (
    <div
      ref={ref}
      style={{
        position: 'absolute',
        bottom: 0, // ✅ grounded like character
        left: 0,
        zIndex: data.scale > 0.9 ? 7 : 4,
        pointerEvents: 'none'
      }}
    >
      {/* 🎯 bounce layer */}
      <div
        className="npc-bounce"
        style={{
          animationDuration: `${0.5 + Math.random() * 0.3}s`
        }}
      >
        {/* 🎯 flip + size layer */}
        <img
          src={data.src}
          alt="npc"
          draggable={false}
          style={{
            width: `${data.size}px`,
            height: 'auto',

            transform: data.direction === 'left'
              ? 'scaleX(-1)'
              : 'scaleX(1)',

            transformOrigin: 'bottom center'
          }}
        />
      </div>
    </div>
  );
}
