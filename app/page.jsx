'use client';

import { useState, useEffect, useRef } from 'react';
import Character from './components/Character';
import Navigation from './components/Navigation';
import NFTCard from './components/NFTCard';
import { connectWallet } from './lib/wallet';
import { fetchNFTs } from './lib/opensea';


export default function Page() {
  const tabsRef = useRef([]);
  const stageRef = useRef(null);

  const [tab, setTab] = useState(0);
  const [wallet, setWallet] = useState(null);
  const [nfts, setNfts] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);

  // ✅ Detect screen size
  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth > 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // ✅ Fetch NFTs
  useEffect(() => {
    if (tab === 3 && wallet) {
      fetchNFTs(wallet).then(setNfts);
    }
  }, [tab, wallet]);

  // ✅ SCALE STAGE
  useEffect(() => {
    function scaleStage() {
      const baseWidth = 315;
      const baseHeight = 1084;

      const scale = Math.min(
        window.innerWidth / baseWidth,
        window.innerHeight / baseHeight
      );

      if (stageRef.current) {
        stageRef.current.style.transform = `scale(${scale})`;
      }
    }

    scaleStage();
    window.addEventListener('resize', scaleStage);

    return () => window.removeEventListener('resize', scaleStage);
  }, []);

  return (
    <div className="viewport">
      <div ref={stageRef} className="stage">
        {/* BACKGROUND */}
        <img
          src={
            isDesktop
              ? "/desktop-bg.png"
              : "https://ipfs.io/ipfs/bafybeihkhckfk72hi77yrr3sf7leby5agmsq5cpdvel65vw43cb6bx2zb4"
          }
          className="background"
        />

        {/* CHARACTER + UI */}
        <Character currentTab={tab} tabsRef={tabsRef} />
        <Navigation setTab={setTab} tabsRef={tabsRef} />

        <button className="wallet" onClick={() => connectWallet(setWallet)}>
          {wallet ? wallet.slice(0,6) + '...' : 'Connect Wallet'}
        </button>

        {/* NFT CARD */}
        {tab === 3 && (
          <NFTCard
            nfts={nfts}
            activeIndex={activeIndex}
            setActiveIndex={setActiveIndex}
          />
        )}

        {/* STYLES */}
        <style jsx global>{`
          body, html {
            margin:0;
            padding:0;
            overflow:hidden;
            font-family:sans-serif;
            touch-action: manipulation;
            overscroll-behavior: none;
          }

          .background {
            position:absolute;
            width:100%;
            height:100%;
            object-fit:cover;
            z-index:0;
          }

          .character {
            position:absolute;
            bottom:0;
            left:0;
            height:100%;
            z-index:3;
            pointer-events:none;
          }

          .nav {
            position:absolute;
            top:0;
            width:100%;
            height:100px;
            display:flex;
            justify-content:center;
            align-items:center;
            flex-wrap:wrap;
            gap:12px;
            z-index:4;
          }

          .tab {
            padding:12px 18px;
            min-width:80px;
            text-align:center;
            background:rgba(255,255,255,0.15);
            border-radius:12px;
          }

          .wallet {
            position:absolute;
            top:20px;
            right:20px;
            z-index:5;
          }

          .viewport {
            width:100vw;
            height:100vh;
            display:flex;
            align-items:center;
            justify-content:center;
            background:black;
          }

          .stage {
            width:315px;
            height:1084px;
            position:relative;
            transform-origin: top left;
          }
        `}</style>
      </div>
    </div>
  );
}
