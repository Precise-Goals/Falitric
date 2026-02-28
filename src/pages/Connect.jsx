// Connect & AI Chat — faltric_connect_ai_chat design
import { useState } from "react";

const INITIAL_MESSAGES = [
  {
    id: 1,
    from: "ai",
    name: "DeepSeek Grid AI",
    time: "10:42 AM",
    text: "Grid Alert: Solar output in Sector 7 has increased by 15% in the last hour. Load stable at 84%.",
    sub: "Recommend initiating P2P sell orders for surplus energy before the projected midday dip.",
    actions: ["Analyze Trends", "Dismiss"],
  },
  {
    id: 2,
    from: "user",
    name: "You",
    time: "10:45 AM",
    text: "Show me the latest P2P trading rates for solar energy in my region.",
  },
  {
    id: 3,
    from: "peer",
    name: "CryptoEnergy_01",
    time: "10:48 AM",
    text: "Anyone else seeing the spike in wind energy prices? My dashboard is showing +8%.",
  },
];

export default function Connect() {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState("");

  const send = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages((m) => [
      ...m,
      {
        id: Date.now(),
        from: "user",
        name: "You",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        text: input.trim(),
      },
    ]);
    setInput("");
  };

  return (
    <main
      className="flex-1 relative flex flex-col items-center w-full overflow-hidden bg-[#eef0e5]"
      style={{ height: "calc(100vh - 72px)" }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(#415514 1px,transparent 1px),linear-gradient(90deg,#415514 1px,transparent 1px)",
          backgroundSize: "40px 40px",
          opacity: 0.04,
        }}
      />
      <div className="w-full max-w-5xl h-full flex flex-col bg-white border-x-[3px] border-black relative z-10">
        {/* Channel header */}
        <div className="h-16 border-b-[3px] border-black flex items-center justify-between px-6 shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold uppercase"># Global-Grid</span>
              <span className="size-2 rounded-full bg-green-500 border border-black" />
            </div>
            <span className="text-xs font-mono text-gray-500 uppercase">
              128 Nodes Active • P2P Network Live
            </span>
          </div>
          <div className="flex items-center gap-3">
            {["search", "more_horiz"].map((icon) => (
              <button
                key={icon}
                className="size-10 border-[3px] border-black bg-white hover:bg-black hover:text-white flex items-center justify-center shadow-[3px_3px_0px_0px_#000] transition-all"
              >
                <span className="material-symbols-outlined">{icon}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-gray-50">
          <div className="flex justify-center">
            <span className="bg-[#6b8a1e] text-white px-4 py-1 text-xs font-bold uppercase border-2 border-[#415514] shadow-[3px_3px_0px_0px_#1e2809]">
              Today
            </span>
          </div>
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-4 items-start max-w-3xl ${msg.from === "user" ? "flex-row-reverse ml-auto" : ""}`}
            >
              <div className="flex-shrink-0 mt-1">
                <div
                  className={`size-12 border-[3px] border-black flex items-center justify-center shadow-[3px_3px_0px_0px_#415514] ${msg.from === "ai" ? "bg-[#d0db9f]" : msg.from === "user" ? "bg-[#6b8a1e]" : "bg-zinc-500"}`}
                >
                  {msg.from === "ai" && (
                    <span className="material-symbols-outlined text-[24px]">
                      smart_toy
                    </span>
                  )}
                  {msg.from === "user" && (
                    <span className="material-symbols-outlined text-white text-[24px]">
                      person
                    </span>
                  )}
                  {msg.from === "peer" && (
                    <span className="material-symbols-outlined text-white text-[18px]">
                      group
                    </span>
                  )}
                </div>
              </div>
              <div
                className={`flex flex-col gap-2 ${msg.from === "user" ? "items-end" : ""}`}
              >
                <div
                  className={`flex items-baseline gap-2 ${msg.from === "user" ? "flex-row-reverse" : ""}`}
                >
                  <span className="font-bold text-lg">{msg.name}</span>
                  <span className="text-xs font-mono text-gray-500">
                    {msg.time}
                  </span>
                </div>
                <div
                  className={`p-5 border-[3px] border-black ${msg.from === "user" ? "bg-[#6b8a1e] text-white" : "bg-white shadow-[4px_4px_0px_0px_#415514]"}`}
                >
                  <p className="text-sm font-medium">{msg.text}</p>
                  {msg.sub && <p className="text-sm mt-3">{msg.sub}</p>}
                  {msg.actions && (
                    <div className="mt-4 flex gap-3 flex-wrap">
                      {msg.actions.map((a) => (
                        <button
                          key={a}
                          className="px-4 py-2 text-xs font-bold bg-white border-[3px] border-black shadow-[3px_3px_0px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all uppercase text-black"
                        >
                          {a}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Input bar */}
        <div className="p-6 bg-white border-t-[3px] border-black shrink-0">
          <form className="flex gap-4" onSubmit={send}>
            <button
              type="button"
              className="w-14 flex items-center justify-center border-[3px] border-black bg-white hover:bg-black hover:text-white transition-all shadow-[3px_3px_0px_0px_#000]"
            >
              <span className="material-symbols-outlined">add</span>
            </button>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 h-14 px-4 bg-white text-black placeholder:text-gray-400 border-[3px] border-black focus:ring-0 focus:outline-none text-lg font-medium shadow-[3px_3px_0px_0px_#000]"
              placeholder="Ask DeepSeek about grid stats..."
            />
            <button
              type="submit"
              className="w-20 flex items-center justify-center bg-[#6b8a1e] border-[3px] border-[#415514] text-white shadow-[6px_6px_0px_0px_#1e2809] hover:bg-[#415514] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
            >
              <span className="material-symbols-outlined">send</span>
            </button>
          </form>
          <div className="text-center mt-3 flex justify-center gap-2 items-center">
            <div className="h-px bg-gray-300 w-12" />
            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">
              Powered by DeepSeek AI
            </p>
            <div className="h-px bg-gray-300 w-12" />
          </div>
        </div>
      </div>
    </main>
  );
}
