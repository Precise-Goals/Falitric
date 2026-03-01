import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { initializeApp } from "firebase/app";
import {
  getDatabase,
  ref,
  get,
  set,
  update,
  push,
  onValue,
  remove,
} from "firebase/database";

import { onRequest } from "firebase-functions/v2/https";

dotenv.config(); // Load local .env
dotenv.config({ path: "../.env" }); // Load Vite root .env as fallback

const app = express();

const allowedOrigins = ["https://flactric.vercel.app", "http://localhost:5173","https://falitric.vercel.app"];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);

app.use(express.json());

// Export as Firebase Function
export const api = onRequest({ region: "asia-southeast1" }, app);

// Standard export for Vercel/Others
export default app;

const PORT = process.env.PORT || 3000;

// Initialize Firebase App
const firebaseConfig = {
  apiKey: process.env.VITE_API_KEY,
  authDomain: process.env.VITE_AUTH_DOMAIN,
  databaseURL: process.env.VITE_DATABASE_URL,
  projectId: process.env.VITE_PROJECT_ID,
  storageBucket: process.env.VITE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_APP_ID,
  measurementId: process.env.VITE_MEASUREMENT_ID,
};

const firebaseApp = initializeApp(firebaseConfig);
const database = getDatabase(firebaseApp);

// Test Route
app.get("/api/ping", (req, res) => {
  res.json({ message: "pong" });
});

// REST Endpoint: Get generic data with basic query support
app.get(/^\/api\/db\/(.*)/, async (req, res) => {
  try {
    const dbPath = req.params[0];
    const { limitToLast: limit } = req.query;

    let dbRef = ref(database, dbPath);
    const snap = await get(dbRef);

    if (snap.exists()) {
      let data = snap.val();

      // Basic simulation of limitToLast for batching
      if (limit && typeof data === "object" && !Array.isArray(data)) {
        const entries = Object.entries(data);
        const limited = entries.slice(-parseInt(limit));
        data = Object.fromEntries(limited);
      } else if (limit && Array.isArray(data)) {
        data = data.slice(-parseInt(limit));
      }

      res.json(data);
    } else {
      res.status(404).json({ error: "Data not found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// REST Endpoint: Set generic data
app.post(/^\/api\/db\/(.*)/, async (req, res) => {
  try {
    const dbPath = req.params[0];
    const data = req.body;
    await set(ref(database, dbPath), data);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// REST Endpoint: Update generic data
app.patch(/^\/api\/db\/(.*)/, async (req, res) => {
  try {
    const dbPath = req.params[0];
    const data = req.body;
    await update(ref(database, dbPath), data);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// REST Endpoint: Push generic data (append to list)
app.put(/^\/api\/db\/(.*)/, async (req, res) => {
  try {
    const dbPath = req.params[0];
    const data = req.body;
    const newRef = push(ref(database, dbPath));
    await set(newRef, data);
    res.json({ success: true, key: newRef.key });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// REST Endpoint: Remove generic data
app.delete(/^\/api\/db\/(.*)/, async (req, res) => {
  try {
    const dbPath = req.params[0];
    await remove(ref(database, dbPath));
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Sarvam AI Chat Proxy
app.post("/api/ai/chat", async (req, res) => {
  try {
    const { message, history } = req.body;
    const apiKey = process.env.VITE_SARVAM_API_KEY;

    if (!apiKey) {
      console.error("[AI_PROXY] Missing VITE_SARVAM_API_KEY in .env");
      return res.status(500).json({ error: "Sarvam API key missing" });
    }

    console.log(
      "[AI_PROXY] Requesting Sarvam AI with message:",
      message.slice(0, 50) + "...",
    );

    // Build messages array with history
    const apiMessages = [
      {
        role: "system",
        content:
          "You are Faltric AI, a specialist in environment, sustainability, and eco-friendly solutions with a deep focus on nature. You MUST ONLY respond to queries related to these topics. If a query is unrelated, politely redirect it back to environmental sustainability. Keep your responses extremely concise and helpful.",
      },
    ];

    // Add relevant history if provided (limit to last 10 to avoid token bloat)
    if (history && Array.isArray(history)) {
      history.slice(-10).forEach((h) => {
        apiMessages.push({
          role:
            h.sender === "oracle" || h.sender === "system"
              ? "assistant"
              : "user",
          content: h.text,
        });
      });
    }

    // Add final user message
    apiMessages.push({ role: "user", content: message });

    const sarvamRes = await fetch("https://api.sarvam.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-subscription-key": apiKey,
      },
      body: JSON.stringify({
        model: "sarvam-m",
        messages: apiMessages,
      }),
    });

    if (!sarvamRes.ok) {
      const errText = await sarvamRes.text();
      let errJson;
      try {
        errJson = JSON.parse(errText);
      } catch (e) {
        errJson = { error: errText };
      }
      console.error(
        "[AI_PROXY] Sarvam API Rejection:",
        sarvamRes.status,
        errJson,
      );
      return res.status(sarvamRes.status).json({
        error: "Sarvam AI rejected the transmission",
        details: errJson,
      });
    }

    const data = await sarvamRes.json();
    console.log("[AI_PROXY] Sarvam AI Response received.");
    res.json({
      text:
        data.choices?.[0]?.message?.content || "TRANSMISSION_ERROR: AI_OFFLINE",
    });
  } catch (err) {
    console.error("[AI_PROXY] Critical Proxy failure:", err);
    res.status(500).json({ error: "AI node communication failure" });
  }
});

// Server-Sent Events (SSE) Endpoint for real-time `onValue` subscription
app.get(/^\/api\/stream\/(.*)/, (req, res) => {
  const dbPath = req.params[0];

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  // Send an initial connected message
  res.write(": connected\n\n");

  const unsubscribe = onValue(
    ref(database, dbPath),
    (snap) => {
      const data = snap.val();
      res.write(`data: ${JSON.stringify(data)}\n\n`);
    },
    (error) => {
      console.error("Firebase read failed:", error);
      res.write(
        `event: error\ndata: ${JSON.stringify({ error: error.message })}\n\n`,
      );
    },
  );

  // Client disconnected
  req.on("close", () => {
    unsubscribe();
  });
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
