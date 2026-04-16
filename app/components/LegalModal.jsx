'use client';

import { useState } from 'react';

export default function LegalModal() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* 🟢 FLOAT BUTTON */}
      <button className="legal-btn" onClick={() => setOpen(true)}>
        ⚖️
      </button>

      {/* 📜 MODAL */}
      {open && (
        <div className="legal-overlay" onClick={() => setOpen(false)}>
          <div
            className="legal-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="close-btn" onClick={() => setOpen(false)}>
              ✕
            </button>

            {/* 📌 NAV */}
            <div className="legal-nav">
              <a href="#ip">IP</a>
              <a href="#license">License</a>
              <a href="#royalties">Royalties</a>
              <a href="#risk">Risk</a>
              <a href="#law">Law</a>
            </div>

            {/* 📜 CONTENT */}
            <div className="legal-content">
              <h2>Digitalknuckles Legal</h2>

              <section id="ip">
                <h3>1. Intellectual Property</h3>
                <p>
                  All artwork and assets remain property of Digitalknuckles.
                </p>
              </section>

              <section id="license">
                <h3>2. License</h3>
                <p>
                  Limited, non-commercial display rights only.
                </p>
              </section>

              <section id="royalties">
                <h3>3. Royalties</h3>
                <p>
                  Not guaranteed across marketplaces.
                </p>
              </section>

              <section id="risk">
                <h3>4. Risk</h3>
                <p>
                  NFTs carry technical and market risks.
                </p>
              </section>

              <section id="law">
                <h3>5. Governing Law</h3>
                <p>
                  Subject to applicable jurisdiction.
                </p>
              </section>
            </div>
          </div>
        </div>
      )}

      {/* 🎨 STYLES */}
      <style jsx global>{`

        .legal-btn {
          position: fixed;
          bottom: 20px;
          left: 20px;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          border: none;
          background: rgba(0,0,0,0.5);
          color: white;
          font-size: 20px;
          backdrop-filter: blur(10px);
          z-index: 9999;
        }

        .legal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9998;
        }

        .legal-modal {
          width: 90%;
          max-width: 420px;
          max-height: 80vh;
          background: rgba(20,20,20,0.95);
          border-radius: 16px;
          padding: 20px;
          color: white;
          position: relative;
          display: flex;
          flex-direction: column;
        }

        .close-btn {
          position: absolute;
          top: 10px;
          right: 10px;
          background: none;
          border: none;
          color: white;
          font-size: 18px;
        }

        .legal-nav {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          margin-bottom: 10px;
        }

        .legal-nav a {
          font-size: 12px;
          padding: 4px 8px;
          border-radius: 6px;
          background: rgba(255,255,255,0.1);
          color: white;
          text-decoration: none;
        }

        .legal-content {
          overflow-y: auto;
          font-size: 13px;
        }

        .legal-content section {
          margin-bottom: 14px;
        }

      `}</style>
    </>
  );
}
