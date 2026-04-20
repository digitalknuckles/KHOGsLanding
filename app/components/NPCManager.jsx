'use client';

import { useEffect, useRef, useState } from 'react';
import NPC from './NPC';

const BASE_CID = "https://ipfs.io/ipfs/bafybeide4mwhz4hzck5tnpchd4h5tsexsj6ij4nxddz2jaeqwb3bib5wyy";
const WORLD_WIDTH = 2560;

export default function NPCManager() {
  const [npcs, setNPCs] = useState([]);

  const npcsRef = useRef([]);
  const lastSpawnRef = useRef(0);
  const idRef = useRef(0);

  // 🎲 shuffled pool (prevents repeats)
  const poolRef = useRef(
    Array.from({ length: 46 }, (_, i) => i + 1)
      .sort(() => Math.random() - 0.5)
  );

  function getNextImage() {
    if (poolRef.current.length === 0) {
      poolRef.current = Array.from({ length: 46 }, (_, i) => i + 1)
        .sort(() => Math.random() - 0.5);
    }

    const i = poolRef.current.pop();
    return `${BASE_CID}/KnuckleheadsOG%23${i}.png`;
  }

  function createNPC() {
    const direction = Math.random() < 0.5 ? 'left' : 'right';

    // 🎯 DEPTH (CORRECT)
    const depth = Math.random();

    let z;
    if (depth < 0.33) z = 17;      // behind
    else if (depth < 0.66) z = 29; // mid
    else z = 32;                  // front

    // 🎯 SIZE BASED ON DEPTH
    const baseSize = 900;

    let size;
    if (z === 16) size = baseSize * 1.01;
    else if (z === 29) size = baseSize;
    else size = baseSize * 1.1;

    // 🎯 SPEED (tie to depth = more realism)
    const speedBase = 0.12 + Math.random() * 0.12;
    const speed =
      z === 16 ? speedBase * 0.8 :
      z === 29 ? speedBase :
      speedBase * 1.2;

    return {
      id: idRef.current++,
      src: getNextImage(),
      direction,
      z,
      size,

      x:
        direction === 'right'
          ? -600
          : WORLD_WIDTH + 600,

      speed
    };
  }

  useEffect(() => {
    let raf;

    function loop() {
      const now = performance.now();

      let next = [...npcsRef.current];

      // 🎯 SPAWN CONTROL (stable)
      if (
        next.length < 3 &&
        now - lastSpawnRef.current > 2500 + Math.random() * 3000
      ) {
        next.push(createNPC());
        lastSpawnRef.current = now;
      }

      // 🎯 MOVE
      next = next.map(npc => {
        const dir = npc.direction === 'right' ? 1 : -1;

        return {
          ...npc,
          x: npc.x + dir * npc.speed * 16
        };
      });

      // 🎯 CLEAN EXIT (no popping)
      next = next.filter(npc => {
        return npc.x > -900 && npc.x < WORLD_WIDTH + 900;
      });

      npcsRef.current = next;
      setNPCs(next);

      raf = requestAnimationFrame(loop);
    }

    raf = requestAnimationFrame(loop);

    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <>
      {npcs.map(npc => (
        <NPC key={npc.id} data={npc} />
      ))}
    </>
  );
}
