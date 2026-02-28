// Dashboard — faltric_ai_energy_dashboard design — Olive Green neobrutalist theme

export default function Dashboard({ user }) {
  return (
    <main className="flex-1 w-full max-w-7xl mx-auto p-6 md:p-10 flex flex-col gap-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <div className="flex items-center gap-4 mb-2">
            <h2 className="text-4xl font-black uppercase tracking-tight">
              System Overview
            </h2>
            <span className="px-3 py-1 bg-white border-[3px] border-black text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-[2px_2px_0px_0px_#000]">
              <span className="w-2 h-2 bg-[#6b8a1e] rounded-full animate-pulse" />
              Live Grid
            </span>
          </div>
          {user?.name && (
            <p className="text-[#6b8a1e] font-bold text-sm uppercase tracking-wide border-l-4 border-[#6b8a1e] pl-3">
              Welcome, {user.name} ·{" "}
              {(user.token_balance ?? 0).toLocaleString()} FAL balance
            </p>
          )}
          <p className="text-gray-600 font-medium text-lg border-l-4 border-black pl-4 mt-2">
            Real-time analysis of renewable energy inputs.
          </p>
        </div>
        <button className="px-6 py-2 font-bold flex items-center gap-2 bg-white border-[3px] border-black shadow-[4px_4px_0px_0px_#415514] hover:bg-[#6b8a1e] hover:text-white hover:border-[#415514] transition-all group">
          <span
            className="material-symbols-outlined"
            style={{ fontSize: "18px" }}
          >
            download
          </span>
          Export Report
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          {
            label: "Solar",
            value: "45.2",
            unit: "kWh",
            change: "+12%",
            icon: "sunny",
            bg: "bg-white",
          },
          {
            label: "Wind",
            value: "12.8",
            unit: "kWh",
            change: "+5%",
            icon: "air",
            bg: "bg-white",
          },
          {
            label: "Biogas",
            value: "8.4",
            unit: "kWh",
            change: "-2%",
            icon: "local_fire_department",
            bg: "bg-white",
          },
          {
            label: "Grid Load",
            value: "62%",
            unit: "",
            change: "Optimal",
            icon: "speed",
            bg: "bg-[#1e2809] text-white",
            dark: true,
          },
        ].map(({ label, value, unit, change, icon, bg, dark }) => (
          <div
            key={label}
            className={`${bg} p-6 relative overflow-hidden group border-[3px] border-black shadow-[6px_6px_0px_0px_#415514] hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[8px_8px_0px_0px_#415514] transition-all`}
          >
            <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <span
                className="material-symbols-outlined"
                style={{ fontSize: "7rem" }}
              >
                {icon}
              </span>
            </div>
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-4">
                <h4
                  className={`font-bold uppercase text-sm tracking-widest border-b-2 pb-1 ${dark ? "border-[#6b8a1e]" : "border-black"}`}
                >
                  {label}
                </h4>
                <span
                  className={`px-2 py-0.5 text-xs font-bold border-2 ${dark ? "border-[#6b8a1e] text-[#8faa3a] bg-[#2f3e0f]" : "border-black bg-[#d0db9f] text-[#1e2809]"}`}
                >
                  {change}
                </span>
              </div>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-5xl font-black">{value}</span>
                {unit && (
                  <span
                    className={`text-sm font-bold uppercase ${dark ? "text-[#6b8a1e]" : "text-gray-600"}`}
                  >
                    {unit}
                  </span>
                )}
              </div>
              <div
                className={`w-full h-4 mt-6 border-[3px] p-0.5 ${dark ? "bg-[#2f3e0f] border-[#6b8a1e]" : "bg-[#f5f7ee] border-black"}`}
              >
                <div
                  className={`h-full ${dark ? "bg-[#6b8a1e]" : "bg-black"}`}
                  style={{
                    width: `${label === "Solar" ? 75 : label === "Wind" ? 45 : label === "Biogas" ? 30 : 62}%`,
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Chart + sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* AI Prediction chart */}
        <div className="lg:col-span-2 bg-white border-[3px] border-black shadow-[6px_6px_0px_0px_#415514] flex flex-col min-h-[400px]">
          <div className="p-6 border-b-[3px] border-black flex justify-between items-center bg-[#f5f7ee]">
            <h3 className="text-xl font-black flex items-center gap-2 uppercase">
              <span
                className="material-symbols-outlined text-[#6b8a1e]"
                style={{ fontSize: "28px" }}
              >
                psychology
              </span>
              AI Prediction vs Actual
            </h3>
            <div className="flex gap-2">
              {["24H", "7D", "30D"].map((t, i) => (
                <button
                  key={t}
                  className={`px-4 py-1 text-xs font-bold border-2 border-black transition-colors ${i === 1 ? "bg-[#6b8a1e] text-white border-[#415514]" : "bg-white hover:bg-[#6b8a1e] hover:text-white hover:border-[#415514]"}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div className="p-8 flex-1 bg-white relative">
            <svg
              className="w-full h-48 overflow-visible"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <path
                d="M0,80 C10,75 20,60 30,50 C40,40 50,45 60,30 C70,15 80,25 90,40 C95,45 100,50 100,50"
                fill="none"
                stroke="#d0db9f"
                strokeDasharray="3,3"
                strokeWidth="2"
                vectorEffect="non-scaling-stroke"
              />
              <path
                d="M0,85 C10,80 20,65 30,55 C40,58 50,48 60,35 C70,40 80,30 90,45 C95,50 100,55 100,55"
                fill="none"
                stroke="#6b8a1e"
                strokeWidth="3"
                vectorEffect="non-scaling-stroke"
              />
              {[
                [60, 35],
                [90, 45],
              ].map(([cx, cy]) => (
                <circle
                  key={`${cx}${cy}`}
                  cx={cx}
                  cy={cy}
                  r="3"
                  fill="#fff"
                  stroke="#415514"
                  strokeWidth="2"
                />
              ))}
            </svg>
            <div className="flex justify-between mt-4 text-xs font-bold font-mono border-t-2 border-black pt-2">
              {[
                "00:00",
                "04:00",
                "08:00",
                "12:00",
                "16:00",
                "20:00",
                "23:59",
              ].map((t) => (
                <span key={t}>{t}</span>
              ))}
            </div>
          </div>
          <div className="px-6 py-4 border-t-[3px] border-black bg-[#f5f7ee] flex gap-6">
            <div className="flex items-center gap-2">
              <div className="w-6 h-1 border-b-2 border-dashed border-[#8faa3a]" />
              <span className="text-sm font-bold uppercase">AI Prediction</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-1 bg-[#6b8a1e]" />
              <span className="text-sm font-bold uppercase">
                Actual Generation
              </span>
            </div>
          </div>
        </div>

        {/* Weather + efficiency */}
        <div className="flex flex-col gap-8">
          <div className="bg-white border-[3px] border-black shadow-[6px_6px_0px_0px_#415514] p-6">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-black text-xl uppercase">India, IN</h4>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-1">
                  Local Weather
                </p>
              </div>
              <span
                className="material-symbols-outlined text-[#6b8a1e]"
                style={{ fontSize: "48px" }}
              >
                partly_cloudy_day
              </span>
            </div>
            <div className="my-6 border-y-[3px] border-black py-4">
              <p className="text-6xl font-black">28°C</p>
              <div className="flex gap-4 mt-2 font-mono text-sm font-bold">
                <span>W: 18 km/h</span>
                <span>H: 62%</span>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-2 text-center">
              {[
                { d: "Mon", i: "sunny", t: "31°" },
                { d: "Tue", i: "cloud", t: "29°" },
                { d: "Wed", i: "thunderstorm", t: "25°", a: true },
                { d: "Thu", i: "sunny", t: "32°" },
              ].map(({ d, i, t, a }) => (
                <div
                  key={d}
                  className={`flex flex-col items-center gap-1 p-2 border-2 transition-all ${a ? "bg-[#6b8a1e] text-white border-[#415514]" : "border-transparent hover:border-black"}`}
                >
                  <span className="font-bold text-xs">{d}</span>
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: "16px" }}
                  >
                    {i}
                  </span>
                  <span className="font-mono text-xs">{t}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-[#1e2809] text-white border-[3px] border-black shadow-[6px_6px_0px_0px_#415514] p-6">
            <h4 className="font-bold uppercase text-sm mb-6 border-b-2 border-[#6b8a1e] pb-2">
              System Efficiency
            </h4>
            <div className="flex items-center justify-center relative h-36 mb-4">
              <svg className="w-36 h-36 transform -rotate-90">
                <circle
                  className="text-[#2f3e0f]"
                  cx="72"
                  cy="72"
                  r="60"
                  fill="transparent"
                  stroke="currentColor"
                  strokeWidth="16"
                />
                <circle
                  className="text-[#6b8a1e]"
                  cx="72"
                  cy="72"
                  r="60"
                  fill="transparent"
                  stroke="currentColor"
                  strokeDasharray="376.99"
                  strokeDashoffset="37.69"
                  strokeWidth="16"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-black">92%</span>
                <span className="text-xs font-bold bg-[#6b8a1e] text-white px-2 py-0.5 mt-1 border border-[#8faa3a]">
                  Excellent
                </span>
              </div>
            </div>
            <div className="text-center border-t border-[#2f3e0f] pt-4">
              <p className="text-sm text-gray-400">
                Outperforming{" "}
                <span className="text-[#8faa3a] font-bold underline">88%</span>{" "}
                of peers.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white border-[3px] border-black shadow-[6px_6px_0px_0px_#415514] p-8">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-2xl font-black uppercase">
            Recent P2P Transactions
          </h3>
          <a
            href="/exchange"
            className="px-4 py-2 text-sm font-bold flex items-center gap-2 bg-[#6b8a1e] text-white border-[3px] border-[#415514] shadow-[4px_4px_0px_0px_#1e2809] hover:bg-[#415514] transition-all"
          >
            Trade Energy{" "}
            <span
              className="material-symbols-outlined"
              style={{ fontSize: "16px" }}
            >
              arrow_forward
            </span>
          </a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="text-black border-b-[3px] border-black">
                {["Type", "Hash", "Volume", "Price/kWh", "Status", "Time"].map(
                  (h) => (
                    <th
                      key={h}
                      className="pb-4 font-black uppercase text-sm tracking-wider"
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {[
                {
                  type: "Sell",
                  dir: "arrow_outward",
                  hash: "0x71C...9A2",
                  vol: "12.5 kWh",
                  price: "0.14 ETH",
                  status: "Completed",
                  time: "2 mins ago",
                  ok: true,
                },
                {
                  type: "Buy",
                  dir: "arrow_downward",
                  hash: "0x3B2...1F4",
                  vol: "45.0 kWh",
                  price: "0.12 ETH",
                  status: "Processing",
                  time: "14 mins ago",
                  ok: false,
                  dark: true,
                },
                {
                  type: "Sell",
                  dir: "arrow_outward",
                  hash: "0xA92...C21",
                  vol: "8.2 kWh",
                  price: "0.15 ETH",
                  status: "Completed",
                  time: "1 hour ago",
                  ok: true,
                },
              ].map((row) => (
                <tr
                  key={row.hash}
                  className="border-b border-gray-300 hover:bg-[#f5f7ee] transition-colors group"
                >
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      <div
                        className={`p-1 border-2 border-black shadow-[2px_2px_0px_0px_#415514] ${row.dark ? "bg-[#1e2809]" : "bg-[#d0db9f]"}`}
                      >
                        <span
                          className={`material-symbols-outlined font-bold ${row.dark ? "text-[#8faa3a]" : "text-[#415514]"}`}
                          style={{ fontSize: "14px" }}
                        >
                          {row.dir}
                        </span>
                      </div>
                      <span className="font-bold uppercase">{row.type}</span>
                    </div>
                  </td>
                  <td className="py-4 font-mono text-gray-500 group-hover:text-black cursor-pointer underline decoration-dotted">
                    {row.hash}
                  </td>
                  <td className="py-4 font-bold">{row.vol}</td>
                  <td className="py-4">{row.price}</td>
                  <td className="py-4">
                    <span
                      className={`px-2 py-1 text-xs font-bold border-2 uppercase ${row.ok ? "text-[#415514] border-[#6b8a1e] bg-[#d0db9f]" : "border-black border-dashed bg-gray-100"}`}
                    >
                      {row.status}
                    </span>
                  </td>
                  <td className="py-4 text-right text-gray-500 font-mono">
                    {row.time}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
