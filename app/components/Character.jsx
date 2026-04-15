'use client';
import { useEffect, useRef, useState } from 'react';

const assets = {
  left1: "...",
  left2: "...",
  right1: "...",
  right2: "...",
  flip: "..."
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
