import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Navbar({ user, onLogout }) {
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const isAdmin = user?.role === "admin";
  const short = user?.wallet_address
    ? `${user.wallet_address.slice(0, 6)}...${user.wallet_address.slice(-4)}`
    : null;

  const NAV_LINKS = [
    { to: "/", label: "Dashboard", icon: "dashboard" },
    { to: "/gridmap", label: "Grid Map", icon: "map" },
    { to: "/exchange", label: "Exchange", icon: "swap_horiz" },
    { to: "/connect", label: "Connect & AI", icon: "hub" },
    ...(isAdmin
      ? [{ to: "/admin", label: "Admin", icon: "admin_panel_settings" }]
      : []),
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b-[3px] border-black bg-[#f5f7ee]/95 backdrop-blur-md px-6 py-3 flex items-center justify-between shrink-0 shadow-[0_4px_0_0_#000]">
      {/* Brand */}
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 bg-[#6b8a1e] text-white border-[3px] border-black flex items-center justify-center shadow-[3px_3px_0_0_#415514]">
          <span
            className="material-symbols-outlined font-bold"
            style={{ fontSize: "20px" }}
          >
            bolt
          </span>
        </div>
        <h1 className="text-2xl font-black uppercase tracking-wider text-black">
          Faltric
        </h1>
        {isAdmin && (
          <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 bg-[#415514] text-white text-[10px] font-black uppercase border-2 border-black tracking-wider">
            <span
              className="material-symbols-outlined"
              style={{ fontSize: "12px" }}
            >
              verified
            </span>
            Admin
          </span>
        )}
      </div>

      {/* Desktop nav */}
      <div className="hidden md:flex items-center gap-1">
        {NAV_LINKS.map(({ to, label, icon }) => {
          const active = pathname === to;
          return (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-1.5 px-4 py-2 text-sm font-bold border-[3px] transition-all uppercase ${
                active
                  ? "bg-[#6b8a1e] text-white border-[#415514] shadow-[3px_3px_0px_0px_#415514]"
                  : "border-transparent text-black hover:border-black hover:bg-black hover:text-white"
              }`}
            >
              <span
                className="material-symbols-outlined"
                style={{ fontSize: "16px" }}
              >
                {icon}
              </span>
              {label}
            </Link>
          );
        })}
      </div>

      {/* Wallet + logout */}
      <div className="flex items-center gap-3">
        {user?.name && (
          <span className="hidden lg:block text-xs font-bold text-gray-600 uppercase">
            {user.name.split(" ")[0]}
          </span>
        )}
        {short && (
          <div className="hidden lg:flex items-center gap-2 border-[3px] border-black px-3 py-1.5 bg-[#eef0e5] shadow-[2px_2px_0px_0px_#000]">
            <span
              className="material-symbols-outlined text-[#6b8a1e]"
              style={{ fontSize: "16px" }}
            >
              wallet
            </span>
            <span className="text-xs font-bold font-mono">{short}</span>
          </div>
        )}
        {onLogout && (
          <button
            onClick={onLogout}
            className="hidden sm:flex h-9 px-4 items-center gap-2 bg-white text-black text-xs font-bold uppercase border-[3px] border-black shadow-[3px_3px_0px_0px_#000] hover:bg-[#6b8a1e] hover:text-white hover:border-[#415514] transition-all"
          >
            <span
              className="material-symbols-outlined"
              style={{ fontSize: "16px" }}
            >
              logout
            </span>
            <span className="hidden lg:inline">Disconnect</span>
          </button>
        )}
        {/* Mobile hamburger */}
        <button
          className="md:hidden h-10 w-10 flex items-center justify-center border-[3px] border-black bg-white hover:bg-[#6b8a1e] hover:text-white transition-all"
          onClick={() => setMenuOpen((o) => !o)}
        >
          <span className="material-symbols-outlined">
            {menuOpen ? "close" : "menu"}
          </span>
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="absolute top-full left-0 right-0 bg-[#f5f7ee] border-b-[3px] border-black z-50 flex flex-col md:hidden shadow-[0_6px_0_0_#000]">
          {NAV_LINKS.map(({ to, label, icon }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setMenuOpen(false)}
              className={`flex items-center gap-3 px-6 py-4 font-bold uppercase text-sm border-b border-black/20 transition-colors ${
                pathname === to
                  ? "bg-[#6b8a1e] text-white"
                  : "hover:bg-[#d0db9f] text-black"
              }`}
            >
              <span
                className="material-symbols-outlined"
                style={{ fontSize: "18px" }}
              >
                {icon}
              </span>
              {label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
