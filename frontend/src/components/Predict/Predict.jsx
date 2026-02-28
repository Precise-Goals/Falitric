import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext.jsx";

export default function Predict() {
  const { authFetch } = useAuth();
  const [installations, setInstallations] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    authFetch("/api/installations/my")
      .then((r) => r.json())
      .then((d) => {
        setInstallations(d.installations || []);
        if (d.installations?.length > 0) setSelectedId(d.installations[0]._id);
      })
      .catch(console.error);
  }, []);

  async function fetchPrediction() {
    if (!selectedId) return;
    setLoading(true);
    setError("");
    setPrediction(null);
    try {
      const res = await authFetch(`/api/predict/${selectedId}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Prediction failed");
      setPrediction(data.prediction);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const sourceIcons = { solar: "☀️", wind: "🌬️", biogas: "🌿" };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold">🤖 AI Energy Recommendations</h2>

      {installations.length === 0 ? (
        <div className="card text-center py-12 text-gray-500">
          <p className="text-4xl mb-3">🔋</p>
          <p>No installations found. Add one to get AI recommendations.</p>
        </div>
      ) : (
        <div className="card space-y-4">
          <div className="flex gap-3">
            <select
              className="input flex-1"
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
            >
              {installations.map((inst) => (
                <option key={inst._id} value={inst._id}>
                  {inst.name} ({inst.type})
                </option>
              ))}
            </select>
            <button onClick={fetchPrediction} disabled={loading} className="btn-primary px-6">
              {loading ? "Analyzing..." : "Get Prediction"}
            </button>
          </div>

          {error && (
            <div className="text-red-400 text-sm bg-red-900/20 border border-red-800 rounded-lg px-3 py-2">
              {error}
            </div>
          )}
        </div>
      )}

      {prediction && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="card">
              <p className="text-sm text-gray-400 mb-1">Recommended Source</p>
              <p className="text-2xl font-bold text-primary-500">
                {sourceIcons[prediction.recommended_source] || "⚡"}{" "}
                <span className="capitalize">{prediction.recommended_source}</span>
              </p>
            </div>
            <div className="card">
              <p className="text-sm text-gray-400 mb-1">Efficiency Score</p>
              <div className="flex items-end gap-2">
                <p className="text-2xl font-bold text-white">{prediction.score?.toFixed(2)}</p>
                <p className="text-gray-500 text-sm mb-0.5">/ 100</p>
              </div>
              <div className="mt-2 h-2 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary-500 rounded-full transition-all"
                  style={{ width: `${Math.min(100, prediction.score || 0)}%` }}
                ></div>
              </div>
            </div>
            <div className="card">
              <p className="text-sm text-gray-400 mb-1">Estimated Earnings</p>
              <p className="text-2xl font-bold text-green-400">
                {prediction.estimated_earnings?.toFixed(4)} ETH
              </p>
            </div>
            {prediction.report_url && (
              <div className="card flex items-center">
                <a
                  href={prediction.report_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary w-full text-center"
                >
                  📄 Download PDF Report
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
