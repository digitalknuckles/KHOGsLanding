'use client';

import { useEffect, useState } from 'react';
import NPC from './NPC';

const BASE_CID = "https://ipfs.io/ipfs/bafybeide4mwhz4hzck5tnpchd4h5tsexsj6ij4nxddz2jaeqwb3bib5wyy";

function getRandomNPC(id) {
  const index = Math.floor(Math.random() * 46) + 1;

  return {
    id,
    src: `${BASE_CID}/KnuckleheadsOG#${index}.png`,
    direction: Math.random() > 0.5 ? 'right' : 'left',
    duration: 4000 + Math.random() * 5000,
    y: 70 + Math.random() * 20,
    scale: 0.7 + Math.random() * 0.5
  };
}

export default function NPCManager() {
  const [npcs, setNpcs] = useState([]);

  useEffect(() => {
    let idCounter = 0;

    function spawnNPC() {
      setNpcs(prev => {
        if (prev.length >= 3) return prev;

        const newNPC = getRandomNPC(idCounter++);
        return [...prev, newNPC];
      });

      const delay = 2000 + Math.random() * 5000;
      setTimeout(spawnNPC, delay);
    }

    spawnNPC();
  }, []);

  function handleExit(id) {
    setNpcs(prev => prev.filter(npc => npc.id !== id));
  }

  return (
    <>
      {npcs.map(npc => (
        <NPC key={npc.id} data={npc} onExit={handleExit} />
      ))}
    </>
  );
}
