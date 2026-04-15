'use client';

export default function Navigation({ setTab, tabsRef, activeTab }) {
  const tabs = ["Home", "Games", "Marketplace", "Profile"];

  return (
    <div className="nav">
      {tabs.map((label, i) => (
        <div
          key={i}
          ref={(el) => {
            if (el) tabsRef.current[i] = el;
          }}
          className={`tab ${activeTab === i ? 'active' : ''}`}
          onClick={() => setTab(i)}
        >
          {label}
        </div>
      ))}
    </div>
  );
}
