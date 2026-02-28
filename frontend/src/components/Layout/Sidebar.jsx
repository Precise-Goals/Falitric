import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext.jsx";
import { useWeb3 } from "../../contexts/Web3Context.jsx";

const navItems = [
  { path: "/", label: "Grid Map", icon: "🗺️" },
  { path: "/exchange", label: "Exchange", icon: "⚡" },
  { path: "/predict", label: "Predict", icon: "🤖" },
  { path: "/connect", label: "Connect", icon: "💬" },
];

export default function Sidebar() {
  const { pathname } = useLocation();
  const { user } = useAuth();

  return (
    <aside className="w-56 bg-gray-900 border-r border-gray-800 flex flex-col py-6 px-3 shrink-0">
      <div className="mb-8 px-2">
        <h1 className="text-xl font-bold text-primary-500">⚡ Faltric</h1>
        <p className="text-xs text-gray-500 mt-1">P2P Energy Trading</p>
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              pathname === item.path
                ? "bg-primary-600 text-white"
                : "text-gray-400 hover:bg-gray-800 hover:text-white"
            }`}
          >
            <span>{item.icon}</span>
            {item.label}
          </Link>
        ))}

        {user?.role === "admin" && (
          <Link
            to="/admin"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              pathname === "/admin"
                ? "bg-primary-600 text-white"
                : "text-gray-400 hover:bg-gray-800 hover:text-white"
            }`}
          >
            <span>🛡️</span>
            Admin
          </Link>
        )}
      </nav>

      <div className="mt-auto px-2">
        <p className="text-xs text-gray-600 truncate">{user?.email}</p>
      </div>
    </aside>
  );
}
