// GridMap page — wraps the existing Map.jsx component with the design chrome
import MapComponent from "../components/Map";

export default function GridMap() {
  return (
    <main
      className="flex-1 relative flex overflow-hidden bg-zinc-200"
      style={{ height: "calc(100vh - 72px)" }}
    >
      {/* Actual Google Maps component fills the background */}
      <div className="absolute inset-0 z-0 h-full w-full">
        <MapComponent />
      </div>

      {/* Left sidebar */}
      <aside className="absolute top-6 left-6 bottom-6 w-96 z-20 flex flex-col gap-6 pointer-events-none">
        {/* Search + Filter panel */}
        <div className="pointer-events-auto bg-white border-[3px] border-black shadow-[6px_6px_0px_0px_#415514] p-4">
          <div className="relative w-full h-12 mb-4">
            <div className="absolute left-3 top-1/2 -translate-y-1/2">
              <span
                className="material-symbols-outlined text-[#6b8a1e]"
                style={{ fontSize: "24px" }}
              >
                search
              </span>
            </div>
            <input
              className="w-full h-full bg-[#f5f7ee] placeholder-[#6b8a1e]/50 border-[3px] border-black focus:outline-none focus:border-[#6b8a1e] pl-10 pr-4 font-bold text-sm shadow-[2px_2px_0px_0px_#415514]"
              placeholder="SEARCH NODES..."
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {["Solar", "Wind", "Bio", "Battery"].map((f, i) => (
              <button
                key={f}
                className={`flex-1 h-10 border-[3px] border-black text-xs font-bold uppercase transition-colors shadow-[2px_2px_0px_0px_#415514] ${i === 0 ? "bg-[#6b8a1e] text-white" : "bg-white text-black hover:bg-[#6b8a1e] hover:text-white"}`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Node info card */}
        <div className="mt-auto pointer-events-auto bg-white border-[3px] border-black shadow-[6px_6px_0px_0px_#000] overflow-hidden">
          <div className="relative h-40 w-full border-b-[3px] border-black bg-zinc-800">
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
              <div>
                <div className="flex items-center gap-2 mb-1 bg-white border-2 border-black px-2 py-0.5 w-max shadow-[2px_2px_0px_0px_#000]">
                  <span className="size-3 bg-black" />
                  <span className="text-xs font-bold text-black uppercase tracking-wider">
                    Online
                  </span>
                </div>
                <h3 className="text-white text-2xl font-black uppercase tracking-tighter drop-shadow-[2px_2px_0px_#000]">
                  Node #4291
                </h3>
              </div>
              <div className="bg-black px-3 py-1 text-xs font-bold text-white border-2 border-white">
                SOLAR ARRAY
              </div>
            </div>
          </div>
          <div className="p-5 space-y-5">
            <div className="grid grid-cols-2 gap-4">
              {[
                ["Current Output", "450", "kWh"],
                ["Capacity", "500", "kWh"],
              ].map(([lbl, val, unit]) => (
                <div
                  key={lbl}
                  className="bg-zinc-100 p-3 border-[3px] border-black shadow-[3px_3px_0px_0px_#000]"
                >
                  <p className="text-[10px] uppercase font-bold mb-1">{lbl}</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black">{val}</span>
                    <span className="text-zinc-600 text-xs font-bold">
                      {unit}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="space-y-3 pt-2 border-t-[3px] border-dashed border-black">
              <div className="flex justify-between items-center text-sm">
                <span className="font-bold flex items-center gap-2 uppercase text-xs">
                  <span className="material-symbols-outlined text-[18px]">
                    person
                  </span>{" "}
                  Owner
                </span>
                <span className="font-mono text-xs bg-zinc-200 border-2 border-black px-2 py-1 font-bold">
                  0x71C...9A2
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="font-bold flex items-center gap-2 uppercase text-xs">
                  <span className="material-symbols-outlined text-[18px]">
                    health_and_safety
                  </span>{" "}
                  Health
                </span>
                <div className="w-24 h-4 bg-zinc-200 border-2 border-black relative">
                  <div className="absolute left-0 top-0 bottom-0 bg-black w-[98%]" />
                </div>
              </div>
            </div>
            <div className="pt-2 flex gap-3">
              <button className="flex-1 bg-black text-white border-[3px] border-black shadow-[4px_4px_0px_0px_#000] py-3 font-bold text-sm uppercase tracking-wider hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] transition-all">
                Trade Energy
              </button>
              <button className="size-12 flex items-center justify-center bg-white border-[3px] border-black shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] transition-all">
                <span className="material-symbols-outlined text-[24px]">
                  analytics
                </span>
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Top stats bar */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20 bg-white border-[3px] border-black shadow-[6px_6px_0px_0px_#415514] px-8 py-3 flex items-center gap-8 pointer-events-auto">
        {[
          ["Grid Load", "78%"],
          ["Active Nodes", "1,245"],
          ["CO2 Saved", "450t"],
        ].map(([label, val], i) => (
          <div key={label} className="flex items-center gap-8">
            {i > 0 && <div className="w-0.5 h-8 bg-[#6b8a1e]" />}
            <div className="flex flex-col items-center">
              <span className="text-[10px] uppercase tracking-widest text-[#6b8a1e] font-black">
                {label}
              </span>
              <span className="font-black text-lg">{val}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Right controls */}
      <aside className="absolute right-6 bottom-8 flex flex-col gap-4 z-20">
        <div className="flex flex-col gap-2">
          {["layers", "local_fire_department"].map((icon) => (
            <button
              key={icon}
              className="size-12 flex items-center justify-center bg-white border-[3px] border-black shadow-[6px_6px_0px_0px_#415514] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#415514] hover:bg-[#d0db9f] transition-all"
            >
              <span
                className="material-symbols-outlined text-[#415514]"
                style={{ fontSize: "24px" }}
              >
                {icon}
              </span>
            </button>
          ))}
        </div>
        <div className="flex flex-col bg-white border-[3px] border-black shadow-[6px_6px_0px_0px_#415514]">
          {["add", "remove"].map((icon, i) => (
            <button
              key={icon}
              className={`size-12 flex items-center justify-center hover:bg-[#d0db9f] transition-colors ${i === 0 ? "border-b-[3px] border-black" : ""}`}
            >
              <span
                className="material-symbols-outlined"
                style={{ fontSize: "24px" }}
              >
                {icon}
              </span>
            </button>
          ))}
        </div>
        <button className="size-12 flex items-center justify-center bg-[#6b8a1e] text-white border-[3px] border-[#415514] shadow-[6px_6px_0px_0px_#1e2809] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#1e2809] transition-all">
          <span className="material-symbols-outlined text-[24px] rotate-45">
            navigation
          </span>
        </button>
      </aside>
    </main>
  );
}
