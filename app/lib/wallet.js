import { ethers } from 'ethers';

export async function connectWallet(setWallet) {
  try {
    if (!window.ethereum) {
      alert('Install MetaMask');
      return;
    }

    const provider = new ethers.BrowserProvider(window.ethereum);

    // 🔗 CONNECT (opens MetaMask)
    await provider.send("eth_requestAccounts", []);

    const signer = await provider.getSigner();
    const address = await signer.getAddress();

    // ✍️ SIGN IMMEDIATELY (CRITICAL FOR MOBILE)
    const message = "Verify wallet ownership";

    await signer.signMessage(message);

    // ✅ ONLY set wallet AFTER successful sign
    setWallet(address);

    console.log("✅ Connected + Signed:", address);

  } catch (err) {
    console.error("Wallet error:", err);
  }
}
