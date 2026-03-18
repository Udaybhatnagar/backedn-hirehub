const mongoose = require("mongoose")

const hireSchema = new mongoose.Schema(
  {
    // The organization that is hiring
    organizationId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    organizationName: { type: String, default: "" },
    organizationEmail: { type: String, default: "" },

    // The trainer being hired
    trainerId: { type: mongoose.Schema.Types.ObjectId, ref: "Trainer", required: true },
    trainerUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    trainerName: { type: String, default: "" },

    // Optional message from org
    message: { type: String, default: "" },

    // Status: pending → accepted | rejected
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model("HireRequest", hireSchema)