'use client';

import { useState, useEffect, useRef } from 'react';
import Character from './components/Character';
import Navigation from './components/Navigation';
import NFTCard from './components/NFTCard';
import { connectWallet } from './lib/wallet';
import { fetchNFTs } from './lib/opensea';

export default function Page() {
  const tabsRef = useRef([]);
  const [tab, setTab] = useState(0);
  const [wallet, setWallet] = useState(null);
  const [nfts, setNfts] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);

  //For both single and plural fetch
//export async function fetchNFT(address) {
 // const nfts = await fetchNFTs(address);
 // return nfts[0];
//}
  
useEffect(() => {
  if (tab === 3 && wallet) {
    fetchNFTs(wallet).then(setNfts);
  }
}, [tab, wallet]);
  
  //useEffect(() => {
  //if (tab === 3 && wallet) {
    //fetchNFT(wallet).then(data => {
    //  console.log("NFT:", data);
     // setNft(data);
    //});
 // }
//}, [tab, wallet]);

  return (
    <div className="container">
      <picture className="background">
  {/* 🖥️ Ultra-wide / retina desktop */}
  <source
    media="(min-width: 1400px)"
    srcSet="https://ipfs.io/ipfs/bafybeigxprm4pptl6cg2lysvocw6ocfnv66ygn7evtxjuadqayevzvun2m"
  />

  {/* 🖥️ Standard desktop */}
  <source
    media="(min-width: 768px)"
    srcSet="https://ipfs.io/ipfs/bafybeihkhckfk72hi77yrr3sf7leby5agmsq5cpdvel65vw43cb6bx2zb4"
  />

  {/* ⚡ Tablet / fallback */}
  <source
    media="(min-width: 480px)"
    srcSet="https://ipfs.io/ipfs/bafkreif6hlgr73cqxolmjh2mir4flvpi26apl2mvt53ra4gtav57ewltby"
  />

  {/* 📱 Mobile (DEFAULT + MOST IMPORTANT) */}
  <img
    src="https://ipfs.io/ipfs/bafkreiclut5bpexxx7bcjoe3fomtw2yqoys3ltt2tm3d4ldsfw2tn24lmm"
    alt="background"
  />
</picture>

      <Character currentTab={tab} tabsRef={tabsRef} />

      <Navigation
        setTab={setTab}
        tabsRef={tabsRef}
        activeTab={tab}
      />

      <button className="wallet" onClick={() => connectWallet(setWallet)}>
        {wallet ? wallet.slice(0,6) + '...' : 'Connect Wallet'}
      </button>

      
      {tab === 3 && (
  <NFTCard
    nfts={nfts}
    activeIndex={activeIndex}
    setActiveIndex={setActiveIndex}
  />
)}

      <style jsx global>{`
  body, html {
    margin:0;
    padding:0;
    overflow:hidden;
    font-family:sans-serif;
  }

html, body {
  touch-action: manipulation;
  overscroll-behavior: none;
}
  .character {
    position:absolute;
    bottom:0;
    left:0;
    height:100vh;
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
    gap:40px;
    z-index:4;
  }
.nav { 
  flex-wrap:wrap;
  gap:12px;
  padding:10px;
}
  
body {
  -webkit-user-select:none;
  user-select:none;
}

.traits {
  max-height:150px;
  overflow-y:auto;
  display:flex;
  flex-direction:column;
  gap:6px;
  margin-top:5px;

  animation: fadeIn 0.25s ease;
}

@keyframes fadeIn {
  from {
    opacity:0;
    transform: translateY(10px);
  }
  to {
    opacity:1;
    transform: translateY(0);
  }
}

.tab {
  cursor:pointer;
  padding:12px 18px;
  font-size:14px;
  min-width:80px;
  text-align:center;
  background:rgba(255,255,255,0.15);
  border-radius:12px;
  backdrop-filter:blur(10px);
}

.tab {
  cursor:pointer;
  padding:12px 18px;
  border-radius:12px;
  background:rgba(255,255,255,0.15);
  transition: all 0.15s ease;
}

/* 👇 press effect */
.tab:active {
  transform: scale(0.92);
}

/* 👇 selected tab */
.tab.active {
  background:rgba(255,255,255,0.35);
  transform: scale(1.05);
}

  .wallet {
    position:absolute;
    top:20px;
    right:20px;
    z-index:5;
    background:rgba(0,0,0,0.6);
    color:white;
    padding:10px;
  }

.card {
  position:absolute;
  bottom:120px;
  left:20px;
  width:260px;
  max-width:80vw;
  padding:16px;
  background:rgba(0,0,0,0.75);
  border-radius:16px;
  color:white;
  z-index:2;

  display:flex;
  flex-direction:column;
  gap:10px;

  animation: pop 0.4s ease;
}

.card {
  transition: transform 0.35s cubic-bezier(0.22,1,0.36,1);
}

.nft-img {
  width:100%;
  border-radius:10px;
  object-fit:cover;
}

.dropdown {
  width:100%;
  padding:8px;
  border:none;
  border-radius:8px;
  background:rgba(255,255,255,0.1);
  color:white;
  cursor:pointer;
}

.traits {
  max-height:150px;
  overflow-y:auto;
  display:flex;
  flex-direction:column;
  gap:6px;
  margin-top:5px;
}

.trait {
  display:flex;
  justify-content:space-between;
  font-size:12px;
  opacity:0.9;
}

  .card.show {
    opacity:1;
    transform:translateY(0) scale(1);
  }
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
.background {
  position:absolute;
  inset:0;
  width:100%;
  height:100%;
  object-fit:cover;
  object-position:center;
  z-index:0;
  pointer-events:none;
}

.background img {
  transform: scale(1.02);
}

.background::after {
  content:'';
  position:absolute;
  inset:0;
  background: radial-gradient(circle at center, transparent 60%, rgba(0,0,0,0.4));
}

.background { z-index:0; }
.card { z-index:2; }
.character { z-index:3; }
.nav { z-index:4; }
.wallet { z-index:5; }

.card {
  backdrop-filter: blur(12px);
  box-shadow: 0 10px 30px rgba(0,0,0,0.4);
}

.tab {
  box-shadow: 0 4px 10px rgba(0,0,0,0.3);
}

.viewport::after {
  content:'';
  position:absolute;
  inset:0;
  pointer-events:none;
  background: radial-gradient(circle at center, transparent 60%, rgba(0,0,0,0.5));
}
`}</style>
    </div>
  );
}
