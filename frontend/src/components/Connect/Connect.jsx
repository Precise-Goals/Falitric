import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { useAuth } from "../../contexts/AuthContext.jsx";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:4000";

export default function Connect() {
  const { token, user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [room, setRoom] = useState("general");
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    if (!token) return;

    const s = io(SOCKET_URL, {
      auth: { token },
      transports: ["websocket", "polling"],
    });

    s.on("connect", () => {
      setConnected(true);
      setError("");
      s.emit("join_room", room);
      s.emit("get_history", { room, limit: 50 });
    });

    s.on("disconnect", () => setConnected(false));
    s.on("connect_error", (err) => setError(err.message));

    s.on("message_history", (history) => {
      setMessages(history);
    });

    s.on("new_message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    s.on("error", (err) => setError(err.message));

    setSocket(s);
    return () => s.disconnect();
  }, [token, room]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function sendMessage(e) {
    e.preventDefault();
    if (!input.trim() || !socket) return;
    socket.emit("send_message", { room, message: input.trim() });
    setInput("");
  }

  const rooms = ["general", "solar-traders", "wind-traders", "biogas-traders"];
  const me = user?.walletAddress || user?.email;

  return (
    <div className="flex h-full gap-4 max-h-[calc(100vh-8rem)]">
      {/* Room list */}
      <div className="w-48 shrink-0">
        <div className="card h-full">
          <h3 className="text-sm font-semibold text-gray-400 mb-3">Rooms</h3>
          <div className="space-y-1">
            {rooms.map((r) => (
              <button
                key={r}
                onClick={() => { setRoom(r); setMessages([]); }}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  room === r ? "bg-primary-600 text-white" : "text-gray-400 hover:bg-gray-800"
                }`}
              >
                # {r}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col card overflow-hidden p-0">
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <h3 className="font-semibold"># {room}</h3>
          <span className={`flex items-center gap-1.5 text-xs ${connected ? "text-green-400" : "text-red-400"}`}>
            <span className="w-2 h-2 rounded-full bg-current"></span>
            {connected ? "Connected" : "Disconnected"}
          </span>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {error && <p className="text-red-400 text-sm">{error}</p>}
          {messages.map((msg, i) => {
            const isMe = msg.sender === me;
            return (
              <div key={msg.id || i} className={`flex gap-2 ${isMe ? "flex-row-reverse" : ""}`}>
                <div
                  className={`max-w-xs px-3 py-2 rounded-2xl text-sm ${
                    isMe ? "bg-primary-600 text-white" : "bg-gray-800 text-gray-200"
                  }`}
                >
                  {!isMe && (
                    <p className="text-xs text-gray-400 mb-1 font-mono">
                      {msg.sender?.length > 20
                        ? `${msg.sender.slice(0, 6)}...${msg.sender.slice(-4)}`
                        : msg.sender}
                    </p>
                  )}
                  <p>{msg.message}</p>
                  <p className="text-xs opacity-50 mt-1">
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>

        <form onSubmit={sendMessage} className="p-4 border-t border-gray-800 flex gap-2">
          <input
            className="input flex-1"
            placeholder={connected ? "Type a message..." : "Connecting..."}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={!connected}
          />
          <button type="submit" disabled={!connected || !input.trim()} className="btn-primary px-6">
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
