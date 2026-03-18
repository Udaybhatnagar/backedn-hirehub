const mongoose = require("mongoose")

const trainingApplicationSchema = new mongoose.Schema(
  {
    // The training being applied for
    trainingId: { type: mongoose.Schema.Types.ObjectId, ref: "Training", required: true },
    trainingTitle: { type: String, default: "" },

    // The org that posted the training (training.postedBy)
    organizationId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    organizationName: { type: String, default: "" },

    // The trainer who is applying
    trainerId: { type: mongoose.Schema.Types.ObjectId, ref: "Trainer", required: true },
    trainerUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    trainerName: { type: String, default: "" },
    trainerEmail: { type: String, default: "" },

    // Optional cover note
    coverNote: { type: String, default: "" },

    // Status: pending → accepted | rejected
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model("TrainingApplication", trainingApplicationSchema)
