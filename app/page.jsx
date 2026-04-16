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

  // 🔒 SAFE gesture control (DO NOT BLOCK TAPS)
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
      document.removeEventListener('touchmove', preventMultiTouch, { passive: false });
    };
  }, []);

  return (
    <div className="container">

      {/* 🌄 BACKGROUND */}
      <div className="background">
        <picture>
          <source
            media="(min-width: 1400px)"
            srcSet="https://ipfs.io/ipfs/bafybeigxprm4pptl6cg2lysvocw6ocfnv66ygn7evtxjuadqayevzvun2m"
          />
          <source
            media="(min-width: 768px)"
            srcSet="https://ipfs.io/ipfs/bafybeihkhckfk72hi77yrr3sf7leby5agmsq5cpdvel65vw43cb6bx2zb4"
          />
          <source
            media="(min-width: 480px)"
            srcSet="https://ipfs.io/ipfs/bafkreif6hlgr73cqxolmjh2mir4flvpi26apl2mvt53ra4gtav57ewltby"
          />
          <img
            src="https://ipfs.io/ipfs/bafybeih56xgsgacrqmx7mgh5zwd5f72ptngrr4xgrbyl4ghvh54ooomlby"
            alt="background"
          />
        </picture>
      </div>
    
      {/* 🚪 DOOR (correct layer) */}
      <Door onEnter={() => {
        console.log("🚪 ENTER ROOM");
      }} />
      
      {/* 🎮 CHARACTER */}
      <Character currentTab={tab} tabsRef={tabsRef} />

      {/* 🧭 NAV */}
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
  touch-action: manipulation; /* ✅ FIXED */
  overscroll-behavior:none;
  font-family:sans-serif;
}

/* 🎮 CONTAINER */
.container {
  position:relative;
  width:100vw;
  height:100vh;
}

/* 🌄 BACKGROUND */
.background {
  position:absolute;
  inset:0;
  z-index:0;
}

    .legal-toggle {
  margin-top: 2rem;
  background: #1a1a1a;
  border: 1px solid #333;
  border-radius: 12px;
  padding: 1rem;
}

.legal-toggle button {
  background: none;
  color: #00eaff;
  border: none;
  font-size: 0.95rem;
  cursor: pointer;
}

.legal-content {
  display: none;
  margin-top: 1rem;
  font-size: 0.85remf;
  color: #ccc;
}

.background picture,
.background img {
  width:100%;
  height:100%;
  display:block;
}

.background img {
  object-fit:cover;
  transform: scale(1.02);
}

.background::after {
  content:'';
  position:absolute;
  inset:0;
  pointer-events:none;
  background: radial-gradient(circle at center, transparent 60%, rgba(0,0,0,0.5));
}

/* 🎮 CHARACTER */
.character {
  position:absolute;
  bottom:0;
  left:0;
  height:100vh;
  z-index:3;
  pointer-events:none;
}

/* 🧭 NAV */
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
  z-index:10; /* 🔥 BOOSTED */
  flex-wrap:wrap;
}

/* 🔘 TAB */
.tab {
  padding:12px 18px;
  border-radius:12px;
  background:rgba(255,255,255,0.2); /* 🔥 brighter */
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
  z-index:20;
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
  z-index:5;

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
.door {
  position: absolute;

  /* 🎯 POSITION (your tuned values) */
  left: calc(2100 / 2560 * 100vw);
  top: calc(1439 / 1440* 100vh);

  /* 👇 anchor at bottom center (IMPORTANT) */
  transform: translate(-50%, -100%) scale(var(--scale, 2));

  transform-origin: bottom center;

  width: 125px;
  z-index: 3;

  cursor: pointer;
}

/* 🖼 image */
.door img {
  width: 100%;
  height: auto;
  display: block;
  pointer-events: none;
}

/* ✨ hover / open state */
.door.open {
  --scale: 2.2;
  filter: brightness(1.2) drop-shadow(0 0 12px rgba(255,255,255,0.6));
}

/* 💥 press feedback */
.door:active {
  --scale: 2.15;
}

      `}</style>
    </div>
  );
}
