'use client';

import { useState } from 'react';

export const metadata = {
  title: 'KHOGs©',
  description: 'Animated Navigation App',
};

export default function RootLayout({ children }) {
  const [open, setOpen] = useState(false);

  return (
    <html lang="en">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
        />
      </head>

      <body>
        {children}

        {/* 🟢 FLOATING LEGAL BUTTON */}
        <button
          className="legal-btn"
          onClick={() => setOpen(true)}
        >
          ⚖️
        </button>

        {/* 📜 MODAL */}
        {open && (
          <div className="legal-overlay" onClick={() => setOpen(false)}>
            <div
              className="legal-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="close-btn"
                onClick={() => setOpen(false)}
              >
                ✕
              </button>

              {/* 📌 QUICK NAV */}
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
                    All artwork, designs, characters, animations, metadata,
                    names, logos, trademarks, and copyrights remain the
                    exclusive property of Digitalknuckles.
                  </p>
                </section>

                <section id="license">
                  <h3>2. License</h3>
                  <p>
                    NFT holders receive a limited, non-exclusive,
                    non-transferable license for personal display only.
                  </p>
                </section>

                <section id="royalties">
                  <h3>3. Royalties</h3>
                  <p>
                    Royalties are enforced only where supported by marketplaces
                    and are not guaranteed.
                  </p>
                </section>

                <section id="risk">
                  <h3>4. Risk</h3>
                  <p>
                    NFTs involve market, technical, and regulatory risks.
                    Participation is at your own risk.
                  </p>
                </section>

                <section id="law">
                  <h3>5. Governing Law</h3>
                  <p>
                    Subject to applicable jurisdiction without conflict-of-law principles.
                  </p>
                </section>

              </div>
            </div>
          </div>
        )}

        {/* 🎨 STYLES */}
        <style jsx global>{`

          /* 🔘 FLOAT BUTTON */
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
            cursor: pointer;
          }

          /* 🌑 OVERLAY */
          .legal-overlay {
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.7);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9998;
          }

          /* 📦 MODAL */
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

          /* ❌ CLOSE */
          .close-btn {
            position: absolute;
            top: 10px;
            right: 10px;
            background: transparent;
            border: none;
            color: white;
            font-size: 18px;
            cursor: pointer;
          }

          /* 📌 NAV LINKS */
          .legal-nav {
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
            margin-bottom: 10px;
          }

          .legal-nav a {
            font-size: 12px;
            padding: 4px 8px;
            border-radius: 6px;
            background: rgba(255,255,255,0.1);
            text-decoration: none;
            color: white;
          }

          /* 📜 SCROLL AREA */
          .legal-content {
            overflow-y: auto;
            font-size: 13px;
            line-height: 1.5;
          }

          .legal-content section {
            margin-bottom: 16px;
          }

          .legal-content h3 {
            margin-bottom: 6px;
          }

        `}</style>

      </body>
    </html>
  );
}
