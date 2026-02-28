import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../contexts/AuthContext.jsx";
import { useWeb3 } from "../../contexts/Web3Context.jsx";
import NodePopup from "./NodePopup.jsx";

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN || "";

const TYPE_COLORS = {
  solar: "#facc15",
  wind: "#60a5fa",
  biogas: "#4ade80",
};

export default function GridMap() {
  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const drawRef = useRef(null);
  const markersRef = useRef([]);
  const { authFetch, user } = useAuth();
  const { walletAddress } = useWeb3();
  const [selectedNode, setSelectedNode] = useState(null);
  const [installations, setInstallations] = useState([]);
  const [adminMode, setAdminMode] = useState(false);
  const [mapError, setMapError] = useState(null);

  useEffect(() => {
    if (!MAPBOX_TOKEN) {
      setMapError("Mapbox token not configured. Set VITE_MAPBOX_TOKEN in your .env.");
      return;
    }

    let mapboxgl, MapboxDraw;

    async function initMap() {
      try {
        mapboxgl = (await import("mapbox-gl")).default;
        mapboxgl.accessToken = MAPBOX_TOKEN;

        const map = new mapboxgl.Map({
          container: mapContainer.current,
          style: "mapbox://styles/mapbox/dark-v11",
          center: [0, 20],
          zoom: 2,
        });

        map.addControl(new mapboxgl.NavigationControl(), "top-right");
        mapRef.current = map;

        // Admin draw tool
        if (user?.role === "admin") {
          const DrawModule = await import("@mapbox/mapbox-gl-draw");
          MapboxDraw = DrawModule.default;
          const draw = new MapboxDraw({
            displayControlsDefault: false,
            controls: { polygon: true, trash: true },
          });
          drawRef.current = draw;
          map.addControl(draw, "top-left");
        }

        map.on("load", fetchAndRenderInstallations);
      } catch (err) {
        setMapError("Failed to load map: " + err.message);
      }
    }

    initMap();

    return () => {
      markersRef.current.forEach((m) => m.remove());
      mapRef.current?.remove();
    };
  }, [user]);

  async function fetchAndRenderInstallations() {
    try {
      const res = await authFetch("/api/installations");
      const data = await res.json();
      setInstallations(data.installations || []);
      renderMarkers(data.installations || []);
    } catch (err) {
      console.error("Failed to load installations:", err);
    }
  }

  function renderMarkers(insts) {
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    if (!mapRef.current) return;

    // mapboxgl is already available via the module-level import inside initMap;
    // use the stored ref to avoid re-importing inside the loop.
    import("mapbox-gl").then(({ default: mapboxgl }) => {
      insts.forEach((inst) => {
        const [lng, lat] = inst.coordinates?.coordinates || [0, 0];
        const color = TYPE_COLORS[inst.type] || "#fff";

        const el = document.createElement("div");
        el.className = "cursor-pointer";
        el.innerHTML = `<div style="
          width:16px;height:16px;
          background:${color};
          border-radius:50%;
          border:2px solid white;
          box-shadow:0 0 8px ${color};
        "></div>`;
        el.addEventListener("click", () => setSelectedNode(inst));

        if (mapRef.current) {
          const marker = new mapboxgl.Marker({ element: el })
            .setLngLat([lng, lat])
            .addTo(mapRef.current);
          markersRef.current.push(marker);
        }
      });
    });
  }

  return (
    <div className="relative h-full">
      <div className="absolute top-4 left-4 z-10 flex gap-2">
        <div className="card py-2 px-3 flex gap-4 text-xs">
          {Object.entries(TYPE_COLORS).map(([type, color]) => (
            <span key={type} className="flex items-center gap-1.5 capitalize">
              <span className="w-3 h-3 rounded-full" style={{ background: color }}></span>
              {type}
            </span>
          ))}
        </div>
        {user?.role === "admin" && (
          <button
            className={`btn-${adminMode ? "primary" : "secondary"} text-xs`}
            onClick={() => setAdminMode(!adminMode)}
          >
            {adminMode ? "✏️ Drawing Mode ON" : "✏️ Draw Zone"}
          </button>
        )}
      </div>

      {mapError ? (
        <div className="flex items-center justify-center h-full">
          <div className="card text-yellow-400 max-w-md text-center">
            <p className="text-2xl mb-2">🗺️</p>
            <p className="font-semibold mb-1">Map Unavailable</p>
            <p className="text-sm text-gray-400">{mapError}</p>
          </div>
        </div>
      ) : (
        <div ref={mapContainer} className="w-full h-full rounded-xl" />
      )}

      {selectedNode && (
        <NodePopup node={selectedNode} onClose={() => setSelectedNode(null)} />
      )}
    </div>
  );
}
