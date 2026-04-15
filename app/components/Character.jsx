'use client';

import { useEffect, useRef } from 'react';

const assets = {
  // NAV WALK
  left1: "https://ipfs.io/ipfs/bafkreiheo32ehfntwpmxcars2ta4mq3hqhoheqzsr6ygyuyccbvjwpie7e",
  left2: "https://ipfs.io/ipfs/bafkreifcpvhdaydz64st2ozhwh4ltgzo6dschjd4ehxtmwiqeuphlcfsby",
  right1: "https://ipfs.io/ipfs/bafkreifdy25dy7oywuhwauo2y7jacny3lghk2vficddvbwx2rpy6f4zxqu",
  right2: "https://ipfs.io/ipfs/bafkreic7tlur3ycl2r3zjuuxbghhfihucexc3biucb753j2576ltrogptq",
  flip: "https://ipfs.io/ipfs/bafkreic6iy37nlapsjm2tgvfzb72fkop47lgwwthjaomyg7sl63pp7lcgy",

  // 🧠 WANDER LEFT
  leftWanderStart: "https://ipfs.io/ipfs/bafkreibpxtm3yhlnddcf4r52qzy3fvawyi5zy4ziirbzi7w7wxmpzuocbe",
  leftWander1: "https://ipfs.io/ipfs/bafkreidr7hgt52zfhbyjhr6u5btsm3twfeptg5gheyjourcmahbhkbvg4u",
  leftWander2: "https://ipfs.io/ipfs/bafkreidza6pnuwtpxuo2huoz2zqhbev7nnzypz5yuquxfwm674bmkfi2de",

  // 🧠 WANDER RIGHT
  rightWanderStart: "https://ipfs.io/ipfs/bafkreieqyh3yga2ndghygu75627nel245jq4ejaanszt2awbxdxdvfrive",
  rightWander1: "https://ipfs.io/ipfs/bafybeidgpv2iy5xgga2xkj7rf5qticbtjbsvvyjcnrxszqcttdngtas7rm",
  rightWander2: "https://ipfs.io/ipfs/bafybeibedqqftre75xtlyjse6qrgc3kwvfxckqmkva3opv5s3ocixsiaya"
};

export default function Character({ currentTab, tabsRef }) {
  const characterRef = useRef(null);
  const prevTab = useRef(0);
  const walkInterval = useRef(null);
  const idleTimer = useRef(null);
  const wandering = useRef(false);

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
      rect.left + rect.width / 2 - characterRef.current.offsetWidth / 2;

    return baseX + (offsets[index] || 0);
  }

  // 🧠 IDLE TIMER
  function resetIdleTimer() {
    clearTimeout(idleTimer.current);
    wandering.current = false;

    idleTimer.current = setTimeout(() => {
      startWandering();
    }, 30000);
  }

  // 🎲 WANDER SYSTEM
  function startWandering() {
    const char = characterRef.current;
    if (!char) return;

    wandering.current = true;

    const screenWidth = window.innerWidth;
    const targetX = Math.random() * (screenWidth - 150);
    const currentX = char.getBoundingClientRect().left;

    const goingRight = targetX > currentX;

    // 🎬 START FRAME
    char.src = goingRight
      ? assets.rightWanderStart
      : assets.leftWanderStart;

    setTimeout(() => {
      // 🔁 LOOP FRAMES
      let frame = 0;

      clearInterval(walkInterval.current);
      walkInterval.current = setInterval(() => {
        if (goingRight) {
          char.src =
            frame % 2 === 0
              ? assets.rightWander1
              : assets.rightWander2;
        } else {
          char.src =
            frame % 2 === 0
              ? assets.leftWander1
              : assets.leftWander2;
        }
        frame++;
      }, 200);
    }, 180);

    const distance = Math.abs(targetX - currentX);
    const duration = 1500 + distance * 1.2;

    char.style.transition = `transform ${duration}ms linear`;
    char.style.transform = `translateX(${targetX}px)`;

    setTimeout(() => {
      clearInterval(walkInterval.current);

      // 🔄 FLIP TRANSITION
      char.src = assets.flip;

      setTimeout(() => {
        char.src = goingRight ? assets.right1 : assets.left1;

        if (wandering.current) {
          startWandering(); // 🔁 LOOP wander
        }
      }, 250);
    }, duration);
  }

  // 🚶 TAB NAV (UNCHANGED CORE, JUST CLEANER)
  useEffect(() => {
    const char = characterRef.current;
    if (!char) return;

    const from = prevTab.current;
    const to = currentTab;

    wandering.current = false;
    clearInterval(walkInterval.current);

    if (from === to) {
      resetIdleTimer();
      return;
    }

    const goingRight = to > from;

    let frame = 0;

    walkInterval.current = setInterval(() => {
      char.src = goingRight
        ? frame % 2 === 0 ? assets.right1 : assets.right2
        : frame % 2 === 0 ? assets.left1 : assets.left2;
      frame++;
    }, 160);

    const duration = 800 + Math.abs(to - from) * 300;

    char.style.transition = `transform ${duration}ms linear`;
    char.style.transform = `translateX(${getTabX(to)}px)`;

    const timeout = setTimeout(() => {
      clearInterval(walkInterval.current);

      char.src = assets.flip;

      setTimeout(() => {
        if (to === 0) char.src = assets.right1;
        else if (to === 3) char.src = assets.left1;
        else char.src = goingRight ? assets.right1 : assets.left1;

        prevTab.current = to;
        resetIdleTimer();
      }, 250);
    }, duration);

    return () => {
      clearInterval(walkInterval.current);
      clearTimeout(timeout);
    };
  }, [currentTab]);

  // 🟢 INITIAL
  useEffect(() => {
    const char = characterRef.current;
    if (!char) return;

    const init = () => {
      char.style.transform = `translateX(${getTabX(0)}px)`;
      char.src = assets.right1;
      resetIdleTimer();
    };

    if (char.complete) init();
    else char.onload = init;
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
