'use client';

import NPCManager from './NPCManager';
import Character from './Character';

const SHOP_BG = "https://ipfs.io/ipfs/bafybeiakrcczgynayzfosyklhq4vehyuugwieeujyfuebwhd6ipgf2o7fq";
const COUNTER_1 = "https://ipfs.io/ipfs/bafybeiguouijuhj3k4ilyibnp324c3glfmsj6vumxy3lxduim6z3grllmm";
const COUNTER_2 = "https://ipfs.io/ipfs/bafybeihwur3phaaphvzu3w57obpjaqwdhdnsfjwwyxc2hi5wet6rg6t5ia";

export default function ShopScene({ tab, tabsRef }) {
  return (
    <div className="scene">

      {/* 🌄 LAYER 0 */}
      <img className="layer bg" src={SHOP_BG} alt="bg" />

      {/* 🧍 LAYER 1 (NPC BEHIND COUNTER) */}
      <div className="layer npc-layer">
        <NPCManager />
      </div>

      {/* 🪑 LAYER 2 */}
      <img className="layer counter-back" src={COUNTER_1} alt="" />

      {/* 🪑 LAYER 3 */}
      <img className="layer counter-front" src={COUNTER_2} alt="" />

      {/* 🎮 LAYER 4 */}
      <Character currentTab={tab} tabsRef={tabsRef} />

    </div>
  );
}
