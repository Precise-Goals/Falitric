import React, { useState, useCallback, useEffect } from "react";
import { ethers } from "ethers";
import { database, ref, get, set, update } from "../firebase";
import Navbar from "./Navbar";
import "./WalletAuth.css";

// ── Constants ─────────────────────────────────────────
const ADMIN_EMAIL = "test@admin.com";
const ADMIN_PASSWORD = "testadmin";

// ── Wallet address => safe Firebase key ───────────────
const walletKey = (addr) => addr.toLowerCase().replace(/[.#$[\]]/g, "_");

// ── Connect MetaMask ──────────────────────────────────
async function connectMetaMask() {
  if (!window.ethereum)
    throw new Error("MetaMask is not installed. Get it at metamask.io");
  const provider = new ethers.BrowserProvider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  const signer = await provider.getSigner();
  const address = await signer.getAddress();
  return { signer, address };
}

// ── Firebase: get user by wallet ──────────────────────
async function getUserByWallet(walletAddress) {
  const snap = await get(
    ref(database, `faltric_users/${walletKey(walletAddress)}`),
  );
  return snap.exists() ? snap.val() : null;
}

// ── Firebase: check email uniqueness ─────────────────
async function emailExists(email) {
  const snap = await get(ref(database, "faltric_users"));
  if (!snap.exists()) return false;
  return Object.values(snap.val()).some(
    (u) => u.email?.toLowerCase() === email.toLowerCase(),
  );
}

// ── Firebase: write new user ──────────────────────────
async function createUser(walletAddress, data) {
  await set(ref(database, `faltric_users/${walletKey(walletAddress)}`), {
    ...data,
    wallet_address: walletAddress.toLowerCase(),
    current_units: 0,
    token_balance: 1000, // starter tokens for demo
    role: "consumer",
    createdAt: Date.now(),
  });
}

// ── Signature verification ────────────────────────────
function verifySignature(message, signature, expectedAddress) {
  try {
    const recovered = ethers.verifyMessage(message, signature);
    return recovered.toLowerCase() === expectedAddress.toLowerCase();
  } catch {
    return false;
  }
}

// ─────────────────────────────────────────────────────
//  Neo input component
// ─────────────────────────────────────────────────────
const NeoInput = ({ label, id, ...props }) => (
  <div className="form-group">
    {label && <label htmlFor={id}>{label}</label>}
    <input id={id} className="neo-input" {...props} />
  </div>
);

// ─────────────────────────────────────────────────────
//  Screen 0: Admin Login (email + password — no wallet)
// ─────────────────────────────────────────────────────
function AdminLoginScreen({ onAdminSuccess, onSwitchToWallet }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    await new Promise((r) => setTimeout(r, 400)); // slight UX delay
    if (
      email.trim().toLowerCase() === ADMIN_EMAIL &&
      password === ADMIN_PASSWORD
    ) {
      const adminUser = {
        wallet_address: "admin",
        name: "Grid Admin",
        email: ADMIN_EMAIL,
        token_balance: 0,
        current_units: 0,
        role: "admin",
      };
      localStorage.setItem("faltric_user", JSON.stringify(adminUser));
      onAdminSuccess(adminUser);
    } else {
      setError("Invalid credentials. Check email and password.");
    }
    setLoading(false);
  };

  return (
    <div className="faltric-card">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          marginBottom: "6px",
        }}
      >
        <span
          className="material-symbols-outlined"
          style={{ color: "#6b8a1e", fontSize: "32px" }}
        >
          admin_panel_settings
        </span>
        <h2 style={{ margin: 0 }}>Admin Login</h2>
      </div>
      <span className="card-subtitle">
        Restricted access — Grid Controllers only
      </span>

      <form onSubmit={handleLogin} noValidate>
        <NeoInput
          label="Admin Email"
          id="admin-email"
          name="email"
          type="email"
          placeholder="test@admin.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <NeoInput
          label="Password"
          id="admin-password"
          name="password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          id="btn-admin-login"
          type="submit"
          className="btn-neo btn-green"
          disabled={loading}
          style={{ marginTop: "0.5rem" }}
        >
          {loading ? (
            <>
              <span className="spinner" /> Verifying…
            </>
          ) : (
            "🛡️ Enter Admin Panel"
          )}
        </button>
      </form>

      {error && <div className="faltric-status error">{error}</div>}

      <div className="mode-toggle">
        <button type="button" onClick={onSwitchToWallet}>
          ← Back to Wallet Login
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────
//  Screen 1: Connect Wallet
// ─────────────────────────────────────────────────────
function ConnectScreen({ onConnect, onAdminLogin, loading, error }) {
  return (
    <div className="faltric-card">
      <div className="faltric-connect-screen">
        <div className="wallet-icon">⚡</div>
        <div>
          <h2 style={{ color: "#fff", marginBottom: "0.5rem" }}>
            Wallet-First Access
          </h2>
          <p>
            Connect your MetaMask wallet to access Faltric's decentralised
            renewable energy marketplace.
          </p>
        </div>
        <button
          id="btn-connect-wallet"
          className="btn-neo btn-yellow"
          onClick={onConnect}
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="spinner" /> Connecting…
            </>
          ) : (
            <>🦊 Connect MetaMask</>
          )}
        </button>
        {error && <div className="faltric-status error">{error}</div>}
        <button
          className="btn-neo"
          onClick={onAdminLogin}
          style={{ background: "#6b8a1e", color: "#fff", marginTop: "4px" }}
        >
          🛡️ Admin Login
        </button>
        <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.3)" }}>
          No wallet?{" "}
          <a
            href="https://metamask.io/download/"
            target="_blank"
            rel="noreferrer"
            style={{ color: "#FBC02D" }}
          >
            Install MetaMask →
          </a>
        </p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────
