'use client';

import { useState, useEffect } from 'react';
import Character from './components/Character';
import Navigation from './components/Navigation';
import NFTCard from './components/NFTCard';
import { connectWallet } from './lib/wallet';
import { fetchNFT } from './lib/opensea';

export default function Page() {
  const tabsRef = useRef([]);
  const [tab, setTab] = useState(0);
  const [wallet, setWallet] = useState(null);
  const [nft, setNft] = useState(null);

  useEffect(() => {
    if (tab === 3 && wallet) {
      fetchNFT(wallet).then(setNft);
    }
  }, [tab, wallet]);

  return (
    <div className="container">
      <img src="https://ipfs.io/ipfs/bafybeihkhckfk72hi77yrr3sf7leby5agmsq5cpdvel65vw43cb6bx2zb4" className="bg" />

      <Character currentTab={tab} tabsRef={tabsRef} />
      <Navigation setTab={setTab} tabsRef={tabsRef} />

      <button className="wallet" onClick={() => connectWallet(setWallet)}>
        {wallet ? wallet.slice(0,6) + '...' : 'Connect Wallet'}
      </button>

      {tab === 3 && nft && <NFTCard nft={nft} />}

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
    left:60px;
    width:320px;
    padding:20px;
    background:rgba(0,0,0,0.7);
    border-radius:16px;
    color:white;
    opacity:0;
    transform:translateY(40px) scale(0.95);
    transition:all 0.5s cubic-bezier(0.22,1,0.36,1);
    z-index:2;
  }

  .card.show {
    opacity:1;
    transform:translateY(0) scale(1);
  }
`}</style>
    </div>
  );
}
