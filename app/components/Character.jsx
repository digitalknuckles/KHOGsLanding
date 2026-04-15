'use client';

import { useEffect, useRef } from 'react';

const assets = {
  left1: "https://ipfs.io/ipfs/bafkreiheo32ehfntwpmxcars2ta4mq3hqhoheqzsr6ygyuyccbvjwpie7e",
  left2: "https://ipfs.io/ipfs/bafkreifcpvhdaydz64st2ozhwh4ltgzo6dschjd4ehxtmwiqeuphlcfsby",
  right1: "https://ipfs.io/ipfs/bafkreifdy25dy7oywuhwauo2y7jacny3lghk2vficddvbwx2rpy6f4zxqu",
  right2: "https://ipfs.io/ipfs/bafkreic7tlur3ycl2r3zjuuxbghhfihucexc3biucb753j2576ltrogptq",
  flip: "https://ipfs.io/ipfs/bafkreic6iy37nlapsjm2tgvfzb72fkop47lgwwthjaomyg7sl63pp7lcgy"
};

export default function Character({ currentTab, tabsRef }) {
  const characterRef = useRef(null);
  const prevTab = useRef(0);
  const walkInterval = useRef(null);

  function getTabX(index) {
    const el = tabsRef.current[index];
    if (!el || !characterRef.current) return 0;

    const rect = el.getBoundingClientRect();
    return rect.left + rect.width / 2 - characterRef.current.offsetWidth / 2;
  }

  let baseX = rect.left + rect.width / 2 - characterRef.current.offsetWidth / 2;

  // 🎯 OFFSET SYSTEM (tweak these values)
  const offsets = {
    0: -120, // HOME → move LEFT
    1: 0,
    2: 0,
    3: 120  // PROFILE → move RIGHT
  };

  return baseX + (offsets[index] || 0);
}
  
  
  useEffect(() => {
    const char = characterRef.current;
    if (!char) return;

    const from = prevTab.current;
    const to = currentTab;

    if (from === to) return;

    const goingRight = to > from;

    const walkFrames = goingRight
      ? [assets.right1, assets.right2]
      : [assets.left1, assets.left2];

    let frame = 0;

    // 🔁 WALK LOOP
    clearInterval(walkInterval.current);
    walkInterval.current = setInterval(() => {
      char.src = walkFrames[frame % 2];
      frame++;
    }, 180);

    const distance = Math.abs(to - from);
    const duration = 1200 + distance * 400;

    char.style.transition = `transform ${duration}ms linear`;
    char.style.transform = `translateX(${getTabX(to)}px)`;

    // 🛑 STOP WALK + FLIP + IDLE
    const timeout = setTimeout(() => {
      clearInterval(walkInterval.current);

      char.src = assets.flip;

      setTimeout(() => {
        // 🎯 FINAL IDLE ORIENTATION
        if (to === 0) {
          char.src = assets.right1; // HOME faces right
        } else if (to === 3) {
          char.src = assets.left1; // PROFILE faces left
        } else {
          char.src = goingRight ? assets.right1 : assets.left1;
        }

        prevTab.current = to;
      }, 250);

    }, duration);

    return () => {
      clearInterval(walkInterval.current);
      clearTimeout(timeout);
    };

  }, [currentTab]);

  // 🟢 INITIAL POSITION
  useEffect(() => {
    const char = characterRef.current;
    if (!char) return;

    const setStart = () => {
      char.style.transform = `translateX(${getTabX(0)}px)`;
      char.src = assets.right1;
    };

    if (char.complete) {
      setStart();
    } else {
      char.onload = setStart;
    }
  }, []);

  return (
    <img
      ref={characterRef}
      className="character"
      src={assets.right1}
      alt="character"
    />
  );
}
