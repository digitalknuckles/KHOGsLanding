'use client';

import { useEffect, useRef } from 'react';

const assets = {
  left1: "https://ipfs.io/ipfs/bafkreiheo32ehfntwpmxcars2ta4mq3hqhoheqzsr6ygyuyccbvjwpie7e",
  left2: "https://ipfs.io/ipfs/bafkreifcpvhdaydz64st2ozhwh4ltgzo6dschjd4ehxtmwiqeuphlcfsby",
  right1: "https://ipfs.io/ipfs/bafkreifdy25dy7oywuhwauo2y7jacny3lghk2vficddvbwx2rpy6f4zxqu",
  right2: "https://ipfs.io/ipfs/bafkreic7tlur3ycl2r3zjuuxbghhfihucexc3biucb753j2576ltrogptq",

  flip: "https://ipfs.io/ipfs/bafkreic6iy37nlapsjm2tgvfzb72fkop47lgwwthjaomyg7sl63pp7lcgy",

  leftWanderStart: "https://ipfs.io/ipfs/bafkreibpxtm3yhlnddcf4r52qzy3fvawyi5zy4ziirbzi7w7wxmpzuocbe",
  leftWander1: "https://ipfs.io/ipfs/bafkreidr7hgt52zfhbyjhr6u5btsm3twfeptg5gheyjourcmahbhkbvg4u",
  leftWander2: "https://ipfs.io/ipfs/bafkreidza6pnuwtpxuo2huoz2zqhbev7nnzypz5yuquxfwm674bmkfi2de",

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
  const facing = useRef("right");

  const WORLD_WIDTH = 2560;

  const offsets = {
  0: -180,   // home (strong anchor)
  1: -40,    // game (loose)
  2: 40,     // market
  3: 180     // profile (strong anchor)
};

  const getScale = () =>
    parseFloat(
      getComputedStyle(document.documentElement)
        .getPropertyValue('--scene-scale')
    ) || 1;

  function getTabX(index) {
    const el = tabsRef.current[index];
    const char = ref.current;
    if (!el || !char) return 0;

    const rect = el.getBoundingClientRect();
    const scale = getScale();

    return (rect.left + rect.width / 2) / scale;
  }

  function instantFlip(direction) {
    const char = ref.current;
    if (!char) return;

    facing.current = direction;

    // ⚡ instantaneous flip frame
    char.src = assets.flip;
  }

  function startWalkLoop(frames, speed = 140) {
    const char = ref.current;
    let frame = 0;

    clearInterval(walkInterval.current);

    walkInterval.current = setInterval(() => {
      char.src = frames[frame % 2];
      frame++;
    }, speed);
  }

  function resetIdle() {
    clearTimeout(idleTimer.current);
    wandering.current = false;

    idleTimer.current = setTimeout(startWander, 30000);
  }

  // 🎲 WANDER
  function startWander() {
    const char = ref.current;
    if (!char) return;

    wandering.current = true;

    const charWidth = char.offsetWidth;
    const minX = charWidth / 2;
    const maxX = WORLD_WIDTH - charWidth / 2;

    const targetX = Math.random() * (maxX - minX) + minX;

    const rect = char.getBoundingClientRect();
    const currentX = (rect.left + rect.width / 2) / getScale();

    const goingRight = targetX > currentX;
    const direction = goingRight ? "right" : "left";

    // ⚡ instant flip BEFORE movement
    instantFlip(direction);

    const frames = goingRight
      ? [assets.rightWander1, assets.rightWander2]
      : [assets.leftWander1, assets.leftWander2];

    startWalkLoop(frames, 200);

    const distance = Math.abs(targetX - currentX);
    const duration = 1400 + distance * 1.1;

    char.style.transition = `transform ${duration}ms linear`;
    char.style.transform = `translateX(${targetX}px) translateX(-50%)`;

    setTimeout(() => {
      clearInterval(walkInterval.current);

      // ⚡ immediate redirect (no delay feel)
      if (wandering.current) startWander();
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

  const targetX = getTabX(to);
  
  function getTabX(index) {
  const el = tabsRef.current[index];
  const char = ref.current;
  if (!el || !char) return 0;

  const rect = el.getBoundingClientRect();
  const scale = getScale();

  const worldX = (rect.left + rect.width / 2) / scale;

  // 🎯 apply offset
  return worldX + (offsets[index] || 0);
}

  // ✅ ALWAYS face direction of travel while moving
  const movingRight = to > from;
  const moveDirection = movingRight ? "right" : "left";

  instantFlip(moveDirection);

  const frames =
    moveDirection === "right"
      ? [assets.right1, assets.right2]
      : [assets.left1, assets.left2];

  startWalkLoop(frames, 140);

  const duration = 800 + Math.abs(to - from) * 300;

  char.style.transition = `transform ${duration}ms linear`;
  char.style.transform = `translateX(${targetX}px) translateX(-50%)`;

  const timeout = setTimeout(() => {
    clearInterval(walkInterval.current);

    // 🎯 AFTER ARRIVAL → apply idle facing rules
    let idleDirection;

    if (to === 0) idleDirection = "right";      // HOME
    else if (to === 3) idleDirection = "left";  // PROFILE
    else idleDirection = moveDirection;

    // ⚡ instant flip to idle direction
char.src = assets.flip;
setTimeout(() => {
  char.src = idleDirection === "right"
    ? assets.right1
    : assets.left1;
}, 60); // tiny snap

    // settle frame
    char.src =
      idleDirection === "right"
        ? assets.right1
        : assets.left1;

    prevTab.current = to;
    resetIdle();
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
      const startX = getTabX(0);

      char.style.transform = `translateX(${startX}px) translateX(-50%)`;
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
