'use client';
import { useEffect, useState } from 'react';

const assets = {
  left1: "https://ipfs.io/ipfs/bafkreiheo32ehfntwpmxcars2ta4mq3hqhoheqzsr6ygyuyccbvjwpie7e",
  left2: "https://ipfs.io/ipfs/bafkreifcpvhdaydz64st2ozhwh4ltgzo6dschjd4ehxtmwiqeuphlcfsby",
  right1: "https://ipfs.io/ipfs/bafkreifdy25dy7oywuhwauo2y7jacny3lghk2vficddvbwx2rpy6f4zxqu",
  right2: "https://ipfs.io/ipfs/bafkreic7tlur3ycl2r3zjuuxbghhfihucexc3biucb753j2576ltrogptq",
  flip: "https://ipfs.io/ipfs/bafkreic6iy37nlapsjm2tgvfzb72fkop47lgwwthjaomyg7sl63pp7lcgy"
};

export default function Character({ currentTab }) {
  const [sprite, setSprite] = useState(assets.right1);
  const [pos, setPos] = useState(0);

  useEffect(() => {
    let running = true;
    let frame = 0;

    const goingRight = currentTab > pos;

    const frames = goingRight
      ? [assets.right1, assets.right2]
      : [assets.left1, assets.left2];

    function loop() {
      if (!running) return;
      setSprite(frames[frame % 2]);
      frame++;
      setTimeout(() => requestAnimationFrame(loop), 140);
    }

    loop();

    setTimeout(() => {
      running = false;
      setSprite(currentTab === 0 ? assets.left1 : assets.right1);
      setPos(currentTab);
    }, 1200);

  }, [currentTab]);

  return (
    <img
      src={sprite}
      style={{
        position:'absolute',
        bottom:0,
        height:'100vh',
        transform:`translateX(${currentTab * 25}vw)`,
        pointerEvents:'none'
      }}
    />
  );
}
