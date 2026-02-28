require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const morgan = require("morgan");
const { Server } = require("socket.io");
const rateLimit = require("express-rate-limit");

const { connectDB, connectRedis } = require("./config/db");
const authRoutes = require("./routes/auth");
const installationsRoutes = require("./routes/installations");
const meterRoutes = require("./routes/meter");
const predictRoutes = require("./routes/predict");
const { verifyToken } = require("./middleware/auth");
const { startMeterPoller } = require("./services/meterPoller");
const ChatMessage = require("./models/ChatMessage");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "*",
    methods: ["GET", "POST"],
  },
});

// Middleware
app.use(cors({ origin: process.env.FRONTEND_URL || "*" }));
app.use(express.json());
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api/", apiLimiter);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/installations", installationsRoutes);
app.use("/api/meter", meterRoutes);
app.use("/api/predict", predictRoutes);

// Health check
app.get("/health", (req, res) => res.json({ status: "ok", timestamp: new Date().toISOString() }));

// 404 handler
app.use((req, res) => res.status(404).json({ error: "Not found" }));

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ error: err.message || "Internal server error" });
});

// Socket.io - Real-time chat
io.use((socket, next) => {
  const token = socket.handshake.auth?.token;
  if (!token) return next(new Error("Authentication required"));
  try {
    const decoded = verifyToken(token);
    socket.user = decoded;
    next();
  } catch (err) {
    next(new Error("Invalid token"));
  }
});

io.on("connection", (socket) => {
  console.log(`Socket connected: ${socket.id} (${socket.user?.walletAddress || socket.user?.email})`);

  socket.on("join_room", (room) => {
    socket.join(room);
    socket.emit("joined", { room });
  });

  socket.on("send_message", async (data) => {
    try {
      const { room, message } = data;
      const sender = socket.user?.walletAddress || socket.user?.email;
      const chatMsg = await ChatMessage.create({ sender, message, room });
      io.to(room).emit("new_message", {
        id: chatMsg._id,
        sender: chatMsg.sender,
        message: chatMsg.message,
        timestamp: chatMsg.timestamp,
      });
    } catch (err) {
      socket.emit("error", { message: "Failed to save message" });
    }
  });

  socket.on("get_history", async ({ room, limit = 50 }) => {
    try {
      const messages = await ChatMessage.find({ room })
        .sort({ timestamp: -1 })
        .limit(limit)
        .lean();
      socket.emit("message_history", messages.reverse());
    } catch (err) {
      socket.emit("error", { message: "Failed to fetch history" });
    }
  });

  socket.on("disconnect", () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 4000;

async function start() {
  await connectDB();
  await connectRedis();
  server.listen(PORT, () => {
    console.log(`Faltric backend running on port ${PORT}`);
    startMeterPoller();
  });
}

start().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});

module.exports = { app, server };
