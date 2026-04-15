import { ethers } from 'ethers';

export async function connectWallet(setWallet) {
  if (!window.ethereum) return alert('Install MetaMask');

  const provider = new ethers.BrowserProvider(window.ethereum);
  await provider.send("eth_requestAccounts", []);

  const signer = await provider.getSigner();
  const address = await signer.getAddress();

  setWallet(address);
}
