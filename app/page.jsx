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

  // ✅ NEW (non-breaking)
  const [widescreen, setWidescreen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isLandscape, setIsLandscape] = useState(false);

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

  // ✅ DEVICE DETECTION (added only)
  useEffect(() => {
    const detect = () => {
      const mobile = /iPhone|iPad|Android/i.test(navigator.userAgent);
      setIsMobile(mobile);
      setIsLandscape(window.innerWidth > window.innerHeight);
    };

    detect();
    window.addEventListener('resize', detect);
    return () => window.removeEventListener('resize', detect);
  }, []);

  // 🔒 Gesture control (UNCHANGED)
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

  // 🎮 SCALE ENGINE (FIXED VERSION of yours)
  useEffect(() => {
    function updateScale() {
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      let scale;

      // ✅ ONLY allow widescreen on mobile landscape
      if (isMobile && isLandscape && widescreen) {
        scale = Math.min(vw / 2560, vh / 1440);
      } else {
        // ✅ ALWAYS fill width (fixes desktop whitespace)
        scale = vw / 2560;
      }

      document.documentElement.style.setProperty('--scene-scale', scale);

      const scene = document.querySelector('.scene');

      if (scene) {
        scene.style.transform = `
          translate(-50%, -50%) scale(${scale})
        `;
      }
    }

    updateScale();
    window.addEventListener('resize', updateScale);

    return () => {
      window.removeEventListener('resize', updateScale);
    };
  }, [widescreen, isMobile, isLandscape]);

  return (
    <div className="viewport">

      {/* 🌍 SCENE (UNCHANGED STRUCTURE) */}
      <div className="scene-wrapper">
        <div className="scene">

          {/* 🌄 BACKGROUND */}
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
      </div>

      {/* 🧭 NAV (UNCHANGED) */}
      <Navigation
        setTab={setTab}
        tabsRef={tabsRef}
        activeTab={tab}
      />

      {/* 🔗 WALLET (UNCHANGED) */}
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

      {/* ✅ WIDESCREEN BUTTON (MOBILE ONLY) */}
      {isMobile && isLandscape && (
        <button
          className="widescreen-toggle"
          onClick={() => setWidescreen(v => !v)}
        >
          {widescreen ? 'Fill' : 'Wide'}
        </button>
      )}

      {/* 🎠 NFT CARD (UNCHANGED) */}
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
  background:black;
}

/* 🎥 VIEWPORT */
.viewport {
  position:relative;
  width:100vw;
  height:100vh;
  overflow:hidden;
}

/* ✅ WRAPPER (added, non-breaking) */
.scene-wrapper {
  position:absolute;
  inset:0;
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
  transform-origin:top left;
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
  transform: translateX(-50%);
}

/* 🚪 DOOR */
.door {
  position:absolute;
  transform-origin:bottom center;
  z-index:3;
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
  z-index:20;
}

/* ✅ CRITICAL FIX (prevents stacking bug) */
.tabs {
  display:flex;
  flex-wrap:nowrap;
  justify-content:space-between;
  width:100%;
}

/* 🔗 WALLET */
.wallet {
  position:absolute;
  top:20px;
  right:20px;
  z-index:30;
}

/* 🎥 TOGGLE */
.widescreen-toggle {
  position:absolute;
  bottom:20px;
  right:20px;
  z-index:30;
}

      `}</style>
    </div>
  );
}
