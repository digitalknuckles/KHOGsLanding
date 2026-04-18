'use client';

import { useEffect, useState, useRef } from 'react';
import NPC from './NPC';

const BASE_CID = "https://ipfs.io/ipfs/bafybeide4mwhz4hzck5tnpchd4h5tsexsj6ij4nxddz2jaeqwb3bib5wyy";

export default function NPCManager() {
  const [npcs, setNPCs] = useState([]);

  const idRef = useRef(0);
  const indexRef = useRef(1);
  const activeRef = useRef(true);
  const lastDirectionRef = useRef(null);

  function getNextImage() {
    const i = indexRef.current;
    indexRef.current++;
    if (indexRef.current > 46) indexRef.current = 1;

    return `${BASE_CID}/KnuckleheadsOG%23${i}.png`;
  }

  function createNPC() {
    let direction = Math.random() < 0.5 ? 'left' : 'right';

    // prevent same direction spam
    if (direction === lastDirectionRef.current) {
      direction = direction === 'left' ? 'right' : 'left';
    }

    lastDirectionRef.current = direction;

    const scale = 0.7 + Math.random() * 0.6;

    return {
      id: idRef.current++,
      src: getNextImage(),
      direction,
      scale,
      size: 500 + scale * 500,

      // slower = larger NPC feels heavier
      duration: (6000 + Math.random() * 4000) / scale
    };
  }

  useEffect(() => {
    function spawnLoop() {
      if (!activeRef.current) return;

      setNPCs(prev => {
        if (prev.length >= 3) return prev;

        const npc = createNPC();
        return [...prev, npc];
      });

      const delay = 3000 + Math.random() * 5000;
      setTimeout(spawnLoop, delay);
    }

    spawnLoop();

    return () => {
      activeRef.current = false;
    };
  }, []);

  function removeNPC(id) {
    setNPCs(prev => prev.filter(n => n.id !== id));
  }

  return (
    <>
      {npcs.map(npc => (
        <NPC key={npc.id} data={npc} onExit={removeNPC} />
      ))}
    </>
  );
}
