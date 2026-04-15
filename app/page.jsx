'use client';

import { useState, useEffect, useRef } from 'react';
import Character from './components/Character';
import Navigation from './components/Navigation';
import NFTCard from './components/NFTCard';
import { connectWallet } from './lib/wallet';
import { fetchNFT } from './lib/opensea';

export default function Page() {
  const tabsRef = useRef([]);
  const [tab, setTab] = useState(0);
  const [wallet, setWallet] = useState(null);
  const [nfts, setNfts] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);


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
      <img src="https://ipfs.io/ipfs/bafybeihkhckfk72hi77yrr3sf7leby5agmsq5cpdvel65vw43cb6bx2zb4" className="bg" />

      <Character currentTab={tab} tabsRef={tabsRef} />
      <Navigation setTab={setTab} tabsRef={tabsRef} />

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

  .tab {
    cursor:pointer;
    padding:10px 20px;
    background:rgba(255,255,255,0.1);
    border-radius:10px;
    backdrop-filter:blur(10px);
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
`}</style>
    </div>
  );
}
