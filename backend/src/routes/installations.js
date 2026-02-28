const express = require("express");
const { body, param, validationResult } = require("express-validator");
const Installation = require("../models/Installation");
const { authenticate, requireAdmin } = require("../middleware/auth");

const router = express.Router();

// GET /api/installations - list all verified installations (public map data)
router.get("/", async (req, res) => {
  try {
    const { type, verified } = req.query;
    const filter = {};
    if (type) filter.type = type;
    if (verified !== undefined) filter.verified = verified === "true";

    const installations = await Installation.find(filter)
      .populate("owner", "email walletAddress")
      .lean();

    // Anonymize owner details
    const sanitized = installations.map((inst) => ({
      ...inst,
      owner: inst.owner?.walletAddress
        ? `${inst.owner.walletAddress.slice(0, 6)}...${inst.owner.walletAddress.slice(-4)}`
        : "Unknown",
    }));

    res.json({ installations: sanitized });
  } catch (err) {
    console.error("List installations error:", err);
    res.status(500).json({ error: "Failed to fetch installations" });
  }
});

// GET /api/installations/my - list user's own installations
router.get("/my", authenticate, async (req, res) => {
  try {
    const installations = await Installation.find({ owner: req.user.id }).lean();
    res.json({ installations });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch installations" });
  }
});

// GET /api/installations/:id
router.get("/:id", async (req, res) => {
  try {
    const installation = await Installation.findById(req.params.id)
      .populate("owner", "walletAddress")
      .lean();
    if (!installation) return res.status(404).json({ error: "Installation not found" });
    res.json({ installation });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch installation" });
  }
});

// POST /api/installations - create installation
router.post(
  "/",
  authenticate,
  [
    body("name").notEmpty().trim(),
    body("type").isIn(["solar", "wind", "biogas"]),
    body("coordinates").isArray({ min: 2, max: 2 }),
    body("capacityKw").isFloat({ min: 0 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const { name, type, coordinates, capacityKw, polygon } = req.body;
      const walletAddress = req.user.walletAddress;
      if (!walletAddress) {
        return res.status(400).json({ error: "Wallet not linked. Please link your wallet first." });
      }

      const installation = await Installation.create({
        name,
        type,
        coordinates: { type: "Point", coordinates },
        owner: req.user.id,
        walletAddress,
        capacityKw,
        polygon: polygon || null,
      });

      res.status(201).json({ installation });
    } catch (err) {
      console.error("Create installation error:", err);
      res.status(500).json({ error: "Failed to create installation" });
    }
  }
);

// PATCH /api/installations/:id - update own installation
router.patch("/:id", authenticate, async (req, res) => {
  try {
    const installation = await Installation.findOne({ _id: req.params.id, owner: req.user.id });
    if (!installation) return res.status(404).json({ error: "Installation not found" });

    const allowedFields = ["name", "capacityKw", "polygon"];
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) installation[field] = req.body[field];
    });

    await installation.save();
    res.json({ installation });
  } catch (err) {
    res.status(500).json({ error: "Failed to update installation" });
  }
});

// DELETE /api/installations/:id
router.delete("/:id", authenticate, async (req, res) => {
  try {
    const filter = { _id: req.params.id };
    if (req.user.role !== "admin") filter.owner = req.user.id;

    const installation = await Installation.findOneAndDelete(filter);
    if (!installation) return res.status(404).json({ error: "Installation not found" });

    res.json({ message: "Installation deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete installation" });
  }
});

// PATCH /api/installations/:id/approve - Admin: approve
router.patch("/:id/approve", authenticate, requireAdmin, async (req, res) => {
  try {
    const installation = await Installation.findByIdAndUpdate(
      req.params.id,
      { status: "approved", verified: true, rejectionReason: null },
      { new: true }
    );
    if (!installation) return res.status(404).json({ error: "Installation not found" });
    res.json({ installation });
  } catch (err) {
    res.status(500).json({ error: "Failed to approve installation" });
  }
});

// PATCH /api/installations/:id/reject - Admin: reject
router.patch("/:id/reject", authenticate, requireAdmin, async (req, res) => {
  try {
    const { reason } = req.body;
    const installation = await Installation.findByIdAndUpdate(
      req.params.id,
      { status: "rejected", verified: false, rejectionReason: reason || "No reason provided" },
      { new: true }
    );
    if (!installation) return res.status(404).json({ error: "Installation not found" });
    res.json({ installation });
  } catch (err) {
    res.status(500).json({ error: "Failed to reject installation" });
  }
});

// GET /api/installations/admin/pending - Admin: list pending
router.get("/admin/pending", authenticate, requireAdmin, async (req, res) => {
  try {
    const installations = await Installation.find({ status: "pending" })
      .populate("owner", "email walletAddress")
      .lean();
    res.json({ installations });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch pending installations" });
  }
});

module.exports = router;
