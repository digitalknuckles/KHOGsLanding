'use client';

export default function NPC({ data }) {
  return (
    <div
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        pointerEvents: 'none',

        zIndex: data.z,

        // 🔥 WORLD POSITION ONLY
        transform: `translateX(${data.x}px)`
      }}
    >
      <div
        style={{
          animation: `npcBounce 0.4s infinite ease-in-out`
        }}
      >
        <img
          src={data.src}
          alt="npc"
          draggable={false}
          style={{
            // ✅ PURE PIXELS (NO %, NO SCALE)
            width: `${data.size}px`,
            height: 'auto',

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
