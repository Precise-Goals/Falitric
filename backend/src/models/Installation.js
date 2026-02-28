const mongoose = require("mongoose");

const installationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["solar", "wind", "biogas"],
      required: true,
    },
    coordinates: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
      },
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    walletAddress: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    capacityKw: {
      type: Number,
      required: true,
      min: 0,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    rejectionReason: {
      type: String,
      default: null,
    },
    polygon: {
      type: mongoose.Schema.Types.Mixed, // GeoJSON polygon from admin draw
      default: null,
    },
  },
  { timestamps: true }
);

installationSchema.index({ coordinates: "2dsphere" });

module.exports = mongoose.model("Installation", installationSchema);
