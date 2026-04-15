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
    const rect = tab.getBoundingClientRect();
    return rect.left + rect.width / 2 - characterRef.current.offsetWidth / 2;
  }

  useEffect(() => {
    if (!characterRef.current || !tabsRef.current) return;

    if (currentTab === currentIndex) return;

    const goingRight = currentTab > currentIndex;
    const frames = goingRight
      ? [assets.right1, assets.right2]
      : [assets.left1, assets.left2];

    let frame = 0;
    let running = true;

    function loop() {
      if (!running) return;
      setSprite(frames[frame % 2]);
      frame++;
      setTimeout(() => requestAnimationFrame(loop), 120);
    }

    loop();

    const targetX = getTabX(currentTab);

    characterRef.current.style.transition = "transform 1.2s linear";
    characterRef.current.style.transform = `translateX(${targetX}px)`;

    setTimeout(() => {
      running = false;

      // 🔥 FLIP RESTORED
      setSprite(assets.flip);

      setTimeout(() => {
        if (currentTab === 0) setSprite(assets.left1);
        else if (currentTab === 3) setSprite(assets.left1);
        else setSprite(assets.right1);

        setCurrentIndex(currentTab);
      }, 250);

    }, 1200);

  }, [currentTab]);

  return (
    <img
      ref={characterRef}
      src={sprite}
      className="character"
    />
  );
}
