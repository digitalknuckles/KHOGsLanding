'use client';

import { useEffect, useState, useRef } from 'react';
import NPC from './NPC';

const BASE_CID = "https://ipfs.io/ipfs/bafybeide4mwhz4hzck5tnpchd4h5tsexsj6ij4nxddz2jaeqwb3bib5wyy";

export default function NPCManager() {
  const [npcs, setNPCs] = useState([]);

  const idRef = useRef(0);
  const activeRef = useRef(true);

  function getRandomImage() {
    const i = Math.floor(Math.random() * 46) + 1;
    return `${BASE_CID}/KnuckleheadsOG%23${i}.png`;
  }

  function createNPC() {
    const direction = Math.random() < 0.5 ? 'left' : 'right';
    const depth = Math.random() < 0.5 ? 4 : 7;

    return {
      id: idRef.current++,
      src: getRandomImage(),
      direction,
      z: depth,

      size: 500, // 🔥 fixed size

      // slower variation
      duration: 7000 + Math.random() * 4000,

      // slight vertical variation (optional)
      y: 0
    };
  }

  useEffect(() => {
    function spawnLoop() {
      if (!activeRef.current) return;

      setNPCs(prev => {
        if (prev.length >= 3) return prev;

        return [...prev, createNPC()];
      });

      const delay = 4000 + Math.random() * 5000;
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
