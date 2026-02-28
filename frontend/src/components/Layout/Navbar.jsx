import { useAuth } from "../../contexts/AuthContext.jsx";
import { useWeb3 } from "../../contexts/Web3Context.jsx";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { walletAddress, connectWallet, disconnectWallet, isConnected, formatAddress, connecting } = useWeb3();

  return (
    <header className="h-14 bg-gray-900 border-b border-gray-800 flex items-center justify-between px-6 shrink-0">
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-400">
          {user?.role === "admin" && (
            <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-400 rounded text-xs mr-2">
              Admin
            </span>
          )}
          Welcome, {user?.email?.split("@")[0]}
        </span>
      </div>

      <div className="flex items-center gap-3">
        {isConnected ? (
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-400 rounded-full"></span>
            <span className="text-sm text-gray-300 font-mono">{formatAddress(walletAddress)}</span>
            <button
              onClick={disconnectWallet}
              className="text-xs text-gray-500 hover:text-red-400 transition-colors"
            >
              Disconnect
            </button>
          </div>
        ) : (
          <button
            onClick={connectWallet}
            disabled={connecting}
            className="btn-primary text-sm py-1.5"
          >
            {connecting ? "Connecting..." : "Connect Wallet"}
          </button>
        )}

        <button
          onClick={logout}
          className="text-sm text-gray-400 hover:text-red-400 transition-colors px-3 py-1.5"
        >
          Sign Out
        </button>
      </div>
    </header>
  );
}
