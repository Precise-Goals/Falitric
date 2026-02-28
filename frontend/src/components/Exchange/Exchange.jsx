import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext.jsx";
import { useWeb3 } from "../../contexts/Web3Context.jsx";
import { ethers } from "ethers";
import TradeModal from "./TradeModal.jsx";

const ENERGY_TOKEN_ABI = [
  "function balanceOf(address account) view returns (uint256)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
];

const TRADE_ENGINE_ABI = [
  "function lockTrade(address buyer, uint256 tokenAmount) payable returns (uint256)",
  "function releaseTrade(uint256 tradeId)",
  "function cancelTrade(uint256 tradeId)",
  "function getTrade(uint256 tradeId) view returns (tuple(address seller, address buyer, uint256 tokenAmount, uint256 ethAmount, uint8 status))",
  "event TradeCreated(uint256 indexed tradeId, address indexed seller, address indexed buyer, uint256 tokenAmount, uint256 ethAmount)",
];

const TOKEN_ADDRESS = import.meta.env.VITE_TOKEN_ADDRESS || "";
const TRADE_ENGINE_ADDRESS = import.meta.env.VITE_TRADE_ENGINE_ADDRESS || "";

export default function Exchange() {
  const { authFetch } = useAuth();
  const { walletAddress, getContract, isConnected } = useWeb3();
  const [balance, setBalance] = useState("0");
  const [trades, setTrades] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [txStatus, setTxStatus] = useState("");

  useEffect(() => {
    if (isConnected && walletAddress) {
      fetchBalance();
    }
  }, [isConnected, walletAddress]);

  async function fetchBalance() {
    try {
      if (!TOKEN_ADDRESS) return;
      const token = getContract(TOKEN_ADDRESS, ENERGY_TOKEN_ABI);
      if (!token) return;
      const raw = await token.balanceOf(walletAddress);
      setBalance(ethers.formatEther(raw));
    } catch (err) {
      console.error("Balance fetch error:", err);
    }
  }

  async function handleCreateTrade({ buyerAddress, tokenAmount, ethAmount }) {
    if (!isConnected) return;
    setLoading(true);
    setTxStatus("Approving tokens...");
    try {
      const token = getContract(TOKEN_ADDRESS, ENERGY_TOKEN_ABI);
      const engine = getContract(TRADE_ENGINE_ADDRESS, TRADE_ENGINE_ABI);

      const tokenAmountWei = ethers.parseEther(tokenAmount.toString());
      const ethAmountWei = ethers.parseEther(ethAmount.toString());

      const approveTx = await token.approve(TRADE_ENGINE_ADDRESS, tokenAmountWei);
      await approveTx.wait();
      setTxStatus("Locking trade...");

      const tradeTx = await engine.lockTrade(buyerAddress, tokenAmountWei);
      const receipt = await tradeTx.wait();
      setTxStatus(`Trade locked! Tx: ${receipt.hash.slice(0, 10)}...`);

      fetchBalance();
      setShowModal(false);
    } catch (err) {
      setTxStatus("Error: " + (err.reason || err.message));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">⚡ P2P Energy Exchange</h2>
        {isConnected && (
          <button className="btn-primary" onClick={() => setShowModal(true)}>
            + New Trade
          </button>
        )}
      </div>

      {/* Balance card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card">
          <p className="text-sm text-gray-400 mb-1">ENRG Balance</p>
          <p className="text-3xl font-bold text-primary-500">{parseFloat(balance).toFixed(2)}</p>
          <p className="text-xs text-gray-500 mt-1">FaltricEnergyToken</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-400 mb-1">Token Contract</p>
          <p className="text-xs font-mono text-gray-300 break-all">
            {TOKEN_ADDRESS || "Not configured"}
          </p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-400 mb-1">Trade Engine</p>
          <p className="text-xs font-mono text-gray-300 break-all">
            {TRADE_ENGINE_ADDRESS || "Not configured"}
          </p>
        </div>
      </div>

      {!isConnected && (
        <div className="card text-center py-12 text-gray-500">
          <p className="text-4xl mb-3">🦊</p>
          <p className="text-lg font-medium text-gray-300">Connect your wallet to trade</p>
          <p className="text-sm mt-1">Use the "Connect Wallet" button in the navbar</p>
        </div>
      )}

      {txStatus && (
        <div className="card border-primary-600 text-primary-400 text-sm">{txStatus}</div>
      )}

      {showModal && (
        <TradeModal
          onConfirm={handleCreateTrade}
          onClose={() => setShowModal(false)}
          loading={loading}
        />
      )}
    </div>
  );
}
