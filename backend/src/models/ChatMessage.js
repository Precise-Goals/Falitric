const mongoose = require("mongoose");

const chatMessageSchema = new mongoose.Schema(
  {
    sender: {
      type: String, // walletAddress or email
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
    room: {
      type: String,
      required: true,
      default: "general",
      index: true,
    },
  },
  {
    timestamps: { createdAt: "timestamp", updatedAt: false },
  }
);

module.exports = mongoose.model("ChatMessage", chatMessageSchema);
