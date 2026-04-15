'use client';

import { useEffect, useRef } from 'react';

const assets = {
  // NAV
  left1: "https://ipfs.io/ipfs/bafkreiheo32ehfntwpmxcars2ta4mq3hqhoheqzsr6ygyuyccbvjwpie7e",
  left2: "https://ipfs.io/ipfs/bafkreifcpvhdaydz64st2ozhwh4ltgzo6dschjd4ehxtmwiqeuphlcfsby",
  right1: "https://ipfs.io/ipfs/bafkreifdy25dy7oywuhwauo2y7jacny3lghk2vficddvbwx2rpy6f4zxqu",
  right2: "https://ipfs.io/ipfs/bafkreic7tlur3ycl2r3zjuuxbghhfihucexc3biucb753j2576ltrogptq",
  flip: "https://ipfs.io/ipfs/bafkreic6iy37nlapsjm2tgvfzb72fkop47lgwwthjaomyg7sl63pp7lcgy",

  // 🧠 WANDER LEFT
  leftStart: "https://ipfs.io/ipfs/bafkreibpxtm3yhlnddcf4r52qzy3fvawyi5zy4ziirbzi7w7wxmpzuocbe",
  left1w: "https://ipfs.io/ipfs/bafkreidr7hgt52zfhbyjhr6u5btsm3twfeptg5gheyjourcmahbhkbvg4u",
  left2w: "https://ipfs.io/ipfs/bafkreidza6pnuwtpxuo2huoz2zqhbev7nnzypz5yuquxfwm674bmkfi2de",

  // 🧠 WANDER RIGHT
  rightStart: "https://ipfs.io/ipfs/bafkreieqyh3yga2ndghygu75627nel245jq4ejaanszt2awbxdxdvfrive",
  right1w: "https://ipfs.io/ipfs/bafybeidgpv2iy5xgga2xkj7rf5qticbtjbsvvyjcnrxszqcttdngtas7rm",
  right2w: "https://ipfs.io/ipfs/bafybeibedqqftre75xtlyjse6qrgc3kwvfxckqmkva3opv5s3ocixsiaya"
};

export default function Character({ currentTab, tabsRef }) {
  const ref = useRef(null);
  const prevTab = useRef(0);
  const walkLoop = useRef(null);
  const idleTimer = useRef(null);
  const wandering = useRef(false);
  const hasStartedWander = useRef(false);

  const offsets = { 0: -120, 3: 120 };

  function getTabX(i) {
    const el = tabsRef.current[i];
    if (!el || !ref.current) return 0;
    const rect = el.getBoundingClientRect();
    return rect.left + rect.width / 2 - ref.current.offsetWidth / 2 + (offsets[i] || 0);
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

    const screenW = window.innerWidth;
    const currentX = char.getBoundingClientRect().left;
    const targetX = Math.random() * (screenW - 150);

    const goingRight = targetX > currentX;

    // 🎬 choose correct animation set
    const startSprite = goingRight ? assets.rightStart : assets.leftStart;
    const frames = goingRight
      ? [assets.right1w, assets.right2w]
      : [assets.left1w, assets.left2w];

    let frame = 0;

    clearInterval(walkLoop.current);

    // 🟡 START FRAME (only once per wander trigger)
    if (!hasStartedWander.current) {
      char.src = startSprite;
      hasStartedWander.current = true;
    }

    // 🟢 START LOOP AFTER SHORT DELAY
    setTimeout(() => {
      walkLoop.current = setInterval(() => {
        char.src = frames[frame % 2];
        frame++;
      }, 200);
    }, 250);

    const dist = Math.abs(targetX - currentX);
    const duration = 1400 + dist * 1.2;

    char.style.transition = `transform ${duration}ms linear`;
    char.style.transform = `translateX(${targetX}px)`;

    setTimeout(() => {
      clearInterval(walkLoop.current);

      // ⚡ QUICK FLIP (0.5s feel)
      char.src = assets.flip;

      setTimeout(() => {
        char.src = goingRight ? assets.right1 : assets.left1;

        if (wandering.current) {
          startWander(); // 🔁 continue wandering
        }
      }, 500);
    }, duration);
  }

  // 🚶 NAV LOGIC (UNCHANGED CORE BUT CLEAN RESET)
  useEffect(() => {
    const char = ref.current;
    if (!char) return;

    const from = prevTab.current;
    const to = currentTab;

    wandering.current = false;
    hasStartedWander.current = false;
    clearInterval(walkLoop.current);

    if (from === to) {
      resetIdle();
      return;
    }

    const goingRight = to > from;
    const frames = goingRight
      ? [assets.right1, assets.right2]
      : [assets.left1, assets.left2];

    let frame = 0;

    walkLoop.current = setInterval(() => {
      char.src = frames[frame % 2];
      frame++;
    }, 160);

    const duration = 800 + Math.abs(to - from) * 300;

    char.style.transition = `transform ${duration}ms linear`;
    char.style.transform = `translateX(${getTabX(to)}px)`;

    const t = setTimeout(() => {
      clearInterval(walkLoop.current);

      char.src = assets.flip;

      setTimeout(() => {
        if (to === 0) char.src = assets.right1;
        else if (to === 3) char.src = assets.left1;
        else char.src = goingRight ? assets.right1 : assets.left1;

        prevTab.current = to;
        resetIdle();
      }, 250);
    }, duration);

    return () => {
      clearInterval(walkLoop.current);
      clearTimeout(t);
    };
  }, [currentTab]);

  // 🟢 INIT
  useEffect(() => {
    const char = ref.current;
    if (!char) return;

    const init = () => {
      char.style.transform = `translateX(${getTabX(0)}px)`;
      char.src = assets.right1;
      resetIdle();
    };

    char.complete ? init() : (char.onload = init);
  }, []);

  return <img ref={ref} className="character" src={assets.right1} />;
}
