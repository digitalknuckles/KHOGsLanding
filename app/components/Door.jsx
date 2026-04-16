'use client';

import { useState } from 'react';

const assets = {
  closed: "https://ipfs.io/ipfs/bafkreicelhsdslcflfflph3hwsez3ytdle53nbnyr3i7f4yain4d5tbtqy",
  open: "https://ipfs.io/ipfs/bafkreicngryldkw3ntzgndo3dsoowfee7i7jbp5kmerrdadrjonqhzsome"
};

export default function Door({ onEnter }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={`door ${open ? 'open' : ''}`}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onTouchStart={() => setOpen(true)}
      onTouchEnd={() => {
        setOpen(false);
        onEnter?.();
      }}
      onClick={onEnter}
    >
      <img
        src={open ? assets.open : assets.closed}
        alt="door"
      />
    </div>
  );
}
