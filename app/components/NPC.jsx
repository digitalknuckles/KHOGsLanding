'use client';

import { useEffect, useRef } from 'react';

export default function NPC({ data, onExit }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const startX = data.direction === 'right' ? -200 : 2760;
    const endX = data.direction === 'right' ? 2760 : -200;

    el.style.transform = `
      translateX(${startX}px)
      translateY(-50%)
      scale(${data.scale})
    `;

    requestAnimationFrame(() => {
      el.style.transition = `transform ${data.duration}ms linear`;

      el.style.transform = `
        translateX(${endX}px)
        translateY(-50%)
        scale(${data.scale})
      `;
    });

    const timeout = setTimeout(() => {
      onExit(data.id);
    }, data.duration);

    return () => clearTimeout(timeout);
  }, [data, onExit]);

  return (
<img
  ref={ref}
  src={data.src}
  className="npc"
  style={{
    top: `${data.y}%`,
    position: 'absolute',
    pointerEvents: 'none',

    // ✅ CONTROL REAL SIZE
    width: `${data.size}px`,
    height: 'auto',

    zIndex: data.scale > 0.9 ? 6 : 4,
    animation: 'npcBounce 0.6s infinite ease-in-out'
  }}
  alt="npc"
  draggable={false}
/>
  );
}
