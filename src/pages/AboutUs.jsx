export default function AboutUs() {
  return (
    <main className="flex-1 w-full min-h-screen bg-[#f6f8f6] dark:bg-[#141e15] text-[#111811] dark:text-gray-100 font-display flex flex-col overflow-x-hidden pt-24">
      <section className="relative w-full border-b-2 border-[#111811] dark:border-gray-700 bg-[#f6f8f6] dark:bg-[#141e15] bg-grid-pattern min-h-[500px] flex items-center justify-center p-8">
        <div className="relative z-10 max-w-5xl w-full flex flex-col items-center text-center gap-6">
          <div className="inline-flex items-center gap-2 border-2 border-[#111811] bg-[#2E7D32] px-3 py-1 text-white text-xs font-mono font-bold uppercase shadow-[2px_2px_0px_0px_#111811]">
            <span>// est. 2024</span>
          </div>
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-black uppercase tracking-tighter leading-[0.85] text-[#111811] dark:text-white mix-blend-multiply dark:mix-blend-normal">
            The
            <br />
            Collective
          </h1>
          <p className="max-w-xl text-lg md:text-xl font-medium font-mono bg-white dark:bg-gray-800 border-2 border-[#111811] dark:border-gray-600 p-4 shadow-[4px_4px_0px_0px_#111811] rotate-1">
            Powering the decentralized energy grid of tomorrow.
          </p>
        </div>
        <div className="absolute top-20 left-10 size-16 border-2 border-[#111811] dark:border-gray-500 bg-transparent flex items-center justify-center rounded-full opacity-50">
          <div className="size-8 bg-[#2E7D32] rounded-full border-2 border-[#111811]"></div>
        </div>
        <div className="absolute bottom-20 right-10 size-24 border-2 border-[#111811] dark:border-gray-500 bg-white dark:bg-gray-800 shadow-[4px_4px_0px_0px_#111811]"></div>
      </section>

      <section className="py-20 px-6 bg-[#2E7D32] dark:bg-green-900 border-b-2 border-[#111811] dark:border-gray-700">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-900 border-2 border-[#111811] dark:border-gray-600 p-8 md:p-12 shadow-[4px_4px_0px_0px_#111811] relative">
            <span className="material-symbols-outlined absolute -top-6 -left-4 text-6xl text-[#111811] dark:text-white bg-white dark:bg-green-800 p-2 border-2 border-[#111811]">
              format_quote
            </span>
            <h2 className="text-2xl md:text-4xl font-bold leading-tight uppercase text-[#111811] dark:text-white mb-6 pt-4">
              Our Mission
            </h2>
            <p className="text-xl md:text-2xl font-medium leading-relaxed font-mono">
              Bridging the last-mile gap by tokenizing surplus solar, wind, and
              biogas energy for real-time P2P monetization.
            </p>
            <div className="mt-8 flex items-center gap-3">
              <div className="h-[2px] w-12 bg-[#111811] dark:bg-white"></div>
              <span className="text-sm font-bold uppercase tracking-widest">
                Faltric Protocol V1
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-6 bg-[#f6f8f6] dark:bg-[#141e15] border-b-2 border-[#111811] dark:border-gray-700">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col p-6 border-2 border-[#111811] dark:border-gray-600 bg-white dark:bg-gray-800 shadow-[4px_4px_0px_0px_#111811] hover:translate-y-1 transition-transform">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-mono font-bold uppercase text-gray-500 dark:text-gray-400">
                  Nodes Active
                </p>
                <span className="material-symbols-outlined text-[#2E7D32]">
                  hub
                </span>
              </div>
              <p className="text-5xl font-black tracking-tighter text-[#111811] dark:text-white">
                12,405
              </p>
              <div className="mt-4 flex items-center gap-1 text-xs font-bold text-[#2E7D32]">
                <span className="material-symbols-outlined text-sm">
                  trending_up
                </span>
                <span>+12% this week</span>
              </div>
            </div>
            <div className="flex flex-col p-6 border-2 border-[#111811] dark:border-gray-600 bg-white dark:bg-gray-800 shadow-[4px_4px_0px_0px_#111811] hover:translate-y-1 transition-transform">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-mono font-bold uppercase text-gray-500 dark:text-gray-400">
                  kW Traded
                </p>
                <span className="material-symbols-outlined text-[#2E7D32]">
                  bolt
                </span>
              </div>
              <p className="text-5xl font-black tracking-tighter text-[#111811] dark:text-white">
                8.2M
              </p>
              <div className="mt-4 flex items-center gap-1 text-xs font-bold text-[#2E7D32]">
                <span className="material-symbols-outlined text-sm">
                  history
                </span>
                <span>All time volume</span>
              </div>
            </div>
            <div className="flex flex-col p-6 border-2 border-[#111811] dark:border-gray-600 bg-white dark:bg-gray-800 shadow-[4px_4px_0px_0px_#111811] hover:translate-y-1 transition-transform">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-mono font-bold uppercase text-gray-500 dark:text-gray-400">
                  Carbon Offset
                </p>
                <span className="material-symbols-outlined text-[#2E7D32]">
                  eco
                </span>
              </div>
              <p className="text-5xl font-black tracking-tighter text-[#111811] dark:text-white">
                450t
              </p>
              <div className="mt-4 flex items-center gap-1 text-xs font-bold text-[#2E7D32]">
                <span className="material-symbols-outlined text-sm">
                  forest
                </span>
                <span>Equivalent planted</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* <section className="py-20 px-6 bg-white dark:bg-black border-b-2 border-[#111811] dark:border-gray-700">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
              <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-2">
                Team Falcons
              </h2>
              <p className="text-lg font-mono text-gray-600 dark:text-gray-400">
                Architects of the decentralized grid.
              </p>
            </div>
            <button className="bg-[#111811] text-white dark:bg-white dark:text-black px-6 py-3 border-2 border-transparent hover:border-[#111811] hover:bg-white hover:text-[#111811] dark:hover:border-white dark:hover:bg-black dark:hover:text-white font-bold uppercase text-sm transition-colors shadow-[4px_4px_0px_0px_#111811] hover:shadow-none translate-x-0 translate-y-0 hover:translate-x-[2px] hover:translate-y-[2px]">
              View All Contributors
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="group relative border-2 border-[#111811] dark:border-gray-600 bg-[#f6f8f6] dark:bg-gray-900 p-4 shadow-[2px_2px_0px_0px_#111811] hover:shadow-[4px_4px_0px_0px_#111811] transition-all">
              <div className="relative w-full aspect-square bg-white dark:bg-gray-800 overflow-hidden border-2 border-[#111811] dark:border-gray-600 mb-4 flex items-center justify-center">
                <img
                  alt="Stylized illustration of Sarthak"
                  className="w-full h-full object-cover grayscale contrast-125 brightness-95 group-hover:scale-105 transition-transform duration-500"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuB14LMgA-6l3pTAETdLSJfvJspWSHXgdoLXxv1flCLJtFQqr4a2Q5cSu_llApZ69zYySCjcag94e7ItWGKOxAKASodrjdlllZlH5TiL5CcJm8XShINN58vOy4aUcEO-SkyOqmw9giy7SEHC60C5yR6FzS4X2_3qE0DSslln0kgE_R-HQEqufoakSQ-DlisskKQIaHxeyTiy_Puzm0Vn4I4xrez0wd7rU29SbkhDdgYk-NjTYGn4xzv19aDTjexarY0ImVBvnSKVZlo"
                />
                <div className="absolute top-2 right-2 size-3 bg-[#2E7D32] rounded-full border border-[#111811]"></div>
              </div>
              <h3 className="text-xl font-bold uppercase truncate">
                Sarthak T. Patil
              </h3>
              <p className="font-mono text-xs mt-1 text-gray-500 dark:text-gray-400">
                LEAD ARCHITECT
              </p>
            </div>
            <div className="group relative border-2 border-[#111811] dark:border-gray-600 bg-[#f6f8f6] dark:bg-gray-900 p-4 shadow-[2px_2px_0px_0px_#111811] hover:shadow-[4px_4px_0px_0px_#111811] transition-all">
              <div className="relative w-full aspect-square bg-white dark:bg-gray-800 overflow-hidden border-2 border-[#111811] dark:border-gray-600 mb-4 flex items-center justify-center">
                <img
                  alt="Stylized illustration of Utkarsh"
                  className="w-full h-full object-cover grayscale contrast-125 brightness-95 group-hover:scale-105 transition-transform duration-500"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDtM1U5cUHYayKXm8EAEJ2xd05F4Sdyhu0gy2xpd-63_zmE7ItjVVaSpuHdzKxULjLUenKfxwmzAv99WvAXOTZnoJyREKccCMeUv19gdVJD2DlRXRG75jit0_qmGwaGh7ho0b4XJN0bRu3LFFl_adbmxHJ2QlE_L_VCAYFb6Lu96WfzP-OLP5X-uRJPlxe5cQztNQor0pBiWENs3NZqVrX6C78RfJCP2dLY0hDL5tr9DzqH_f1YznCQ50s8T3pi5FQRC3MqW-FQojo"
                />
                <div className="absolute top-2 right-2 size-3 bg-[#2E7D32] rounded-full border border-[#111811]"></div>
              </div>
              <h3 className="text-xl font-bold uppercase truncate">
                Utkarsh Vidwat
              </h3>
              <p className="font-mono text-xs mt-1 text-gray-500 dark:text-gray-400">
                DATA &amp; API HANDLING
              </p>
            </div>
            <div className="group relative border-2 border-[#111811] dark:border-gray-600 bg-[#f6f8f6] dark:bg-gray-900 p-4 shadow-[2px_2px_0px_0px_#111811] hover:shadow-[4px_4px_0px_0px_#111811] transition-all">
              <div className="relative w-full aspect-square bg-white dark:bg-gray-800 overflow-hidden border-2 border-[#111811] dark:border-gray-600 mb-4 flex items-center justify-center">
                <img
                  alt="Stylized illustration of Sneha Patidar"
                  className="w-full h-full object-cover grayscale contrast-125 brightness-95 group-hover:scale-105 transition-transform duration-500"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDW--GdtpZVSKyeDnAjDwpGGI3DjXM8TQzL7t0KNqxMULnyNkA_IQyBfGYTCzaA0_iFjLewoz848RQ3-PRlrKwktgBeHtnGg9_8nZqSi5APm9nygfAVbqErz-yNVlgBIJhZyalf65EOEyVIclt1mO0yQBXPQg7VwS4Ao-v5OycNJT18K9blcYChKNFgRpffAuNXwJJuXLVoJjmHvhwFlK4mPZYez_wBy96tOl6uTf3VYKDC2J2IU9tFQOwlo1seQZum7XmLt8c3Iuc"
                />
                <div className="absolute top-2 right-2 size-3 bg-gray-400 rounded-full border border-[#111811]"></div>
              </div>
              <h3 className="text-xl font-bold uppercase truncate">
                Sneha Patidar
              </h3>
              <p className="font-mono text-xs mt-1 text-gray-500 dark:text-gray-400">
                AI CONTENT CREATION
              </p>
            </div>
            <div className="group relative border-2 border-[#111811] dark:border-gray-600 bg-[#f6f8f6] dark:bg-gray-900 p-4 shadow-[2px_2px_0px_0px_#111811] hover:shadow-[4px_4px_0px_0px_#111811] transition-all">
              <div className="relative w-full aspect-square bg-white dark:bg-gray-800 overflow-hidden border-2 border-[#111811] dark:border-gray-600 mb-4 flex items-center justify-center">
                <img
                  alt="Stylized illustration of Sneha Sharma"
                  className="w-full h-full object-cover grayscale contrast-125 brightness-95 group-hover:scale-105 transition-transform duration-500"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCKLbgTFzjefw391E6USp9llOhNi2f_O1yupl01Sc01RbDbBQI404lVwQ9PHR8DD1dyNjZpSWvD8_iY7Xb4Syd2vFYrpg9SdXYRu3SqhgC_t5yEkdXbQooFjQsYTzj_w5D-51-_k7wYmhPAS_9QwyrBKnTsAy1tXDDxTUpWpOeP1qE7mevyLxl-muT9c-CCs2SZGxBvcJl1iIJVWbqLWs170A2_vNk8MKrvZb547Vv6UVnioKIbFMpcMkPW1f_etl40Z7UdcsFMsGs"
                />
                <div className="absolute top-2 right-2 size-3 bg-[#2E7D32] rounded-full border border-[#111811]"></div>
              </div>
              <h3 className="text-xl font-bold uppercase truncate">
                Sneha Sharma
              </h3>
              <p className="font-mono text-xs mt-1 text-gray-500 dark:text-gray-400">
                RESEARCHER
              </p>
            </div>
          </div>
        </div>
      </section> */}

      <section className="py-20 px-6 bg-[#f6f8f6] dark:bg-[#141e15] border-b-2 border-[#111811] dark:border-gray-700 bg-grid-pattern">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tight mb-12 leading-[0.9]">
            The Energy
            <br />
            <span className="text-[#2E7D32] bg-white px-2 border-2 border-[#111811] shadow-[2px_2px_0px_0px_#111811] inline-block transform -rotate-1">
              Revolution
            </span>
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mb-16">
            <div className="bg-white dark:bg-gray-800 border-2 border-[#111811] dark:border-gray-600 p-8 shadow-[4px_4px_0px_0px_#111811]">
              <h3 className="text-2xl font-bold uppercase mb-6 border-b-2 border-[#111811] pb-2">
                Technical Tokenization Specs
              </h3>
              <div className="space-y-6">
                <div className="group">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-mono font-bold text-lg">
                      SOLAR PV
                    </span>
                    <span className="bg-black text-white px-2 py-0.5 text-xs font-mono">
                      ERC-20
                    </span>
                  </div>
                  <p className="font-mono text-sm text-gray-600 dark:text-gray-300 mb-2">
                    Direct photovoltaic yield conversion via smart inverter API.
                  </p>
                  <div className="bg-gray-100 dark:bg-gray-900 border border-[#111811] p-3 font-mono text-sm">
                    <span className="text-[#2E7D32] font-bold">
                      1 FAL-S = 1 kWh
                    </span>{" "}
                    (Peak Hours)
                    <br />
                    <span className="text-xs text-gray-500">
                      Oracle updates: 15min intervals
                    </span>
                  </div>
                </div>
                <div className="group">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-mono font-bold text-lg">
                      WIND TURBINE
                    </span>
                    <span className="bg-black text-white px-2 py-0.5 text-xs font-mono">
                      ERC-721
                    </span>
                  </div>
                  <p className="font-mono text-sm text-gray-600 dark:text-gray-300 mb-2">
                    Fractionalized ownership of turbine output capacity.
                  </p>
                  <div className="bg-gray-100 dark:bg-gray-900 border border-[#111811] p-3 font-mono text-sm">
                    <span className="text-[#2E7D32] font-bold">
                      1 FAL-W NFT = 0.5% DAO Share
                    </span>
                    <br />
                    <span className="text-xs text-gray-500">
                      Yield: Dist. weekly in ETH
                    </span>
                  </div>
                </div>
                <div className="group">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-mono font-bold text-lg">BIOGAS</span>
                    <span className="bg-black text-white px-2 py-0.5 text-xs font-mono">
                      ERC-1155
                    </span>
                  </div>
                  <p className="font-mono text-sm text-gray-600 dark:text-gray-300 mb-2">
                    Organic waste-to-energy conversion tracking.
                  </p>
                  <div className="bg-gray-100 dark:bg-gray-900 border border-[#111811] p-3 font-mono text-sm">
                    <span className="text-[#2E7D32] font-bold">
                      1 FAL-B = 1 m³ Gas Equivalent
                    </span>
                    <br />
                    <span className="text-xs text-gray-500">
                      Verified by IoT Sensors
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col h-full">
              <div className="border-2 border-[#111811] dark:border-gray-600 bg-white dark:bg-gray-900 p-6 shadow-[4px_4px_0px_0px_#111811] flex-grow flex flex-col">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-bold uppercase">
                    Renewable Adoption Growth
                  </h3>
                  <div className="flex items-center gap-2 text-xs font-mono border border-[#111811] px-2 py-1">
                    <div className="size-2 bg-[#111811]"></div>
                    <span>Target</span>
                    <div className="size-2 bg-[#2E7D32] ml-2"></div>
                    <span>Actual</span>
                  </div>
                </div>
                <div className="flex-grow flex items-end justify-between gap-2 sm:gap-4 h-64 border-b-2 border-[#111811] pb-0 relative">
                  <div className="absolute w-full h-full pointer-events-none flex flex-col justify-between text-xs font-mono text-gray-400 -z-0 pb-6">
                    <div className="border-b border-gray-200 dark:border-gray-700 w-full">
                      100%
                    </div>
                  </div>
                  <div className="relative w-full flex flex-col justify-end z-10 group h-full">
                    <div
                      className="w-full bg-[#111811] dark:bg-gray-600 shadow-[4px_4px_0px_0px_#111811] mb-1 hover:bg-[#2E7D32] transition-colors duration-500"
                      style={{ height: "30%" }}
                    ></div>
                    <div
                      className="w-full bg-[#2E7D32] shadow-[4px_4px_0px_0px_#111811] relative hover:-translate-y-1 hover:bg-[#2E7D32] transition-transform duration-200"
                      style={{ height: "45%" }}
                    ></div>
                    <span className="text-xs font-mono font-bold uppercase text-center mt-2">
                      Q1
                    </span>
                  </div>
                  <div className="relative w-full flex flex-col justify-end z-10 group h-full">
                    <div
                      className="w-full bg-[#111811] dark:bg-gray-600 shadow-[4px_4px_0px_0px_#111811] mb-1 hover:bg-[#2E7D32] transition-colors duration-500"
                      style={{ height: "45%" }}
                    ></div>
                    <div
                      className="w-full bg-[#2E7D32] shadow-[4px_4px_0px_0px_#111811] relative hover:-translate-y-1 hover:bg-[#2E7D32] transition-transform duration-200"
                      style={{ height: "52%" }}
                    ></div>
                    <span className="text-xs font-mono font-bold uppercase text-center mt-2">
                      Q2
                    </span>
                  </div>
                  <div className="relative w-full flex flex-col justify-end z-10 group h-full">
                    <div
                      className="w-full bg-[#111811] dark:bg-gray-600 shadow-[4px_4px_0px_0px_#111811] mb-1 hover:bg-[#2E7D32] transition-colors duration-500"
                      style={{ height: "60%" }}
                    ></div>
                    <div
                      className="w-full bg-[#2E7D32] shadow-[4px_4px_0px_0px_#111811] relative hover:-translate-y-1 hover:bg-[#2E7D32] transition-transform duration-200"
                      style={{ height: "68%" }}
                    ></div>
                    <span className="text-xs font-mono font-bold uppercase text-center mt-2">
                      Q3
                    </span>
                  </div>
                  <div className="relative w-full flex flex-col justify-end z-10 group h-full">
                    <div
                      className="w-full bg-[#111811] dark:bg-gray-600 shadow-[4px_4px_0px_0px_#111811] mb-1 hover:bg-[#2E7D32] transition-colors duration-500"
                      style={{ height: "75%" }}
                    ></div>
                    <div
                      className="w-full bg-[#2E7D32] shadow-[4px_4px_0px_0px_#111811] relative hover:-translate-y-1 hover:bg-[#2E7D32] transition-transform duration-200"
                      style={{ height: "85%" }}
                    ></div>
                    <span className="text-xs font-mono font-bold uppercase text-center mt-2">
                      Q4
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="border-2 border-[#111811] dark:border-gray-600 bg-[#111811] dark:bg-black p-0 shadow-[4px_4px_0px_0px_#111811] text-white grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-700">
            <div className="p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-xs text-[#2E7D32]">
                    /// SYSTEM STATUS
                  </span>
                  <span className="material-symbols-outlined text-[#2E7D32] animate-pulse">
                    radio_button_checked
                  </span>
                </div>
                <p className="text-2xl font-bold">ONLINE</p>
                <p className="font-mono text-xs text-gray-400 mt-1">
                  Uptime: 99.99%
                </p>
              </div>
            </div>
            <div className="p-6 flex flex-col justify-between">
              <div>
                <p className="font-mono text-xs text-gray-400 mb-1">NETWORK</p>
                <p className="text-xl font-bold mb-4">Sepolia Testnet</p>
                <p className="font-mono text-xs text-gray-400 mb-1">CONTRACT</p>
                <p className="text-xl font-mono truncate text-[#2E7D32]">
                  0x71C...9e21
                </p>
              </div>
            </div>
            <div className="p-6 flex flex-col justify-between bg-gray-900">
              <div>
                <p className="font-mono text-xs text-gray-400 mb-2">
                  CURRENT GAS
                </p>
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-4 w-full bg-black border border-gray-600 rounded-none overflow-hidden relative">
                    <div className="h-full w-[15%] bg-[#2E7D32] absolute top-0 left-0"></div>
                    <div className="w-[2px] h-full bg-white absolute top-0 left-[15%]"></div>
                  </div>
                  <span className="text-lg font-mono font-bold text-[#2E7D32]">
                    15
                  </span>
                </div>
                <button className="w-full bg-white text-black py-2 font-bold uppercase hover:bg-[#2E7D32] hover:text-white transition-colors border-2 border-transparent shadow-[2px_2px_0px_0px_#ffffff55]">
                  Start Trading
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-grid-pattern border-b-2 border-[#111811] dark:border-gray-700">
        <div className="max-w-4xl mx-auto text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-black uppercase mb-4">
            Join the Grid
          </h2>
          <p className="font-mono text-lg">
            Connect with the community and contribute to the code.
          </p>
        </div>
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          <a
            className="group flex flex-col items-center justify-center p-8 bg-white dark:bg-gray-800 border-2 border-[#111811] dark:border-gray-600 shadow-[4px_4px_0px_0px_#111811] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all"
            href="#"
          >
            <div className="size-16 bg-[#5865F2] flex items-center justify-center border-2 border-[#111811] mb-6 shadow-[2px_2px_0px_0px_#000]">
              <span className="material-symbols-outlined text-white text-3xl">
                forum
              </span>
            </div>
            <h3 className="text-2xl font-bold uppercase mb-2">Discord</h3>
            <p className="text-center font-mono text-sm text-gray-600 dark:text-gray-300">
              Chat with 5k+ members
            </p>
          </a>
          <a
            className="group flex flex-col items-center justify-center p-8 bg-white dark:bg-gray-800 border-2 border-[#111811] dark:border-gray-600 shadow-[4px_4px_0px_0px_#111811] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all"
            href="#"
          >
            <div className="size-16 bg-black flex items-center justify-center border-2 border-[#111811] mb-6 shadow-[2px_2px_0px_0px_#000]">
              <span className="material-symbols-outlined text-white text-3xl">
                campaign
              </span>
            </div>
            <h3 className="text-2xl font-bold uppercase mb-2">Twitter</h3>
            <p className="text-center font-mono text-sm text-gray-600 dark:text-gray-300">
              Latest updates &amp; news
            </p>
          </a>
          <a
            className="group flex flex-col items-center justify-center p-8 bg-white dark:bg-gray-800 border-2 border-[#111811] dark:border-gray-600 shadow-[4px_4px_0px_0px_#111811] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all"
            href="#"
          >
            <div className="size-16 bg-[#333] flex items-center justify-center border-2 border-[#111811] mb-6 shadow-[2px_2px_0px_0px_#000]">
              <span className="material-symbols-outlined text-white text-3xl">
                terminal
              </span>
            </div>
            <h3 className="text-2xl font-bold uppercase mb-2">GitHub</h3>
            <p className="text-center font-mono text-sm text-gray-600 dark:text-gray-300">
              Open source protocols
            </p>
          </a>
        </div>
      </section>

      <footer className="bg-[#111811] text-white py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className="size-5 bg-[#2E7D32] flex items-center justify-center border border-white">
                <span className="material-symbols-outlined text-white text-xs">
                  bolt
                </span>
              </div>
              <h2 className="text-xl font-bold uppercase tracking-tight">
                Faltric
              </h2>
            </div>
            <p className="font-mono text-sm text-gray-400">
              © 2024 Faltric Energy Protocol.
            </p>
          </div>
          <div className="flex flex-wrap gap-8 text-sm font-bold uppercase">
            <a className="hover:text-[#2E7D32] transition-colors" href="#">
              Privacy
            </a>
            <a className="hover:text-[#2E7D32] transition-colors" href="#">
              Terms
            </a>
            <a className="hover:text-[#2E7D32] transition-colors" href="#">
              Docs
            </a>
            <a className="hover:text-[#2E7D32] transition-colors" href="#">
              Contact
            </a>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-12 pt-8 border-t border-gray-800 text-center md:text-right">
          <p className="font-mono text-sm">
            Built with <span className="text-[#2E7D32]">💚</span> by Team
            Falcons
          </p>
        </div>
      </footer>
    </main>
  );
}
