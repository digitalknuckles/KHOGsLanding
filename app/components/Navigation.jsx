'use client';

export default function Navigation({ setTab }) {
  return (
    <div className="nav">
      {["Home","Games","Marketplace","Profile"].map((t,i)=>(
        <button key={i} onClick={()=>setTab(i)}>{t}</button>
      ))}

      <style jsx>{`
        .nav { position:absolute; top:20px; width:100%; display:flex; justify-content:center; gap:20px; z-index:5; }
      `}</style>
    </div>
  );
}
