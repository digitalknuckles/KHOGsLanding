'use client';
import { useEffect, useRef, useState } from 'react';

const assets = {
  left1: "https://ipfs.io/ipfs/bafkreiheo32ehfntwpmxcars2ta4mq3hqhoheqzsr6ygyuyccbvjwpie7e",
  left2: "https://ipfs.io/ipfs/bafkreifcpvhdaydz64st2ozhwh4ltgzo6dschjd4ehxtmwiqeuphlcfsby",
  right1: "https://ipfs.io/ipfs/bafkreifdy25dy7oywuhwauo2y7jacny3lghk2vficddvbwx2rpy6f4zxqu",
  right2: "https://ipfs.io/ipfs/bafkreic7tlur3ycl2r3zjuuxbghhfihucexc3biucb753j2576ltrogptq",
  flip: "https://ipfs.io/ipfs/bafkreic6iy37nlapsjm2tgvfzb72fkop47lgwwthjaomyg7sl63pp7lcgy"
};

export default function Character({ currentTab, tabsRef }) {
  const characterRef = useRef(null);
  const [sprite, setSprite] = useState(assets.right1);
  const [currentIndex, setCurrentIndex] = useState(0);

function getTabX(index) {
  const tab = tabsRef.current[index];
  if (!tab || !characterRef.current) return 0;

  const rect = tab.getBoundingClientRect();

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
    if (!tabsRef?.current?.length) return;
    if (currentTab === currentIndex) return;

    const goingRight = currentTab > currentIndex;

    const walkFrames = goingRight
      ? [assets.right1, assets.right2]
      : [assets.left1, assets.left2];

    let frame = 0;
    let running = true;

    function walkLoop() {
      if (!running) return;
      setSprite(walkFrames[frame % 2]);
      frame++;
      setTimeout(() => requestAnimationFrame(walkLoop), 120);
    }

    walkLoop();

    const targetX = getTabX(currentTab);
    const duration = 1200;

    characterRef.current.style.transition = `transform ${duration}ms cubic-bezier(0.22,1,0.36,1)`;
    characterRef.current.style.transform = `translateX(${targetX}px)`;

    setTimeout(() => {
      running = false;

      // 🎯 DETERMINE FINAL ORIENTATION
      let finalDirection;

      if (currentTab === 0) finalDirection = 'right';     // HOME
      else if (currentTab === 3) finalDirection = 'left'; // PROFILE
      else finalDirection = goingRight ? 'right' : 'left';

      const currentFacing = sprite.includes('right') ? 'right' : 'left';

      // 🔥 Only flip if needed
      if (currentFacing !== finalDirection) {
        setSprite(assets.flip);

        setTimeout(() => {
          setSprite(finalDirection === 'right' ? assets.right1 : assets.left1);
          setCurrentIndex(currentTab);
        }, 250);
      } else {
        setSprite(finalDirection === 'right' ? assets.right1 : assets.left1);
        setCurrentIndex(currentTab);
      }

    }, duration);

  }, [currentTab]);

  return (
    <img
      ref={characterRef}
      src={sprite}
      className="character"
    />
  );
}
