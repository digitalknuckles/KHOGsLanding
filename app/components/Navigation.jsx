'use client';
import { useRef, useEffect } from 'react';

export default function Navigation({ setTab, tabsRef }) {

  return (
    <div className="nav">
      {["Home","Games","Marketplace","Profile"].map((t,i)=>(
        <div
          key={i}
          ref={(el) => {
      if (el) tabsRef.current[i] = el;
    }}
          className="tab"
          onClick={()=>setTab(i)}
        >
          {t}
        </div>
      ))}
    </div>
  );
}
