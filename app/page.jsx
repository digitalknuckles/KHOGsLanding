'use client';

import { useState, useEffect, useRef } from 'react';
import Door from './components/Door';
import Character from './components/Character';
import Navigation from './components/Navigation';
import NFTCard from './components/NFTCard';
import { connectWallet, reconnectWallet, handleMobileWalletRedirect } from './lib/wallet';
import { fetchNFTs } from './lib/opensea';
import NPCManager from './components/NPCManager';

export default function Page() {
  const tabsRef = useRef([]);
  const [tab, setTab] = useState(0);
  const [wallet, setWallet] = useState(null);
  const [nfts, setNfts] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const [isMobile, setIsMobile] = useState(false);

useEffect(() => {
  const update = () => setIsMobile(window.innerWidth < 900);

  update();
  window.addEventListener('resize', update);

  return () => window.removeEventListener('resize', update);
}, []);
  
  const [showDoorModal, setShowDoorModal] = useState(false);

  // 🎥 VIEW MODE
  const [widescreen, setWidescreen] = useState(false);

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

  // 🎮 SCALE ENGINE (FULL + CORRECT)
useEffect(() => {
  function updateScale() {
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    const mobile = vw < 900;

    let scale;

    if (mobile && widescreen) {
      // 📱 WIDESCREEN (letterbox)
      scale = Math.min(vw / 2560, vh / 1440);
    } else {
      // 🖥 DESKTOP + MOBILE DEFAULT
      scale = vw / 2560;
    }

    document.documentElement.style.setProperty('--scene-scale', scale);
  }

  updateScale();
  window.addEventListener('resize', updateScale);
  return () => window.removeEventListener('resize', updateScale);
}, [widescreen]);

  // 🔒 Gesture control
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

  return (
    <div className="viewport">

      {/* 🎬 WRAPPER */}
      <div className="scene-wrapper">
        <div className="scene">

          {/* 🌄 BACKGROUND */}
          <img
            className="bg"
            src="https://ipfs.io/ipfs/bafybeih56xgsgacrqmx7mgh5zwd5f72ptngrr4xgrbyl4ghvh54ooomlby"
            alt="background"
          />

          {/* 🚪 DOOR */}
          {/*<Door onEnter={() => console.log("🚪 ENTER ROOM")} />*/}
          <Door onEnter={() => setShowDoorModal(true)} />
          <NPCManager />
          {/* 🎮 CHARACTER */}
          <Character currentTab={tab} tabsRef={tabsRef} />

        </div>
      </div>

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
          if (!redirected) connectWallet(setWallet);
        }}
      >
        {wallet
          ? wallet.slice(0, 6) + '...' + wallet.slice(-4)
          : 'Connect Wallet'}
      </button>

      {/* 🎥 TOGGLE */}
{isMobile && (
  <button
    className="widescreen-toggle"
    onClick={() => setWidescreen(v => !v)}
  >
    {widescreen ? 'Auto View' : 'Widescreen'}
  </button>
)}

      {/* 🎠 NFT CARD */}
      {tab === 3 && nfts.length > 0 && (
        <NFTCard
          nfts={nfts}
          activeIndex={activeIndex}
          setActiveIndex={setActiveIndex}
        />
      )}

