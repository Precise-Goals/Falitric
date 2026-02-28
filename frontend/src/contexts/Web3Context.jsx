import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";
import { useAuth } from "./AuthContext.jsx";

const Web3Context = createContext(null);

export function Web3Provider({ children }) {
  const { user, linkWallet } = useAuth();
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [walletAddress, setWalletAddress] = useState(
    () => localStorage.getItem("faltric_wallet") || null
  );
  const [chainId, setChainId] = useState(null);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState(null);

  // Auto-reconnect if wallet address is stored
  useEffect(() => {
    const stored = localStorage.getItem("faltric_wallet");
    if (stored && window.ethereum) {
      silentReconnect();
    }
  }, []);

  async function silentReconnect() {
    try {
      const accounts = await window.ethereum.request({ method: "eth_accounts" });
      if (accounts.length > 0) {
        await initProvider(accounts[0]);
      }
    } catch {
      // Silent fail
    }
  }

  async function initProvider(address) {
    const web3Provider = new ethers.BrowserProvider(window.ethereum);
    const web3Signer = await web3Provider.getSigner();
    const network = await web3Provider.getNetwork();

    setProvider(web3Provider);
    setSigner(web3Signer);
    setWalletAddress(address);
    setChainId(Number(network.chainId));
    localStorage.setItem("faltric_wallet", address);
  }

  async function connectWallet() {
    setError(null);
    if (!window.ethereum) {
      setError("MetaMask not found. Please install MetaMask.");
      return;
    }
    setConnecting(true);
    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      await initProvider(accounts[0]);

      // Link wallet to account if logged in
      if (user && !user.walletAddress) {
        await linkWallet(accounts[0]);
      }
    } catch (err) {
      setError(err.message || "Failed to connect wallet");
    } finally {
      setConnecting(false);
    }
  }

  function disconnectWallet() {
    setProvider(null);
    setSigner(null);
    setWalletAddress(null);
    setChainId(null);
    localStorage.removeItem("faltric_wallet");
  }

  // Listen for account/chain changes
  useEffect(() => {
    if (!window.ethereum) return;

    const handleAccountsChanged = (accounts) => {
      if (accounts.length === 0) {
        disconnectWallet();
      } else {
        initProvider(accounts[0]);
      }
    };

    const handleChainChanged = () => {
      window.location.reload();
    };

    window.ethereum.on("accountsChanged", handleAccountsChanged);
    window.ethereum.on("chainChanged", handleChainChanged);

    return () => {
      window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
      window.ethereum.removeListener("chainChanged", handleChainChanged);
    };
  }, []);

  const getContract = useCallback(
    (address, abi) => {
      if (!signer) return null;
      return new ethers.Contract(address, abi, signer);
    },
    [signer]
  );

  const formatAddress = (addr) =>
    addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : "";

  return (
    <Web3Context.Provider
      value={{
        provider,
        signer,
        walletAddress,
        chainId,
        connecting,
        error,
        connectWallet,
        disconnectWallet,
        getContract,
        formatAddress,
        isConnected: !!walletAddress,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
}

export function useWeb3() {
  const ctx = useContext(Web3Context);
  if (!ctx) throw new Error("useWeb3 must be used within Web3Provider");
  return ctx;
}
