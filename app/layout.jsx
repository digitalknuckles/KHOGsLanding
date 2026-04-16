'use client';

import { useState } from 'react';

export const metadata = { 
  title: 'Your App',
  description: 'Animated Navigation App',
};

export default function RootLayout({ children }) {
  const [open, setOpen] = useState(false);

  return (
    <html lang="en">
      <head>
        <title>KHOGs©</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
        />
      </head>

      <body>
        {children}

        {/* 🧾 LEGAL TOGGLE BUTTON */}
        <button
          className="legal-btn"
          onClick={() => setOpen(!open)}
        >
          📜
        </button>

        {/* 🧾 LEGAL PANEL */}
        <div className={`legal-panel ${open ? 'open' : ''}`}>
          <div className="legal-content">

            <h3>Digitalknuckles Licensing & Legal Disclosures</h3>

            <p>
              This website and all DigitalKnuckles NFTs are created by
              <strong> Digitalknuckles</strong>.
            </p>

            <h4>IP Ownership</h4>
            <p>
              All artwork, characters, and assets remain the property of Digitalknuckles.
            </p>

            <h4>Holder License</h4>
            <p>
              NFT holders receive a limited license for personal display only.
              Commercial use is prohibited without written permission.
            </p>

            <h4>No Financial Rights</h4>
            <p>
              NFTs are collectibles, not investments. No profit expectation,
              revenue share, or ownership is granted.
            </p>

            <h4>Risk</h4>
            <p>
              Use at your own risk. Smart contracts, markets, and platforms may fail.
            </p>

            <p style={{ opacity: 0.6, fontSize: '12px' }}>
              © 2026 Digitalknuckles
            </p>

          </div>
        </div>

        {/* 🎨 STYLES */}
        <style jsx global>{`

          /* 🔘 floating button */
          .legal-btn {
            position: fixed;
            bottom: 16px;
            right: 16px;
            z-index: 999;

            width: 42px;
            height: 42px;
            border-radius: 50%;
            border: none;

            background: rgba(0,0,0,0.6);
            color: white;
            font-size: 18px;

            backdrop-filter: blur(10px);
            cursor: pointer;

            transition: transform 0.2s ease;
          }

          .legal-btn:active {
            transform: scale(0.9);
          }

          /* 📄 panel */
          .legal-panel {
            position: fixed;
            bottom: 0;
            left: 0;
            width: 100%;
            max-height: 70vh;

            transform: translateY(100%);
            transition: transform 0.3s ease;

            z-index: 998;
          }

          .legal-panel.open {
            transform: translateY(0);
          }

          /* 📦 content */
          .legal-content {
            background: rgba(0,0,0,0.9);
            color: white;
            padding: 20px;

            overflow-y: auto;
            max-height: 70vh;

            border-top-left-radius: 16px;
            border-top-right-radius: 16px;

            backdrop-filter: blur(12px);
          }

          .legal-content h3 {
            margin-top: 0;
          }

          .legal-content h4 {
            margin-top: 12px;
            font-size: 14px;
            opacity: 0.8;
          }

          .legal-content p {
            font-size: 12px;
            line-height: 1.4;
          }

        `}</style>
      </body>
    </html>
  );
}
