'use client';

import { useEffect, useState, useRef } from 'react';

const CID =
  "https://ipfs.io/ipfs/bafybeide4mwhz4hzck5tnpchd4h5tsexsj6ij4nxddz2jaeqwb3bib5wyy";

const MAX_NPCS = 3;

function getRandomNPC() {
  const id = Math.floor(Math.random() * 46) + 1;
  return `${CID}/KnuckleheadsOG#${id}.png`;
}

export default function NPCManager() {
  const [npcs, setNpcs] = useState([]);
  const idRef = useRef(0);

  useEffect(() => {
    let spawnTimer;

    function spawnNPC() {
      setNpcs((prev) => {
        if (prev.length >= MAX_NPCS) return prev;

        const direction = Math.random() > 0.5 ? 'right' : 'left';

        const depth = Math.random() > 0.5 ? 4 : 7;

        const scale = depth === 4
          ? 0.7 + Math.random() * 0.1   // farther (smaller)
          : 0.9 + Math.random() * 0.2;  // closer (bigger)

        const y = depth === 4
          ? 78 + Math.random() * 4   // back lane
          : 82 + Math.random() * 4;  // front lane

        const duration = 8000 + Math.random() * 8000; // speed variation

        const npc = {
          id: idRef.current++,
          src: getRandomNPC(),
          direction,
          scale,
          y,
          duration
        };

        return [...prev, npc];
      });

      // random spawn delay
      const delay = 2000 + Math.random() * 5000;
      spawnTimer = setTimeout(spawnNPC, delay);
    }

    spawnNPC();

    return () => clearTimeout(spawnTimer);
  }, []);

  function removeNPC(id) {
    setNpcs((prev) => prev.filter((n) => n.id !== id));
  }

  return (
    <>
      {npcs.map((npc) => (
        <NPC key={npc.id} data={npc} onExit={removeNPC} />
      ))}
    </>
  );
}
