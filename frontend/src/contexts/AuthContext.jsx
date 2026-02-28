import { createContext, useContext, useState, useEffect, useCallback } from "react";

const AuthContext = createContext(null);

const API_BASE = import.meta.env.VITE_API_URL || "/api";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("faltric_token"));
  const [loading, setLoading] = useState(true);

  // Fetch user profile on mount / token change
  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    fetchMe();
  }, [token]);

  async function fetchMe() {
    try {
      const res = await fetch(`${API_BASE}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Unauthorized");
      const data = await res.json();
      setUser(data.user);
    } catch {
      logout();
    } finally {
      setLoading(false);
    }
  }

  async function login(email, password) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Login failed");
    saveSession(data.token, data.user);
    return data.user;
  }

  async function register(email, password) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Registration failed");
    saveSession(data.token, data.user);
    return data.user;
  }

  async function linkWallet(walletAddress) {
    const res = await fetch(`${API_BASE}/auth/link-wallet`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ walletAddress }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to link wallet");
    saveSession(data.token, data.user);
    return data.user;
  }

  function saveSession(newToken, newUser) {
    localStorage.setItem("faltric_token", newToken);
    setToken(newToken);
    setUser(newUser);
  }

  function logout() {
    localStorage.removeItem("faltric_token");
    setToken(null);
    setUser(null);
  }

  const authFetch = useCallback(
    async (url, options = {}) => {
      return fetch(url, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...(options.headers || {}),
          Authorization: `Bearer ${token}`,
        },
      });
    },
    [token]
  );

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, linkWallet, logout, authFetch }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
