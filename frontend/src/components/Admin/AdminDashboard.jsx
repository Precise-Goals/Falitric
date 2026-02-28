import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext.jsx";

export default function AdminDashboard() {
  const { authFetch } = useAuth();
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectModal, setShowRejectModal] = useState(null);
  const [stats, setStats] = useState({ total: 0, approved: 0, rejected: 0, pending: 0 });

  useEffect(() => {
    fetchPending();
    fetchStats();
  }, []);

  async function fetchPending() {
    setLoading(true);
    try {
      const res = await authFetch("/api/installations/admin/pending");
      const data = await res.json();
      setPending(data.installations || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function fetchStats() {
    try {
      const res = await authFetch("/api/installations?verified=false");
      // Simplified: just show pending count
    } catch {}
  }

  async function approve(id) {
    setActionId(id);
    try {
      const res = await authFetch(`/api/installations/${id}/approve`, { method: "PATCH" });
      if (res.ok) {
        setPending((prev) => prev.filter((i) => i._id !== id));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionId(null);
    }
  }

  async function reject(id, reason) {
    setActionId(id);
    try {
      const res = await authFetch(`/api/installations/${id}/reject`, {
        method: "PATCH",
        body: JSON.stringify({ reason }),
      });
      if (res.ok) {
        setPending((prev) => prev.filter((i) => i._id !== id));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionId(null);
      setShowRejectModal(null);
      setRejectReason("");
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold">🛡️ Admin Dashboard</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Pending Approvals", value: pending.length, color: "text-yellow-400" },
          { label: "Total Approved", value: "—", color: "text-green-400" },
          { label: "Total Rejected", value: "—", color: "text-red-400" },
          { label: "Active Users", value: "—", color: "text-blue-400" },
        ].map((s) => (
          <div key={s.label} className="card">
            <p className="text-xs text-gray-400">{s.label}</p>
            <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="card">
        <h3 className="font-semibold mb-4">Pending Installation Approvals</h3>

        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : pending.length === 0 ? (
          <p className="text-gray-500 text-center py-8">✅ No pending approvals</p>
        ) : (
          <div className="space-y-3">
            {pending.map((inst) => (
              <div
                key={inst._id}
                className="flex items-center justify-between bg-gray-800 rounded-lg p-4"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{inst.name}</span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded capitalize ${
                        inst.type === "solar"
                          ? "bg-yellow-900/40 text-yellow-400"
                          : inst.type === "wind"
                          ? "bg-blue-900/40 text-blue-400"
                          : "bg-green-900/40 text-green-400"
                      }`}
                    >
                      {inst.type}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400">
                    Owner: {inst.owner?.email || "—"} •{" "}
                    <span className="font-mono text-xs">
                      {inst.walletAddress?.slice(0, 10)}...
                    </span>
                  </p>
                  <p className="text-sm text-gray-400">Capacity: {inst.capacityKw} kW</p>
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => approve(inst._id)}
                    disabled={actionId === inst._id}
                    className="btn-primary text-sm py-1.5 px-4"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => setShowRejectModal(inst._id)}
                    disabled={actionId === inst._id}
                    className="px-4 py-1.5 bg-red-900/40 hover:bg-red-800 text-red-400 hover:text-white rounded-lg text-sm transition-colors"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Reject modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="card w-full max-w-md">
            <h3 className="font-semibold mb-4">Reject Installation</h3>
            <textarea
              className="input mb-4 h-24 resize-none"
              placeholder="Reason for rejection..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />
            <div className="flex gap-3">
              <button
                onClick={() => { setShowRejectModal(null); setRejectReason(""); }}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                onClick={() => reject(showRejectModal, rejectReason)}
                className="flex-1 px-4 py-2 bg-red-700 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
              >
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
