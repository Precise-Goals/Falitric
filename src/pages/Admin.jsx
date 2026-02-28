// Admin Grid Controller — admin-only, with real Google Maps + polygon zone drawing
import { useEffect, useRef, useState } from "react";
import { database, ref, push, onValue } from "../firebase";

const VERIFICATIONS = [
  {
    id: "Solar Array #402",
    zone: "Zone B",
    amount: "45kWh",
    icon: "solar_power",
  },
  { id: "Wind Turbine X-1", zone: "Zone A", amount: "120kWh", icon: "air" },
  {
    id: "Storage Unit 99",
    zone: "Zone C",
    amount: "500kWh",
    icon: "battery_charging_full",
  },
  {
    id: "Smart Meter #8812",
    zone: "Zone A",
    amount: "Monitoring",
    icon: "home_iot_device",
  },
];

const STATS = [
  { label: "Total Output", value: "45.2 MW" },
  { label: "Active Zones", value: "18" },
  { label: "Carbon Offset", value: "12.5 T" },
  { label: "Pending", value: "6 Nodes", dark: true },
];

export default function Admin({ user }) {
  const mapRef = useRef(null);
  const mapObj = useRef(null);
  const drawMgrRef = useRef(null);
  const polygonsRef = useRef([]);

  const [drawMode, setDrawMode] = useState(false);
  const [activity, setActivity] = useState([]);
  const [zones, setZones] = useState([]);
  const [mapLoaded, setMapLoaded] = useState(false);

  // ── Load activity from Firebase ──────────────────────
  useEffect(() => {
    const unsub = onValue(ref(database, "faltric_trades"), (snap) => {
      if (snap.exists()) {
        const all = Object.entries(snap.val())
          .map(([id, v]) => ({ id, ...v }))
          .sort((a, b) => b.timestamp - a.timestamp)
          .slice(0, 10);
        setActivity(all);
      }
    });
    return () => unsub();
  }, []);

  // ── Load zones from Firebase ─────────────────────────
  useEffect(() => {
    const unsub = onValue(ref(database, "faltric_zones"), (snap) => {
      if (snap.exists()) {
        const all = Object.entries(snap.val()).map(([id, v]) => ({ id, ...v }));
        setZones(all);
      }
    });
    return () => unsub();
  }, []);

  // ── Load Google Maps ─────────────────────────────────
  useEffect(() => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    if (!apiKey || apiKey === "your_google_maps_api_key_here") {
      setMapLoaded(false);
      return;
    }

    const loadMap = () => {
      if (!mapRef.current) return;
      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat: 18.531581, lng: 73.867048 },
        zoom: 13,
        mapTypeId: "hybrid",
        streetViewControl: false,
        mapTypeControl: false,
        styles: [
          { featureType: "poi", stylers: [{ visibility: "off" }] },
          { featureType: "transit", stylers: [{ visibility: "off" }] },
          {
            featureType: "water",
            elementType: "geometry",
            stylers: [{ color: "#1e3a2f" }],
          },
        ],
      });
      mapObj.current = map;

      // Drawing Manager
      const drawingManager = new window.google.maps.drawing.DrawingManager({
        drawingMode: null,
        drawingControl: false,
        polygonOptions: {
          fillColor: "#6b8a1e",
          fillOpacity: 0.35,
          strokeColor: "#415514",
          strokeOpacity: 1,
          strokeWeight: 3,
          editable: true,
          zIndex: 1,
        },
      });
      drawingManager.setMap(map);
      drawMgrRef.current = drawingManager;

      // On polygon complete — save to Firebase
      window.google.maps.event.addListener(
        drawingManager,
        "polygoncomplete",
        (polygon) => {
          const coords = polygon
            .getPath()
            .getArray()
            .map((latlng) => ({
              lat: latlng.lat(),
              lng: latlng.lng(),
            }));
          push(ref(database, "faltric_zones"), {
            coords,
            name: `Zone ${Date.now()}`,
            createdBy: user?.email || "admin",
            createdAt: Date.now(),
            status: "active",
          }).then(() => {
            console.log("Zone saved to Firebase");
          });

          // Turn off drawing mode after each polygon
          drawingManager.setDrawingMode(null);
          setDrawMode(false);
        },
      );

      setMapLoaded(true);
    };

    if (window.google?.maps?.drawing) {
      loadMap();
    } else if (!document.getElementById("gmap-script")) {
      const script = document.createElement("script");
      script.id = "gmap-script";
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=drawing&callback=__falAdminMapInit`;
      script.async = true;
      script.defer = true;
      window.__falAdminMapInit = loadMap;
      document.body.appendChild(script);
    } else {
      // Script loading, wait for callback
      window.__falAdminMapInit = loadMap;
    }
  }, [user?.email]);

  // ── Render zone polygons from Firebase ──────────────
  useEffect(() => {
    if (!mapObj.current || !window.google?.maps) return;
    // Clear old
    polygonsRef.current.forEach((p) => p.setMap(null));
    polygonsRef.current = [];
    // Draw new
    zones.forEach((z) => {
      if (!z.coords) return;
      const poly = new window.google.maps.Polygon({
        paths: z.coords,
        fillColor: "#6b8a1e",
        fillOpacity: 0.25,
        strokeColor: "#415514",
        strokeOpacity: 0.9,
        strokeWeight: 2,
        map: mapObj.current,
      });
      const infoWin = new window.google.maps.InfoWindow({
        content: `<div style="font-family:sans-serif;padding:8px;min-width:160px">
          <strong style="font-size:14px">${z.name || "Zone"}</strong>
          <p style="font-size:12px;color:#555;margin:4px 0">Status: ${z.status || "active"}</p>
          <p style="font-size:11px;color:#777;margin:4px 0">Created by: ${z.createdBy || "admin"}</p>
        </div>`,
      });
      poly.addListener("click", (e) =>
        infoWin.open({ map: mapObj.current, anchor: poly, latLng: e.latLng }),
      );
      polygonsRef.current.push(poly);
    });
  }, [zones, mapLoaded]);

  // ── Toggle draw mode ──────────────────────────────────
  const toggleDraw = () => {
    if (!drawMgrRef.current) return;
    const next = !drawMode;
    setDrawMode(next);
    drawMgrRef.current.setDrawingMode(
      next ? window.google.maps.drawing.OverlayType.POLYGON : null,
    );
  };

  return (
    <div className="flex flex-col p-4 md:p-6 gap-8 min-h-screen bg-[#eef0e5]">
      {/* Page header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 border-b-4 border-black pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#6b8a1e] mb-2">
            <span
              className="material-symbols-outlined"
              style={{ fontSize: "14px" }}
            >
              admin_panel_settings
            </span>
            <span>Admin</span>
            <span>/</span>
            <span className="bg-[#d0db9f] px-1 border border-[#6b8a1e]">
              Grid Management
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">
            Grid Controller
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="size-3 bg-[#6b8a1e] rounded-full border border-black animate-pulse" />
          <span className="text-xs font-mono font-bold">SYSTEM ONLINE</span>
          <span className="px-2 py-1 bg-[#1e2809] text-[#8faa3a] text-[10px] font-black uppercase border-2 border-[#415514]">
            ADMIN MODE
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Map */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="relative w-full h-[460px] border-4 border-black shadow-[8px_8px_0px_0px_#415514] overflow-hidden">
            {/* Real Google Maps */}
            <div
              ref={mapRef}
              className="absolute inset-0"
              style={{ height: "100%", width: "100%" }}
            />

            {/* Fallback if no API key */}
            {!mapLoaded && (
              <div className="absolute inset-0 bg-[#eef0e5]">
                <div
                  className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage:
                      "linear-gradient(#415514 1px,transparent 1px),linear-gradient(90deg,#415514 1px,transparent 1px)",
                    backgroundSize: "40px 40px",
                  }}
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-[#415514]">
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: "48px" }}
                  >
                    map
                  </span>
                  <span className="font-black text-lg uppercase tracking-widest">
                    Google Maps — API Key Required
                  </span>
                  <span className="text-sm font-mono text-[#6b8a1e]">
                    Add VITE_GOOGLE_MAPS_API_KEY to .env
                  </span>
                </div>
              </div>
            )}

            {/* Zone tool overlay */}
            {mapLoaded && (
              <div className="absolute top-4 left-4 z-10 bg-white border-2 border-black shadow-[4px_4px_0px_0px_#415514] p-4 w-60">
                <h3 className="font-black uppercase text-sm border-b-2 border-black pb-1 mb-3 flex items-center gap-2">
                  <span
                    className="material-symbols-outlined text-[#6b8a1e]"
                    style={{ fontSize: "16px" }}
                  >
                    draw
                  </span>
                  Zone Definition
                </h3>
                <p className="text-gray-600 text-xs font-mono mb-3">
                  Draw polygons on the map to define P2P trading zones.
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={toggleDraw}
                    className={`flex items-center justify-center gap-1.5 h-10 border-2 border-black text-xs font-bold uppercase transition-all ${
                      drawMode
                        ? "bg-[#6b8a1e] text-white shadow-none translate-x-[1px] translate-y-[1px]"
                        : "bg-black text-white shadow-[2px_2px_0px_0px_#415514] hover:bg-[#6b8a1e]"
                    }`}
                  >
                    <span
                      className="material-symbols-outlined"
                      style={{ fontSize: "14px" }}
                    >
                      {drawMode ? "stop_circle" : "draw"}
                    </span>
                    {drawMode ? "Stop" : "Draw"}
                  </button>
                  <button
                    onClick={() => {
                      if (drawMgrRef.current)
                        drawMgrRef.current.setDrawingMode(null);
                      setDrawMode(false);
                    }}
                    className="flex items-center justify-center gap-1.5 h-10 border-2 border-black bg-white text-black shadow-[2px_2px_0px_0px_#888] hover:bg-gray-100 text-xs font-bold uppercase transition-all"
                  >
                    <span
                      className="material-symbols-outlined"
                      style={{ fontSize: "14px" }}
                    >
                      edit
                    </span>
                    Edit
                  </button>
                </div>
                {drawMode && (
                  <div className="flex items-center gap-2 mt-3 bg-[#d0db9f] p-2 border border-[#6b8a1e]">
                    <div className="size-2 rounded-full bg-[#6b8a1e] animate-pulse" />
                    <span className="text-[10px] font-mono font-bold uppercase text-[#1e2809]">
                      Click map to draw zone
                    </span>
                  </div>
                )}
                <div className="mt-3 text-xs font-mono text-gray-500">
                  {zones.length} zone{zones.length !== 1 ? "s" : ""} saved
                </div>
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {STATS.map(({ label, value, dark }) => (
              <div
                key={label}
                className={`p-4 border-2 border-black shadow-[4px_4px_0px_0px_${dark ? "#415514" : "#000"}] flex flex-col justify-between h-24 ${dark ? "bg-[#1e2809]" : "bg-white"}`}
              >
                <span
                  className={`text-xs font-black uppercase tracking-wider ${dark ? "text-[#8faa3a]" : "text-gray-500"}`}
                >
                  {label}
                </span>
                <span
                  className={`text-2xl font-black ${dark ? "text-white" : "text-black"}`}
                >
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Verifications panel */}
        <div className="lg:col-span-4">
          <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#415514] flex flex-col max-h-[700px]">
            <div className="p-5 border-b-4 border-black flex justify-between items-center bg-[#f5f7ee]">
              <h3 className="font-black text-xl uppercase tracking-tight">
                Verifications
              </h3>
              <span className="bg-[#6b8a1e] text-white text-xs font-bold px-2 py-1 border border-[#415514]">
                {VERIFICATIONS.length} NEW
              </span>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white">
              {VERIFICATIONS.map((v) => (
                <div
                  key={v.id}
                  className="p-4 bg-[#f5f7ee] border-2 border-black shadow-[4px_4px_0px_0px_#415514] flex flex-col gap-4 hover:bg-white transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex gap-3">
                      <div className="size-10 bg-[#d0db9f] border-2 border-black flex items-center justify-center">
                        <span
                          className="material-symbols-outlined text-[#415514]"
                          style={{ fontSize: "20px" }}
                        >
                          {v.icon}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-bold text-sm uppercase">{v.id}</h4>
                        <p className="text-xs text-gray-500 font-mono">
                          {v.zone} • {v.amount}
                        </p>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 text-[10px] font-black bg-[#d0db9f] border border-[#6b8a1e] text-[#1e2809]">
                      PENDING
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button className="flex-1 h-10 bg-[#6b8a1e] hover:bg-[#415514] text-white text-xs font-black uppercase border-2 border-black shadow-[2px_2px_0px_0px_#1e2809] active:translate-y-0.5 active:shadow-none transition-all">
                      Approve
                    </button>
                    <button className="flex-1 h-10 bg-white hover:bg-gray-100 text-black text-xs font-black uppercase border-2 border-black shadow-[2px_2px_0px_0px_#000] active:translate-y-0.5 active:shadow-none transition-all">
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t-4 border-black bg-[#eef0e5]">
              <button className="w-full h-10 flex items-center justify-center text-xs font-black uppercase border-2 border-dashed border-[#6b8a1e] text-[#6b8a1e] hover:bg-[#6b8a1e] hover:text-white hover:border-solid transition-colors">
                View all verifications
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity from Firebase */}
      <div>
        <div className="flex items-center gap-4 mb-4">
          <h3 className="text-2xl font-black uppercase flex items-center gap-2">
            <span className="material-symbols-outlined text-[#6b8a1e]">
              history
            </span>
            Recent Activity
          </h3>
          <div className="h-1 flex-1 bg-[#6b8a1e]" />
          <span className="text-xs font-mono text-gray-500">
            Live from Firebase
          </span>
        </div>
        <div className="overflow-x-auto border-4 border-black shadow-[6px_6px_0px_0px_#415514]">
          <table className="w-full text-left text-sm bg-white">
            <thead className="bg-[#1e2809] text-[#8faa3a] text-xs uppercase font-bold tracking-wider">
              <tr>
                {[
                  "Type",
                  "Buyer",
                  "Seller",
                  "Amount (kWh)",
                  "Price",
                  "Total (USDC)",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-6 py-4 border-r border-[#415514] last:border-r-0"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-black font-medium font-mono">
              {activity.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-8 text-center text-gray-400 font-bold uppercase text-xs tracking-widest"
                  >
                    No P2P trades yet — go to Exchange to start trading!
                  </td>
                </tr>
              ) : (
                activity.map((r) => (
                  <tr
                    key={r.id}
                    className="hover:bg-[#f5f7ee] transition-colors"
                  >
                    <td className="px-6 py-4 border-r-2 border-black">
                      <span className="flex items-center gap-2">
                        <span
                          className="material-symbols-outlined text-[#6b8a1e]"
                          style={{ fontSize: "16px" }}
                        >
                          bolt
                        </span>
                        {r.type || "P2P Energy Sale"}
                      </span>
                    </td>
                    <td className="px-6 py-4 border-r-2 border-black text-xs text-gray-500">
                      {r.buyer ? `${r.buyer.slice(0, 8)}…` : "—"}
                    </td>
                    <td className="px-6 py-4 border-r-2 border-black text-xs text-gray-500">
                      {r.seller ? `${r.seller.slice(0, 8)}…` : "—"}
                    </td>
                    <td className="px-6 py-4 border-r-2 border-black font-bold">
                      {parseFloat(r.amount || 0).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 border-r-2 border-black">
                      {parseFloat(r.price || 0).toFixed(3)}
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-[#415514]">
                      {parseFloat(r.total || 0).toFixed(2)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <footer className="text-center py-8 text-xs font-mono text-[#6b8a1e] border-t-2 border-dashed border-[#8faa3a]">
        FALTRIC ADMIN SYSTEM v3.0 • OLIVE NEOBRUTALIST MODE • {user?.email}
      </footer>
    </div>
  );
}
