'use client';

import { useEffect, useRef } from 'react';

export default function NPC({ data, onExit }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const startX = data.direction === 'right' ? -200 : 2760;
    const endX = data.direction === 'right' ? 2760 : -200;

    // 🧭 movement ONLY (no scale, no bounce)
    el.style.transform = `translateX(${startX}px)`;

    requestAnimationFrame(() => {
      el.style.transition = `transform ${data.duration}ms linear`;
      el.style.transform = `translateX(${endX}px)`;
    });

    const timeout = setTimeout(() => {
      onExit(data.id);
    }, data.duration);

    return () => clearTimeout(timeout);
  }, [data, onExit]);

  return (
<div
  ref={ref}
  className="npc-wrapper"
  style={{
    position: 'absolute',
    bottom: 0,
    left: 0,
    zIndex: data.scale > 0.9 ? 6 : 4,
    pointerEvents: 'none'
  }}
>
  <div
    className="npc-bounce"
    style={{
      animationDuration: `${0.5 + Math.random() * 0.3}s`
    }}
  >
    <img
      src={data.src}
      alt="npc"
      draggable={false}
      style={{
        width: `${data.size}px`,
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
