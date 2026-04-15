'use client';

import { useEffect, useRef } from 'react';

const assets = {
  // NAV WALK
  left1: "https://ipfs.io/ipfs/bafkreiheo32ehfntwpmxcars2ta4mq3hqhoheqzsr6ygyuyccbvjwpie7e",
  left2: "https://ipfs.io/ipfs/bafkreifcpvhdaydz64st2ozhwh4ltgzo6dschjd4ehxtmwiqeuphlcfsby",
  right1: "https://ipfs.io/ipfs/bafkreifdy25dy7oywuhwauo2y7jacny3lghk2vficddvbwx2rpy6f4zxqu",
  right2: "https://ipfs.io/ipfs/bafkreic7tlur3ycl2r3zjuuxbghhfihucexc3biucb753j2576ltrogptq",

  // FLIP
  flip: "https://ipfs.io/ipfs/bafkreic6iy37nlapsjm2tgvfzb72fkop47lgwwthjaomyg7sl63pp7lcgy",

  // WANDER LEFT
  leftWanderStart: "https://ipfs.io/ipfs/bafkreibpxtm3yhlnddcf4r52qzy3fvawyi5zy4ziirbzi7w7wxmpzuocbe",
  leftWander1: "https://ipfs.io/ipfs/bafkreidr7hgt52zfhbyjhr6u5btsm3twfeptg5gheyjourcmahbhkbvg4u",
  leftWander2: "https://ipfs.io/ipfs/bafkreidza6pnuwtpxuo2huoz2zqhbev7nnzypz5yuquxfwm674bmkfi2de",

  // WANDER RIGHT
  rightWanderStart: "https://ipfs.io/ipfs/bafkreieqyh3yga2ndghygu75627nel245jq4ejaanszt2awbxdxdvfrive",
  rightWander1: "https://ipfs.io/ipfs/bafybeidgpv2iy5xgga2xkj7rf5qticbtjbsvvyjcnrxszqcttdngtas7rm",
  rightWander2: "https://ipfs.io/ipfs/bafybeibedqqftre75xtlyjse6qrgc3kwvfxckqmkva3opv5s3ocixsiaya"
};

export default function Character({ currentTab, tabsRef }) {
  const ref = useRef(null);
  const prevTab = useRef(0);
  const walkInterval = useRef(null);
  const idleTimer = useRef(null);
  const wandering = useRef(false);
  const hasStartedWander = useRef(false);
  const facing = useRef("right"); // track orientation

  const offsets = { 0: -120, 3: 120 };

  function getTabX(index) {
    const el = tabsRef.current[index];
    if (!el || !ref.current) return 0;

    const rect = el.getBoundingClientRect();
    const base =
      rect.left +
      rect.width / 2 -
      ref.current.offsetWidth / 2;

    return base + (offsets[index] || 0);
  }

  function resetIdle() {
    clearTimeout(idleTimer.current);
    wandering.current = false;
    hasStartedWander.current = false;

    idleTimer.current = setTimeout(startWander, 30000);
  }

  // 🎲 WANDER SYSTEM
  function startWander() {
    const char = ref.current;
    if (!char) return;

    wandering.current = true;

    const screenWidth = window.innerWidth;
    const targetX = Math.random() * (screenWidth - 150);
    const currentX = char.getBoundingClientRect().left;

    const goingRight = targetX > currentX;
    facing.current = goingRight ? "right" : "left";

    // 🎬 START ANIMATION (ONLY ONCE)
    if (!hasStartedWander.current) {
      char.src = goingRight
        ? assets.rightWanderStart
        : assets.leftWanderStart;

      hasStartedWander.current = true;
    }

    // 🎞 LOOP FRAMES
    const frames = goingRight
      ? [assets.rightWander1, assets.rightWander2]
      : [assets.leftWander1, assets.leftWander2];

    let frame = 0;

    clearInterval(walkInterval.current);
    walkInterval.current = setInterval(() => {
      char.src = frames[frame % 2];
      frame++;
    }, 200);

    const distance = Math.abs(targetX - currentX);
    const duration = 1400 + distance * 1.1;

    char.style.transition = `transform ${duration}ms linear`;
    char.style.transform = `translateX(${targetX}px)`;

    setTimeout(() => {
      clearInterval(walkInterval.current);

      // 🔄 FLIP BETWEEN SEGMENTS
      char.src = assets.flip;

      setTimeout(() => {
        if (wandering.current) startWander();
      }, 120);

    }, duration);
  }

  // 🚶 TAB NAV
  useEffect(() => {
    const char = ref.current;
    if (!char) return;

    const from = prevTab.current;
    const to = currentTab;

    wandering.current = false;
    clearInterval(walkInterval.current);

    if (from === to) {
      resetIdle();
      return;
    }

    const goingRight = to > from;
    facing.current = goingRight ? "right" : "left";

    const frames = goingRight
      ? [assets.right1, assets.right2]
      : [assets.left1, assets.left2];

    let frame = 0;

    walkInterval.current = setInterval(() => {
      char.src = frames[frame % 2];
      frame++;
    }, 140);

    const duration = 800 + Math.abs(to - from) * 300;

    char.style.transition = `transform ${duration}ms linear`;
    char.style.transform = `translateX(${getTabX(to)}px)`;

    const timeout = setTimeout(() => {
      clearInterval(walkInterval.current);

      char.src = assets.flip;

      setTimeout(() => {
        if (to === 0) {
          char.src = assets.right1;
          facing.current = "right";
        } else if (to === 3) {
          char.src = assets.left1;
          facing.current = "left";
        } else {
          char.src = goingRight ? assets.right1 : assets.left1;
        }

        prevTab.current = to;
        resetIdle();
      }, 120);

    }, duration);

    return () => {
      clearInterval(walkInterval.current);
      clearTimeout(timeout);
    };
  }, [currentTab]);

  // 🟢 INIT
  useEffect(() => {
    const char = ref.current;
    if (!char) return;

    const start = () => {
      char.style.transform = `translateX(${getTabX(0)}px)`;
      char.src = assets.right1;
      facing.current = "right";
      resetIdle();
    };

    if (char.complete) start();
    else char.onload = start;
  }, []);

  return (
    <img
      ref={ref}
      className="character"
      src={assets.right1}
      alt="character"
    />
  );
}
