const express = require("express");
const { body, validationResult } = require("express-validator");
const MeterReading = require("../models/MeterReading");
const Installation = require("../models/Installation");
const { authenticate } = require("../middleware/auth");

const router = express.Router();

// GET /api/meter/readings - list readings for user's installations
router.get("/readings", authenticate, async (req, res) => {
  try {
    const { installationId, limit = 100, page = 1 } = req.query;

    // Verify the installation belongs to the user (or user is admin)
    const filter = {};
    if (installationId) {
      if (req.user.role !== "admin") {
        const inst = await Installation.findOne({ _id: installationId, owner: req.user.id });
        if (!inst) return res.status(403).json({ error: "Access denied" });
      }
      filter.installationId = installationId;
    } else if (req.user.role !== "admin") {
      const userInstallations = await Installation.find({ owner: req.user.id }).select("_id");
      filter.installationId = { $in: userInstallations.map((i) => i._id) };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const readings = await MeterReading.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await MeterReading.countDocuments(filter);

    res.json({ readings, total, page: parseInt(page), limit: parseInt(limit) });
  } catch (err) {
    console.error("Meter readings error:", err);
    res.status(500).json({ error: "Failed to fetch readings" });
  }
});

// POST /api/meter/sync - manually sync a meter reading
router.post(
  "/sync",
  authenticate,
  [
    body("installationId").notEmpty(),
    body("generation").isFloat({ min: 0 }),
    body("consumption").isFloat({ min: 0 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const { installationId, generation, consumption } = req.body;

      const installation = await Installation.findOne({
        _id: installationId,
        owner: req.user.id,
        verified: true,
      });
      if (!installation) return res.status(404).json({ error: "Verified installation not found" });

      const surplus = Math.max(0, generation - consumption);

      const reading = await MeterReading.create({
        installationId,
        generation,
        consumption,
        surplus,
        source: "manual",
      });

      res.status(201).json({ reading });
    } catch (err) {
      console.error("Meter sync error:", err);
      res.status(500).json({ error: "Failed to sync reading" });
    }
  }
);

// GET /api/meter/stats/:installationId - aggregated stats
router.get("/stats/:installationId", authenticate, async (req, res) => {
  try {
    const { installationId } = req.params;

    if (req.user.role !== "admin") {
      const inst = await Installation.findOne({ _id: installationId, owner: req.user.id });
      if (!inst) return res.status(403).json({ error: "Access denied" });
    }

    const stats = await MeterReading.aggregate([
      { $match: { installationId: new (require("mongoose").Types.ObjectId)(installationId) } },
      {
        $group: {
          _id: null,
          totalGeneration: { $sum: "$generation" },
          totalConsumption: { $sum: "$consumption" },
          totalSurplus: { $sum: "$surplus" },
          totalTokensMinted: { $sum: "$tokensMinted" },
          readingCount: { $sum: 1 },
        },
      },
    ]);

    res.json({ stats: stats[0] || {} });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

module.exports = router;
