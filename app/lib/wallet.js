import { ethers } from 'ethers';
import EthereumProvider from '@walletconnect/ethereum-provider';
import { SiweMessage } from 'siwe';

let providerCache = null;

export async function connectWallet(setWallet) {
  try {
    let provider;

    // 🟢 1. META MASK / INJECTED WALLET
    if (typeof window !== "undefined" && window.ethereum) {
      provider = new ethers.BrowserProvider(window.ethereum);

      await provider.send("eth_requestAccounts", []);
    } else {
      // 🔵 2. WALLETCONNECT FALLBACK
      const wc = await EthereumProvider.init({
        projectId: "YOUR_WALLETCONNECT_PROJECT_ID",
        chains: [1, 137], // ETH + Polygon
        showQrModal: true,
      });

      await wc.connect();

      provider = new ethers.BrowserProvider(wc);
    }

    providerCache = provider;

    const signer = await provider.getSigner();
    const address = await signer.getAddress();

    // 🔐 3. SIWE SIGN-IN
    const domain = window.location.host;
    const origin = window.location.origin;

    const message = new SiweMessage({
      domain,
      address,
      statement: "Sign in to KHOGs",
      uri: origin,
      version: "1",
      chainId: 1,
    });

    const signature = await signer.signMessage(message.prepareMessage());

    // OPTIONAL: send to backend for verification
    // await fetch('/api/verify', { method: 'POST', body: JSON.stringify({ message, signature }) })

    // 💾 SAVE SESSION
    localStorage.setItem("wallet", address);

    setWallet(address);

    console.log("✅ Connected + SIWE verified:", address);

  } catch (err) {
    console.error("Wallet error:", err);
  }
}
