import { useState } from "react";

export default function TradeModal({ onConfirm, onClose, loading }) {
  const [buyerAddress, setBuyerAddress] = useState("");
  const [tokenAmount, setTokenAmount] = useState("");
  const [ethAmount, setEthAmount] = useState("");
  const [error, setError] = useState("");

  function validate() {
    if (!/^0x[a-fA-F0-9]{40}$/.test(buyerAddress)) return "Invalid buyer address";
    if (!tokenAmount || parseFloat(tokenAmount) <= 0) return "Token amount must be > 0";
    if (!ethAmount || parseFloat(ethAmount) <= 0) return "ETH amount must be > 0";
    return null;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const err = validate();
    if (err) { setError(err); return; }
    setError("");
    onConfirm({ buyerAddress, tokenAmount: parseFloat(tokenAmount), ethAmount: parseFloat(ethAmount) });
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="card w-full max-w-md shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">Create New Trade</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-white text-xl">×</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Buyer Wallet Address</label>
            <input
              className="input"
              placeholder="0x..."
              value={buyerAddress}
              onChange={(e) => setBuyerAddress(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">ENRG Token Amount</label>
            <input
              type="number"
              step="0.001"
              min="0"
              className="input"
              placeholder="e.g. 10.5"
              value={tokenAmount}
              onChange={(e) => setTokenAmount(e.target.value)}
              required
            />
            <p className="text-xs text-gray-500 mt-1">1 ENRG = 1 kWh</p>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Price in ETH (buyer pays)</label>
            <input
              type="number"
              step="0.0001"
              min="0"
              className="input"
              placeholder="e.g. 0.01"
              value={ethAmount}
              onChange={(e) => setEthAmount(e.target.value)}
              required
            />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn-primary flex-1">
              {loading ? "Processing..." : "Lock Trade"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