{showDoorModal && (
  <div className="modal-overlay" onClick={() => setShowDoorModal(false)}>
    <div className="modal" onClick={(e) => e.stopPropagation()}>
      
      <div className="modal-text">
        "Hold On, Knucklehead — We're Closed For Renovations!
        <br />
        Come back later..."
      </div>

      <div className="modal-sub">
        Visit OpenSea Market
      </div>

      <a
        href="https://opensea.io/collection/knuckleheadogs"
        target="_blank"
        rel="noopener noreferrer"
        className="modal-btn"
      >
        KHOGs Collection
      </a>

    </div>
  </div>
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
  background:black;
}

/* 🎥 VIEWPORT */
.viewport {
  position:relative;
  width:100vw;
  height:100vh;
  overflow:hidden;
}

/* 🎬 WRAPPER */
.scene-wrapper {
  position:absolute;
  inset:0;

  display:flex;
  justify-content:center;
  align-items:center;

  overflow:hidden;
  background:black;
}

/* 🌍 SCENE */
.scene {
  position:absolute;
  width:2560px;
  height:1440px;

  left:50%;
  top:50%;

  transform: translate(-50%, -50%) scale(var(--scene-scale));

  transform-origin: center center; /* 🔥 FIX */
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
  transform:translateX(0) translateX(-50%);
  transform-origin:bottom center;
  z-index:5;
  pointer-events:none;
}

/* 🚪 DOOR */
.door {
  position:absolute;
  transform-origin:bottom center;
  z-index:1;
  cursor:pointer;
  transition: transform 0.1s ease, filter 0.1s ease;
}

.door img {
  width:140px;
  height:auto;
  display:block;
  pointer-events:none;
}

.door.open img {
  transform: scale(3.35);
  filter: brightness(1.2) drop-shadow(0 0 12px rgba(255,255,255,0.6));
}

.door.pressed img {
  transform: scale(3.30);
}

/* 🧭 NAV */
.nav {
  position:absolute;
  top:0;
  width:100%;
  height:90px;
  display:flex;
  justify-content:center;
  align-items:center;
  z-index:20;
}

/* 🔥 CRITICAL FIX: NEVER STACK */
.tabs {
  display:flex;
  flex-wrap:nowrap;
  justify-content:space-between;
  width:100%;
  max-width:640px;
  padding:0 12px;
}

.tab {
  flex:1;
  text-align:center;
  padding:10px;
  border-radius:12px;
  margin:0 4px;

  background:rgba(255,255,255,0.2);
  backdrop-filter:blur(12px);

  transition: all 0.15s ease;
}

.tab.active {
  background:rgba(255,255,255,0.5);
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

/* 🎥 TOGGLE */
.widescreen-toggle {
  position:absolute;
  bottom:20px;
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
}
/* 🔥 MODAL OVERLAY */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.75);
  backdrop-filter: blur(8px);

  display: flex;
  justify-content: center;
  align-items: center;

  z-index: 100;

  animation: fadeIn 0.25s ease;
}

/* 📦 MODAL BOX */
.modal {
  width: min(420px, 90vw);
  padding: 24px;

  border-radius: 18px;

  background: rgba(0,0,0,0.85);
  color: white;

  text-align: center;

  box-shadow: 0 20px 60px rgba(0,0,0,0.6);

  animation: popIn 0.25s ease;
}

/* ⚠️ MAIN TEXT (URGENT) */
.modal-text {
  font-size: 16px;
  font-weight: 600;
  line-height: 1.4;

  margin-bottom: 16px;

  animation: pulseText 1.2s infinite;
}

/* 🧾 SUBTEXT */
.modal-sub {
  font-size: 12px;
  opacity: 0.7;
  margin-bottom: 12px;
}

/* 🔘 BUTTON */
.modal-btn {
  display: inline-block;

  padding: 12px 18px;
  border-radius: 12px;

  background: white;
  color: black;

  font-weight: 600;
  text-decoration: none;

  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.modal-btn:active {
  transform: scale(0.92);
}

/* ✨ ANIMATIONS */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes popIn {
  from {
    transform: scale(0.9) translateY(20px);
    opacity: 0;
  }
  to {
    transform: scale(1) translateY(0);
    opacity: 1;
  }
}

/* 🚨 PULSE EFFECT */
@keyframes pulseText {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}
.npc {
  transform-origin: bottom center;
  will-change: transform;
}

/* 🪄 fake walking bounce */
@keyframes npcBounce {
  0%, 100% {
    transform: translateY(0) scale(var(--npc-scale, 1));
  }
  50% {
    transform: translateY(-6px) scale(var(--npc-scale, 1));
  }
}
.npc-bounce {
  animation: npcBounce 0.4s infinite cubic-bezier(0.4, 0, 0.2, 1);
}

/* 🔥 stronger + snappier bounce */
@keyframes npcBounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}
      `}</style>
    </div>
  );
}
