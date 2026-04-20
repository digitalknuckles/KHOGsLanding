'use client';

import Character from './Character';
import NPCManager from './NPCManager';
import ShopWalker from './ShopWalker';

const BG =
  "https://ipfs.io/ipfs/bafybeiakrcczgynayzfosyklhq4vehyuugwieeujyfuebwhd6ipgf2o7fq";

const COUNTER_BACK =
  "https://ipfs.io/ipfs/bafybeiguouijuhj3k4ilyibnp324c3glfmsj6vumxy3lxduim6z3grllmm";

const COUNTER_FRONT =
  "https://ipfs.io/ipfs/bafybeihwur3phaaphvzu3w57obpjaqwdhdnsfjwwyxc2hi5wet6rg6t5ia";

export default function ShopScene({ tab, tabsRef }) {
  return (
    <div className="scene shop-scene">

      {/* 🖼️ LAYER 0 — BACKGROUND */}
      <img className="layer bg" src={BG} alt="shop background" />
      <ShopWalker />
      {/* 🧍 LAYER 1 — NPCs (BEHIND COUNTER) */}
      <div className="npc-layer">
        <NPCManager />
      </div>

      {/* 🧱 LAYER 2 — COUNTER BACK */}
      <img className="layer counter-back" src={COUNTER_BACK} alt="counter back" />

      {/* 🧱 LAYER 3 — COUNTER FRONT */}
      <img className="layer counter-front" src={COUNTER_FRONT} alt="counter front" />

      {/* 🎮 LAYER 4 — CHARACTER */}
      <Character currentTab={tab} tabsRef={tabsRef} scale={1.3} />

    </div>
  );
}
