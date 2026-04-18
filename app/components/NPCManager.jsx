'use client';

import { useEffect, useState, useRef } from 'react';
import NPC from './NPC';

const BASE_CID = "https://ipfs.io/ipfs/bafybeide4mwhz4hzck5tnpchd4h5tsexsj6ij4nxddz2jaeqwb3bib5wyy";

export default function NPCManager() {
  const [npcs, setNPCs] = useState([]);
  const idRef = useRef(0);

  function getRandomNPC(id) {
    const index = Math.floor(Math.random() * 46) + 1;

    const scale = 0.6 + Math.random() * 0.6;

    return {
      id,
      src: `${BASE_CID}/KnuckleheadsOG%23${index}.png`,
      direction: Math.random() > 0.5 ? 'right' : 'left',
      scale,
      size: 500 + scale * 500,
      duration: (4000 + Math.random() * 4000) / scale
    };
  }

  useEffect(() => {
    let active = true;

    function spawnNPC() {
      if (!active) return;

      setNPCs(prev => {
        if (prev.length >= 3) return prev;

        const newNPC = getRandomNPC(idRef.current++);
        return [...prev, newNPC];
      });

      const delay = 2000 + Math.random() * 5000;
      setTimeout(spawnNPC, delay);
    }

    spawnNPC();

    return () => {
      active = false;
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
