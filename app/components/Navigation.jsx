'use client';

export default function Navigation({ setTab, tabsRef, activeTab }) {

  return (
    <div className="nav">
      {["Home","Games","Marketplace","Profile"].map((t,i)=>(
        <div
          key={i}
          ref={el => tabsRef.current[i] = el}
          className={`tab ${activeTab === i ? 'active' : ''}`}
          onClick={()=>setTab(i)}
        >
          {t}
        </div>
      ))}
    </div>
  );
}
