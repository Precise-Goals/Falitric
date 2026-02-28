import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext.jsx";

export default function Login() {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState("login"); // 'login' | 'register'
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (mode === "login") {
        await login(email, password);
      } else {
        await register(email, password);
      }
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary-500">⚡ Faltric</h1>
          <p className="text-gray-400 mt-2">Decentralized P2P Energy Trading</p>
        </div>

        <div className="card">
          <div className="flex border-b border-gray-800 mb-6">
            <button
              className={`flex-1 pb-3 text-sm font-medium transition-colors ${
                mode === "login" ? "text-primary-500 border-b-2 border-primary-500" : "text-gray-500"
              }`}
              onClick={() => setMode("login")}
            >
              Sign In
            </button>
            <button
              className={`flex-1 pb-3 text-sm font-medium transition-colors ${
                mode === "register" ? "text-primary-500 border-b-2 border-primary-500" : "text-gray-500"
              }`}
              onClick={() => setMode("register")}
            >
              Register
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Email</label>
              <input
                type="email"
                className="input"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Password</label>
              <input
                type="password"
                className="input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                autoComplete={mode === "login" ? "current-password" : "new-password"}
              />
            </div>

            {error && (
              <div className="text-red-400 text-sm bg-red-900/20 border border-red-800 rounded-lg px-3 py-2">
                {error}
              </div>
            )}

            <button type="submit" className="btn-primary w-full py-2.5" disabled={loading}>
              {loading ? "Please wait..." : mode === "login" ? "Sign In" : "Create Account"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
