'use client';

import { useState } from 'react';

const closedDoor =
  "https://ipfs.io/ipfs/bafkreicelhsdslcflfflph3hwsez3ytdle53nbnyr3i7f4yain4d5tbtqy";

const openDoor =
  "https://ipfs.io/ipfs/bafkreicngryldkw3ntzgndo3dsoowfee7i7jbp5kmerrdadrjonqhzsome";

export default function Door({ onEnter }) {
  const [open, setOpen] = useState(false);

  const handleEnter = () => {
    setOpen(true);

    setTimeout(() => {
      onEnter?.();
      setOpen(false);
    }, 500);
  };

  return (
    <div
      className={`door ${open ? 'open' : ''}`}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onTouchStart={() => setOpen(true)}
      onTouchEnd={handleEnter}
      onClick={handleEnter}
    >
      <img src={open ? openDoor : closedDoor} alt="door" />
    </div>
  );
}
