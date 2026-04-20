'use client';

import NPCManager from './NPCManager';
import Character from './Character';

const SHOP_BG = "https://ipfs.io/ipfs/bafybeiakrcczgynayzfosyklhq4vehyuugwieeujyfuebwhd6ipgf2o7fq";
const COUNTER_1 = "https://ipfs.io/ipfs/bafybeiguouijuhj3k4ilyibnp324c3glfmsj6vumxy3lxduim6z3grllmm";
const COUNTER_2 = "https://ipfs.io/ipfs/bafybeihwur3phaaphvzu3w57obpjaqwdhdnsfjwwyxc2hi5wet6rg6t5ia";

export default function ShopScene({ tab, tabsRef }) {
  return (
    <div className="scene shop-scene">

      {/* 🌄 LAYER 0 — BG */}
      <img className="bg" src={SHOP_BG} alt="shop bg" />

      {/* 🧍 LAYER 1 — NPC (BEHIND COUNTER 1) */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 3 }}>
        <NPCManager />
      </div>

      {/* 🪑 LAYER 2 — COUNTER BACK */}
      <img
        src={COUNTER_1}
        className="shop-counter back"
        alt="counter back"
      />

      {/* 🪑 LAYER 3 — COUNTER FRONT */}
      <img
        src={COUNTER_2}
        className="shop-counter front"
        alt="counter front"
      />

      {/* 🎮 LAYER 4 — CHARACTER */}
      <Character currentTab={tab} tabsRef={tabsRef} />

    </div>
  );
}