//  Screen 2: Sign Up
// ─────────────────────────────────────────────────────
function SignupScreen({ walletAddress, signer, onSuccess, onSwitchToLogin }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    electricity_consumer_number: "",
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSignup = async (e) => {
    e.preventDefault();
    if (
      !form.name ||
      !form.email ||
      !form.phone ||
      !form.electricity_consumer_number
    )
      return setStatus({ type: "error", msg: "All fields are required." });

    setLoading(true);
    setStatus(null);

    try {
      if (await emailExists(form.email))
        return setStatus({
          type: "error",
          msg: "An account with this email already exists.",
        });

      setStatus({
        type: "info",
        msg: "Please sign the message in MetaMask to verify wallet ownership…",
      });

      const message = `Register on Faltric\nWallet: ${walletAddress.toLowerCase()}\nTimestamp: ${Date.now()}`;
      const signature = await signer.signMessage(message);

      if (!verifySignature(message, signature, walletAddress))
        return setStatus({ type: "error", msg: "Wallet signature invalid." });

      await createUser(walletAddress, {
        name: form.name.trim(),
        email: form.email.toLowerCase().trim(),
        phone: form.phone.trim(),
        electricity_consumer_number: form.electricity_consumer_number.trim(),
      });

      const userData = {
        wallet_address: walletAddress.toLowerCase(),
        name: form.name.trim(),
        email: form.email.toLowerCase().trim(),
        token_balance: 1000,
        current_units: 0,
        role: "consumer",
      };

      localStorage.setItem("faltric_user", JSON.stringify(userData));
      setStatus({ type: "success", msg: "Welcome to Faltric! 🌿" });
      setTimeout(() => onSuccess(userData), 700);
    } catch (err) {
      if (err.code === "ACTION_REJECTED")
        setStatus({
          type: "error",
          msg: "Signature cancelled. Please try again.",
        });
      else setStatus({ type: "error", msg: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="faltric-card">
      <h2>Create Account</h2>
      <span className="card-subtitle">
        New wallet detected — register to start trading energy
      </span>

      <div className="wallet-badge">
        <span className="dot" />
        <span className="addr">{walletAddress}</span>
      </div>

      <form onSubmit={handleSignup} noValidate>
        <NeoInput
          label="Full Name"
          id="signup-name"
          name="name"
          type="text"
          placeholder="Sarthak Patil"
          value={form.name}
          onChange={handleChange}
          required
        />
        <div className="form-row">
          <NeoInput
            label="Email"
            id="signup-email"
            name="email"
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={handleChange}
            required
          />
          <NeoInput
            label="Phone"
            id="signup-phone"
            name="phone"
            type="tel"
            placeholder="+91 9876543210"
            value={form.phone}
            onChange={handleChange}
            required
          />
        </div>
        <NeoInput
          label="Electricity Consumer Number"
          id="signup-consumer"
          name="electricity_consumer_number"
          type="text"
          placeholder="MH12345678"
          value={form.electricity_consumer_number}
          onChange={handleChange}
          required
        />
        <button
          id="btn-signup-submit"
          type="submit"
          className="btn-neo btn-green"
          disabled={loading}
          style={{ marginTop: "0.5rem" }}
        >
          {loading ? (
            <>
              <span className="spinner" /> Processing…
            </>
          ) : (
            "🌿 Create Faltric Account"
          )}
        </button>
      </form>

      {status && (
        <div className={`faltric-status ${status.type}`}>{status.msg}</div>
      )}
      <div className="mode-toggle">
        <button type="button" onClick={onSwitchToLogin}>
          Already have an account? Sign in instead
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────
//  Screen 3: Login
// ─────────────────────────────────────────────────────
function LoginScreen({ walletAddress, signer, onSuccess, onSwitchToSignup }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email) return setStatus({ type: "error", msg: "Email is required." });

    setLoading(true);
    setStatus(null);

    try {
      const user = await getUserByWallet(walletAddress);
      if (!user)
        return setStatus({
          type: "error",
          msg: "No account found for this wallet. Please sign up.",
        });
      if (user.email?.toLowerCase() !== email.toLowerCase())
        return setStatus({
          type: "error",
          msg: "Email does not match the account registered to this wallet.",
        });

      setStatus({
        type: "info",
        msg: "Sign the verification message in MetaMask…",
      });

      const message = `Sign in to Faltric\nWallet: ${walletAddress.toLowerCase()}\nTimestamp: ${Date.now()}`;
      const signature = await signer.signMessage(message);

      if (!verifySignature(message, signature, walletAddress))
        return setStatus({ type: "error", msg: "Wallet signature invalid." });

      // Sync fresh balance from Firebase
      const freshUser = await getUserByWallet(walletAddress);
      const { password: _p, ...safe } = freshUser || user;
      localStorage.setItem("faltric_user", JSON.stringify(safe));
      setStatus({ type: "success", msg: "Welcome back! 🌿" });
      setTimeout(() => onSuccess(safe), 600);
    } catch (err) {
      if (err.code === "ACTION_REJECTED")
        setStatus({
          type: "error",
          msg: "Signature cancelled. Please try again.",
        });
      else setStatus({ type: "error", msg: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="faltric-card">
      <h2>Sign In</h2>
      <span className="card-subtitle">
        Wallet recognised — confirm your email to continue
      </span>

      <div className="wallet-badge">
        <span className="dot" />
        <span className="addr">{walletAddress}</span>
      </div>

      <form onSubmit={handleLogin} noValidate>
        <NeoInput
          label="Email"
          id="login-email"
          name="email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button
          id="btn-login-submit"
          type="submit"
          className="btn-neo btn-green"
          disabled={loading}
          style={{ marginTop: "0.5rem" }}
        >
          {loading ? (
            <>
              <span className="spinner" /> Verifying…
            </>
          ) : (
            "⚡ Sign In & Verify Wallet"
          )}
        </button>
      </form>

      {status && (
        <div className={`faltric-status ${status.type}`}>{status.msg}</div>
      )}
      <div className="mode-toggle">
        <button type="button" onClick={onSwitchToSignup}>
          New wallet? Create an account
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────
//  WalletAuth Gate (root export)
// ─────────────────────────────────────────────────────
export default function WalletAuth({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("faltric_user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [walletAddress, setWalletAddress] = useState(null);
  const [signer, setSigner] = useState(null);
  const [screen, setScreen] = useState("connect");
  const [connectLoading, setConnectLoading] = useState(false);
  const [connectError, setConnectError] = useState(null);

  // Sync balance from Firebase on mount (for non-admin)
  useEffect(() => {
    if (!user || user.role === "admin" || !user.wallet_address) return;
    get(ref(database, `faltric_users/${walletKey(user.wallet_address)}`)).then(
      (snap) => {
        if (snap.exists()) {
          const fresh = { ...user, ...snap.val() };
          setUser(fresh);
          localStorage.setItem("faltric_user", JSON.stringify(fresh));
        }
      },
    );
  }, []); // eslint-disable-line

  const handleConnect = useCallback(async () => {
    setConnectLoading(true);
    setConnectError(null);
    try {
      const { signer: s, address } = await connectMetaMask();
      setWalletAddress(address);
      setSigner(s);
      const existing = await getUserByWallet(address);
      setScreen(existing ? "login" : "signup");
    } catch (err) {
      setConnectError(err.message);
    } finally {
      setConnectLoading(false);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("faltric_user");
    setUser(null);
    setWalletAddress(null);
    setSigner(null);
    setScreen("connect");
  };

  if (user) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar user={user} onLogout={handleLogout} />
        <div className="flex-1 flex flex-col">
          {typeof children === "function" ? children(user) : children}
        </div>
      </div>
    );
  }

  return (
    <div className="faltric-auth-gate">
      <div className="faltric-brand">
        <span className="brand-tag">Execute Hackathon 2026</span>
        <h1>Faltric</h1>
        <p>Decentralised Renewable Energy Marketplace</p>
      </div>

      {screen === "connect" && (
        <ConnectScreen
          onConnect={handleConnect}
          onAdminLogin={() => setScreen("admin")}
          loading={connectLoading}
          error={connectError}
        />
      )}
      {screen === "admin" && (
        <AdminLoginScreen
          onAdminSuccess={setUser}
          onSwitchToWallet={() => setScreen("connect")}
        />
      )}
      {screen === "signup" && walletAddress && (
        <SignupScreen
          walletAddress={walletAddress}
          signer={signer}
          onSuccess={setUser}
          onSwitchToLogin={() => setScreen("login")}
        />
      )}
      {screen === "login" && walletAddress && (
        <LoginScreen
          walletAddress={walletAddress}
          signer={signer}
          onSuccess={setUser}
          onSwitchToSignup={() => setScreen("signup")}
        />
      )}
    </div>
  );
}
