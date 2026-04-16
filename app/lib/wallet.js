import { ethers } from 'ethers';

// ✅ Detect mobile
export function isMobile() {
  return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

// ✅ Fix mobile redirect (MetaMask deep link)
export function handleMobileWalletRedirect() {
  if (typeof window === 'undefined') return;

  if (!window.ethereum && isMobile()) {
    const dappUrl = window.location.href;
    const metamaskUrl = `https://metamask.app.link/dapp/${dappUrl.replace(
      /^https?:\/\//,
      ''
    )}`;

    window.location.href = metamaskUrl;
    return true; // redirected
  }

  return false;
}

// ✅ Connect wallet (MetaMask / injected)
export async function connectWallet(setWallet) {
  if (!window.ethereum) {
    alert('No wallet detected');
    return;
  }

  const provider = new ethers.BrowserProvider(window.ethereum);

  // request accounts
  await provider.send("eth_requestAccounts", []);

  const signer = await provider.getSigner();
  const address = await signer.getAddress();

  setWallet(address);

  // 💾 persist session
  localStorage.setItem('wallet', address);
}

// ✅ Auto reconnect on reload
export async function reconnectWallet(setWallet) {
  if (!window.ethereum) return;

  const saved = localStorage.getItem('wallet');
  if (!saved) return;

  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const address = await signer.getAddress();

    setWallet(address);
  } catch {
    localStorage.removeItem('wallet');
  }
}
