const express = require("express");
const { authenticate } = require("../middleware/auth");
const Installation = require("../models/Installation");
const MeterReading = require("../models/MeterReading");

const router = express.Router();

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || "http://localhost:8000";

// GET /api/predict/:installationId
router.get("/:installationId", authenticate, async (req, res) => {
  try {
    const { installationId } = req.params;

    // Verify access
    const filter = { _id: installationId };
    if (req.user.role !== "admin") filter.owner = req.user.id;

    const installation = await Installation.findOne(filter).lean();
    if (!installation) return res.status(404).json({ error: "Installation not found" });

    // Gather historical readings (last 30)
    const readings = await MeterReading.find({ installationId })
      .sort({ createdAt: -1 })
      .limit(30)
      .lean();

    const historical_data = readings.map((r) => ({
      generation: r.generation,
      consumption: r.consumption,
      date: r.createdAt,
    }));

    // Default weather payload (in real app, fetch from weather API)
    const weather = {
      solar_irradiance: 500,
      wind_speed: 5.0,
      precipitation: 0.0,
    };

    const payload = {
      installation_id: installationId,
      installation_type: installation.type,
      historical_data,
      weather,
    };

    const aiRes = await fetch(`${AI_SERVICE_URL}/predict`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!aiRes.ok) {
      const errText = await aiRes.text();
      console.error("AI service error:", errText);
      return res.status(502).json({ error: "AI service unavailable" });
    }

    const prediction = await aiRes.json();
    res.json({ prediction, installation: { id: installationId, type: installation.type } });
  } catch (err) {
    console.error("Predict error:", err);
    res.status(500).json({ error: "Failed to get prediction" });
  }
});

module.exports = router;
