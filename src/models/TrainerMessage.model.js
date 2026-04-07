const mongoose = require("mongoose")

const trainerMessageSchema = new mongoose.Schema(
  {
    // The trainer's profile _id (so we can look up by trainer page)
    trainerProfileId: { type: mongoose.Schema.Types.ObjectId, ref: "Trainer", required: true },
    // The trainer's user _id (so the trainer can query their own messages)
    trainerUserId:    { type: mongoose.Schema.Types.ObjectId, ref: "User",    required: true },
    senderName:       { type: String, required: true, trim: true },
    senderEmail:      { type: String, required: true, trim: true },
    senderPhone:      { type: String, default: "" },
    message:          { type: String, required: true, trim: true },
    isRead:           { type: Boolean, default: false },
  },
  { timestamps: true }
)

module.exports = mongoose.model("TrainerMessage", trainerMessageSchema)
