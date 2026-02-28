const express = require("express");
const { body, validationResult } = require("express-validator");
const User = require("../models/User");
const { signToken, authenticate } = require("../middleware/auth");

const router = express.Router();

// POST /api/auth/register
router.post(
  "/register",
  [
    body("email").isEmail().normalizeEmail(),
    body("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const { email, password } = req.body;
      const existing = await User.findOne({ email });
      if (existing) return res.status(409).json({ error: "Email already registered" });

      const user = await User.create({ email, passwordHash: password });
      const token = signToken({ id: user._id, email: user.email, role: user.role });

      res.status(201).json({ token, user: user.toSafeObject() });
    } catch (err) {
      console.error("Register error:", err);
      res.status(500).json({ error: "Registration failed" });
    }
  }
);

// POST /api/auth/login
router.post(
  "/login",
  [
    body("email").isEmail().normalizeEmail(),
    body("password").notEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) return res.status(401).json({ error: "Invalid credentials" });

      const isValid = await user.comparePassword(password);
      if (!isValid) return res.status(401).json({ error: "Invalid credentials" });

      const token = signToken({
        id: user._id,
        email: user.email,
        role: user.role,
        walletAddress: user.walletAddress,
      });

      res.json({ token, user: user.toSafeObject() });
    } catch (err) {
      console.error("Login error:", err);
      res.status(500).json({ error: "Login failed" });
    }
  }
);

// POST /api/auth/link-wallet
router.post(
  "/link-wallet",
  authenticate,
  [body("walletAddress").matches(/^0x[a-fA-F0-9]{40}$/).withMessage("Invalid wallet address")],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const { walletAddress } = req.body;
      const normalized = walletAddress.toLowerCase();

      const existing = await User.findOne({ walletAddress: normalized });
      if (existing && existing._id.toString() !== req.user.id) {
        return res.status(409).json({ error: "Wallet already linked to another account" });
      }

      const user = await User.findByIdAndUpdate(
        req.user.id,
        { walletAddress: normalized },
        { new: true }
      );

      const token = signToken({
        id: user._id,
        email: user.email,
        role: user.role,
        walletAddress: user.walletAddress,
      });

      res.json({ token, user: user.toSafeObject() });
    } catch (err) {
      console.error("Link wallet error:", err);
      res.status(500).json({ error: "Failed to link wallet" });
    }
  }
);

// GET /api/auth/me
router.get("/me", authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-passwordHash");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

module.exports = router;
