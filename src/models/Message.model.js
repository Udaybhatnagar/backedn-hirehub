const mongoose = require("mongoose")

const messageSchema = new mongoose.Schema(
  {
    trainingId:  { type: mongoose.Schema.Types.ObjectId, ref: "Training", required: true },
    orgUserId:   { type: mongoose.Schema.Types.ObjectId, ref: "User",     required: true },
    senderName:  { type: String, required: true, trim: true },
    senderEmail: { type: String, required: true, trim: true },
    senderPhone: { type: String, default: "" },
    message:     { type: String, required: true, trim: true },
    isRead:      { type: Boolean, default: false },
  },
  { timestamps: true }
)

module.exports = mongoose.model("Message", messageSchema)
