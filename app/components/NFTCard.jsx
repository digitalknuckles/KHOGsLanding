'use client';

export default function NFTCard({ nft }) {
  return (
    <div className="card">
      <img src={nft.image} />
      <p>{nft.name}</p>

      <style jsx>{`
        .card {
          position:absolute;
          left:40px;
          bottom:120px;
          width:300px;
          background:rgba(0,0,0,0.7);
          padding:20px;
          border-radius:12px;
          color:white;
          animation: pop 0.4s ease;
        }

        @keyframes pop {
          from { transform: translateY(40px); opacity:0 }
          to { transform: translateY(0); opacity:1 }
        }

        img { width:100%; border-radius:8px; }
      `}</style>
    </div>
  );
}
