'use client';

import { useEffect, useState, useRef } from 'react';
import NPC from './NPC';

const BASE_CID = "https://ipfs.io/ipfs/bafybeide4mwhz4hzck5tnpchd4h5tsexsj6ij4nxddz2jaeqwb3bib5wyy";

export default function NPCManager() {
  const [npcs, setNPCs] = useState([]);

  const idRef = useRef(0);
  const indexRef = useRef(1); // 🔥 FORCED IMAGE CYCLE
  const activeRef = useRef(true);

  function getNextImage() {
    const i = indexRef.current;

    indexRef.current++;
    if (indexRef.current > 46) indexRef.current = 1;

    return `${BASE_CID}/KnuckleheadsOG%23${i}.png`;
  }

  function createNPC() {
    const scale = 0.6 + Math.random() * 0.6;

    return {
      id: idRef.current++,
      src: getNextImage(),

      // ✅ TRUE RANDOM DIRECTION
      direction: Math.random() < 0.5 ? 'left' : 'right',

      scale,
      size: 500 + scale * 500,

      // slower + more natural pacing
      duration: (5000 + Math.random() * 4000) / scale
    };
  }

  useEffect(() => {
    function spawnLoop() {
      if (!activeRef.current) return;

      setNPCs(prev => {
        // 🔥 HARD LIMIT
        if (prev.length >= 3) return prev;

        const next = createNPC();
        return [...prev, next];
      });

      // 🔥 MUCH BETTER TIMING (less spam)
      const delay = 2500 + Math.random() * 5000;

      setTimeout(spawnLoop, delay);
    }

    spawnLoop();

    return () => {
      activeRef.current = false;
    };
  }, []);

  function removeNPC(id) {
    setNPCs(prev => prev.filter(npc => npc.id !== id));
  }

  return (
    <>
      {npcs.map(npc => (
        <NPC key={npc.id} data={npc} onExit={removeNPC} />
      ))}
    </>
  );
}
