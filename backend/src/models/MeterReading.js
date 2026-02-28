const mongoose = require("mongoose");

const meterReadingSchema = new mongoose.Schema(
  {
    installationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Installation",
      required: true,
      index: true,
    },
    generation: {
      type: Number, // kWh generated
      required: true,
      min: 0,
    },
    consumption: {
      type: Number, // kWh consumed
      required: true,
      min: 0,
    },
    surplus: {
      type: Number, // max(0, generation - consumption)
      required: true,
      min: 0,
    },
    tokensMinted: {
      type: Number,
      default: 0,
    },
    txHash: {
      type: String,
      default: null,
    },
    source: {
      type: String,
      enum: ["poller", "manual", "api"],
      default: "poller",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("MeterReading", meterReadingSchema);
