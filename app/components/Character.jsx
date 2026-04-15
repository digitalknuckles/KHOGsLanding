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
  const idleTimer = useRef(null);
  const wandering = useRef(false);

  // 🎯 OFFSET SYSTEM
  const offsets = {
    0: -120,
    1: 0,
    2: 0,
    3: 120
  };

  function getTabX(index) {
    const el = tabsRef.current[index];
    if (!el || !characterRef.current) return 0;

    const rect = el.getBoundingClientRect();
    const baseX =
      rect.left +
      rect.width / 2 -
      characterRef.current.offsetWidth / 2;

    return baseX + (offsets[index] || 0);
  }

  // 🧠 RESET IDLE TIMER
  function resetIdleTimer() {
    clearTimeout(idleTimer.current);
    wandering.current = false;

    idleTimer.current = setTimeout(() => {
      startWandering();
    }, 30000); // ⏱️ 30s idle
  }

  // 🎲 RANDOM WANDER
  function startWandering() {
    const char = characterRef.current;
    if (!char) return;

    wandering.current = true;

    const screenWidth = window.innerWidth;
    const randomX = Math.random() * (screenWidth - 150);

    const currentX =
      char.getBoundingClientRect().left;

    const goingRight = randomX > currentX;

    const walkFrames = goingRight
      ? [assets.right1, assets.right2]
      : [assets.left1, assets.left2];

    let frame = 0;

    clearInterval(walkInterval.current);
    walkInterval.current = setInterval(() => {
      char.src = walkFrames[frame % 2];
      frame++;
    }, 180);

    const distance = Math.abs(randomX - currentX);
    const duration = 1500 + distance * 1.2;

    char.style.transition = `transform ${duration}ms linear`;
    char.style.transform = `translateX(${randomX}px)`;

    setTimeout(() => {
      clearInterval(walkInterval.current);

      char.src = assets.flip;

      setTimeout(() => {
        char.src = goingRight ? assets.right1 : assets.left1;
        if (wandering.current) {
          // 🔁 continue wandering loop
          startWandering();
        }
      }, 250);
    }, duration);
  }

  // 🚶 TAB NAVIGATION
  useEffect(() => {
    const char = characterRef.current;
    if (!char) return;

    const from = prevTab.current;
    const to = currentTab;

    // 🛑 stop wandering immediately
    wandering.current = false;
    clearInterval(walkInterval.current);

    if (from === to) {
      resetIdleTimer();
      return;
    }

    const goingRight = to > from;

    const walkFrames = goingRight
      ? [assets.right1, assets.right2]
      : [assets.left1, assets.left2];

    let frame = 0;

    walkInterval.current = setInterval(() => {
      char.src = walkFrames[frame % 2];
      frame++;
    }, 160); // ⚡ slightly faster animation

    const distance = Math.abs(to - from);

    // ⚡ faster movement than before
    const duration = 800 + distance * 300;

    char.style.transition = `transform ${duration}ms linear`;
    char.style.transform = `translateX(${getTabX(to)}px)`;

    const timeout = setTimeout(() => {
      clearInterval(walkInterval.current);

      char.src = assets.flip;

      setTimeout(() => {
        if (to === 0) {
          char.src = assets.right1;
        } else if (to === 3) {
          char.src = assets.left1;
        } else {
          char.src = goingRight ? assets.right1 : assets.left1;
        }

        prevTab.current = to;

        resetIdleTimer(); // 🧠 restart idle timer
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
      resetIdleTimer();
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
