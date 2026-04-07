const TrainerMessage = require("../models/TrainerMessage.model")
const Trainer        = require("../models/Trainer.model")

// ── POST /api/trainer-messages — anyone can send a message to a trainer ───────
exports.sendTrainerMessage = async (req, res) => {
  try {
    const { trainerProfileId, senderName, senderEmail, senderPhone, message } = req.body

    if (!trainerProfileId || !senderName || !senderEmail || !message) {
      return res.status(400).json({ message: "trainerProfileId, senderName, senderEmail and message are required" })
    }

    // Look up the trainer profile to get the userId
    const trainer = await Trainer.findById(trainerProfileId)
    if (!trainer) return res.status(404).json({ message: "Trainer not found" })
    if (!trainer.userId) return res.status(400).json({ message: "Trainer account not linked" })

    const newMsg = await TrainerMessage.create({
      trainerProfileId,
      trainerUserId: trainer.userId,
      senderName,
      senderEmail,
      senderPhone: senderPhone || "",
      message,
    })

    res.status(201).json({ message: "Message sent successfully", data: newMsg })
  } catch (err) {
    console.error("sendTrainerMessage error:", err)
    res.status(500).json({ message: "Failed to send message", error: err.message })
  }
}

// ── GET /api/trainer-messages/mine — trainer sees all their messages ──────────
exports.getMyTrainerMessages = async (req, res) => {
  try {
    const messages = await TrainerMessage.find({ trainerUserId: req.user.id })
      .sort({ createdAt: -1 })

    res.json(messages)
  } catch (err) {
    console.error("getMyTrainerMessages error:", err)
    res.status(500).json({ message: "Failed to fetch messages", error: err.message })
  }
}

// ── PATCH /api/trainer-messages/:id/read ─────────────────────────────────────
exports.markTrainerMessageRead = async (req, res) => {
  try {
    const msg = await TrainerMessage.findOneAndUpdate(
      { _id: req.params.id, trainerUserId: req.user.id },
      { isRead: true },
      { new: true }
    )
    if (!msg) return res.status(404).json({ message: "Message not found" })
    res.json(msg)
  } catch (err) {
    res.status(500).json({ message: "Failed to mark read", error: err.message })
  }
}

// ── PATCH /api/trainer-messages/read-all ─────────────────────────────────────
exports.markAllTrainerMessagesRead = async (req, res) => {
  try {
    await TrainerMessage.updateMany(
      { trainerUserId: req.user.id, isRead: false },
      { isRead: true }
    )
    res.json({ message: "All messages marked as read" })
  } catch (err) {
    res.status(500).json({ message: "Failed to mark all read", error: err.message })
  }
}
