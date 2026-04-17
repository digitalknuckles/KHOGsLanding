'use client';

import { useState, useEffect, useRef } from 'react';
import Door from './components/Door';
import Character from './components/Character';
import Navigation from './components/Navigation';
import NFTCard from './components/NFTCard';
import { connectWallet, reconnectWallet, handleMobileWalletRedirect } from './lib/wallet';
import { fetchNFTs } from './lib/opensea';

export default function Page() {
  const tabsRef = useRef([]);
  const [tab, setTab] = useState(0);
  const [wallet, setWallet] = useState(null);
  const [nfts, setNfts] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);

  // 🔌 Auto reconnect wallet
  useEffect(() => {
    reconnectWallet(setWallet);
  }, []);

  // 🎯 NFT FETCH
  useEffect(() => {
    if (tab === 3 && wallet && nfts.length === 0) {
      fetchNFTs(wallet).then((data) => {
        setNfts(data || []);
        setActiveIndex(0);
      });
    }
  }, [tab, wallet]);

  // 🔒 Gesture control (safe)
  useEffect(() => {
    const preventZoom = (e) => {
      if (e.scale !== 1) e.preventDefault();
    };

    const preventMultiTouch = (e) => {
      if (e.touches.length > 1) e.preventDefault();
    };

    document.addEventListener('gesturestart', preventZoom);
    document.addEventListener('gesturechange', preventZoom);
    document.addEventListener('touchmove', preventMultiTouch, { passive: false });

    return () => {
      document.removeEventListener('gesturestart', preventZoom);
      document.removeEventListener('gesturechange', preventZoom);
      document.removeEventListener('touchmove', preventMultiTouch);
    };
  }, []);

  // 🎮 SCENE SCALE ENGINE (2560x1440 world)
  useEffect(() => {
    const updateScale = () => {
      const scale = Math.min(
        window.innerWidth / 2560,
        window.innerHeight / 1440
      );
      document.documentElement.style.setProperty('--scene-scale', scale);
    };

    updateScale();
    window.addEventListener('resize', updateScale);

    return () => window.removeEventListener('resize', updateScale);
  }, []);

  return (
    <div className="viewport">

      {/* 🌍 SCENE (WORLD SPACE) */}
      <div className="scene">

        {/* 🌄 BACKGROUND (FIXED WORLD) */}
        <img
          className="bg"
          src="https://ipfs.io/ipfs/bafybeih56xgsgacrqmx7mgh5zwd5f72ptngrr4xgrbyl4ghvh54ooomlby"
          alt="background"
        />

        {/* 🚪 DOOR */}
        <Door
          onEnter={() => {
            console.log("🚪 ENTER ROOM");
          }}
        />

        {/* 🎮 CHARACTER */}
        <Character currentTab={tab} tabsRef={tabsRef} />

      </div>

      {/* 🧭 UI LAYER (SCREEN SPACE) */}
      <Navigation
        setTab={setTab}
        tabsRef={tabsRef}
        activeTab={tab}
      />

      {/* 🔗 WALLET */}
      <button
        className="wallet"
        onClick={() => {
          const redirected = handleMobileWalletRedirect();
          if (!redirected) {
            connectWallet(setWallet);
          }
        }}
      >
        {wallet
          ? wallet.slice(0, 6) + '...' + wallet.slice(-4)
          : 'Connect Wallet'}
      </button>

      {/* 🎠 NFT CARD */}
      {tab === 3 && nfts.length > 0 && (
        <NFTCard
          nfts={nfts}
          activeIndex={activeIndex}
          setActiveIndex={setActiveIndex}
        />
      )}

      <style jsx global>{`

/* 🔒 GLOBAL */
html, body {
  margin:0;
  padding:0;
  overflow:hidden;
  touch-action: manipulation;
  overscroll-behavior:none;
  font-family:sans-serif;
}

/* 🎥 VIEWPORT */
.viewport {
  position:relative;
  width:100vw;
  height:100vh;
  overflow:hidden;
}

/* 🌍 SCENE (2560x1440 WORLD) */
.scene {
  position:absolute;
  top:50%;
  left:50%;

  width:2560px;
  height:1440px;

  transform: translate(-50%, -50%) scale(var(--scene-scale));
  transform-origin:center;

  will-change: transform;
}

/* 🌄 BACKGROUND */
.bg {
  position:absolute;
  inset:0;
  width:100%;
  height:100%;
  object-fit:cover;
}

/* 🎮 CHARACTER */
.character {
  position:absolute;
  bottom:0;
  left:0;
  height:100%;
  z-index:3;
  pointer-events:none;
}

/* 🚪 DOOR (WORLD POSITIONED) */
.door {
  position:absolute;
  
  transform-origin: bottom center;

  z-index:3;

  cursor:pointer;

  transition: transform 0.1s ease, filter 0.1s ease;
}

.door img {
  width: 140px;
  height: auto;
  display: block;
  pointer-events: none;
  transition: transform 0.01s ease, filter 0.01s ease;
}

/* 🚪 OPEN STATE */
.door.open img {
  transform: scale(3.35);
  filter: brightness(1.2) drop-shadow(0 0 12px rgba(255,255,255,0.6));
}

/* 💥 PRESS FEEDBACK */
.door.pressed img {
  transform: scale(3.30);
}

/* 🧭 NAV (UI SPACE) */
.nav {
  position:absolute;
  top:0;
  width:100%;
  height:100px;
  display:flex;
  justify-content:center;
  align-items:center;
  gap:12px;
  padding:10px;
  z-index:20;
  flex-wrap:wrap;
}

.tab {
  padding:12px 18px;
  border-radius:12px;
  background:rgba(255,255,255,0.2);
  backdrop-filter:blur(12px);
  cursor:pointer;
  transition: all 0.15s ease;
  box-shadow: 0 4px 10px rgba(0,0,0,0.4);
}

.tab:active {
  transform: scale(0.92);
}

.tab.active {
  background:rgba(255,255,255,0.5);
  transform: scale(1.05);
}

/* 🔗 WALLET */
.wallet {
  position:absolute;
  top:20px;
  right:20px;
  z-index:30;
  padding:10px 14px;
  border-radius:10px;
  background:rgba(0,0,0,0.7);
  color:white;
}

/* 🎠 CARD */
.card {
  position:absolute;
  bottom:120px;
  left:20px;
  width:260px;
  max-width:80vw;
  padding:16px;
  border-radius:16px;
  background:rgba(0,0,0,0.75);
  color:white;
  z-index:25;

  display:flex;
  flex-direction:column;
  gap:10px;

  backdrop-filter: blur(12px);
  box-shadow: 0 10px 30px rgba(0,0,0,0.4);
}

/* 🖼 NFT IMAGE */
.nft-img {
  width:100%;
  border-radius:10px;
  object-fit:cover;
}

/* 🧬 TRAITS */
.traits {
  max-height:150px;
  overflow-y:auto;
  display:flex;
  flex-direction:column;
  gap:6px;
  animation: fadeIn 0.25s ease;
}

.trait {
  display:flex;
  justify-content:space-between;
  font-size:12px;
}

/* 🎠 DOTS */
.dots {
  display:flex;
  justify-content:center;
  gap:6px;
}

.dot {
  width:6px;
  height:6px;
  border-radius:50%;
  background:rgba(255,255,255,0.3);
}

.dot.active {
  background:white;
}

@keyframes fadeIn {
  from { opacity:0; transform:translateY(10px); }
  to { opacity:1; transform:translateY(0); }
}

      `}</style>
    </div>
  );
}
