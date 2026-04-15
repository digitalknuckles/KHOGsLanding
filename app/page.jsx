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

      <style jsx>{`
        .container { width:100vw; height:100vh; position:relative; overflow:hidden; }
        .bg { position:absolute; width:100%; height:100%; object-fit:cover; }
        .wallet { position:absolute; top:20px; right:20px; z-index:10; }
      `}</style>
    </div>
  );
}
