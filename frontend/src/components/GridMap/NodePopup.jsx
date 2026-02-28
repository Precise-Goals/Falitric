const TYPE_LABELS = { solar: "☀️ Solar", wind: "🌬️ Wind", biogas: "🌿 Biogas" };

export default function NodePopup({ node, onClose }) {
  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 w-72">
      <div className="card shadow-2xl border-gray-700">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-semibold text-white">{node.name || "Energy Node"}</h3>
            <span className="text-xs text-gray-400">{TYPE_LABELS[node.type] || node.type}</span>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white text-lg leading-none">
            ×
          </button>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">Owner</span>
            <span className="font-mono text-gray-300 text-xs">
              {typeof node.owner === "string" ? node.owner : `${String(node.owner).slice(0, 8)}...`}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Capacity</span>
            <span className="text-white">{node.capacityKw} kW</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Status</span>
            <span
              className={`px-2 py-0.5 rounded text-xs ${
                node.verified
                  ? "bg-green-900/40 text-green-400"
                  : "bg-yellow-900/40 text-yellow-400"
              }`}
            >
              {node.status || (node.verified ? "Verified" : "Pending")}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Coordinates</span>
            <span className="text-gray-300 text-xs">
              {node.coordinates?.coordinates?.[1]?.toFixed(4)},{" "}
              {node.coordinates?.coordinates?.[0]?.toFixed(4)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
