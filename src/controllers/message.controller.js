const Message  = require("../models/Message.model")
const Training = require("../models/Training")

// ── POST /api/messages — anyone can send a message to an org ─────────────────
exports.sendMessage = async (req, res) => {
  try {
    const { trainingId, senderName, senderEmail, senderPhone, message } = req.body

    if (!trainingId || !senderName || !senderEmail || !message) {
      return res.status(400).json({ message: "trainingId, senderName, senderEmail and message are required" })
    }

    // Look up the training to find the org owner
    const training = await Training.findById(trainingId)
    if (!training) {
      return res.status(404).json({ message: "Training not found" })
    }

    const newMsg = await Message.create({
      trainingId,
      orgUserId: training.postedBy,
      senderName,
      senderEmail,
      senderPhone: senderPhone || "",
      message,
    })

    res.status(201).json({ message: "Message sent successfully", data: newMsg })
  } catch (err) {
    console.error("sendMessage error:", err)
    res.status(500).json({ message: "Failed to send message", error: err.message })
  }
}

// ── GET /api/messages/mine — org sees all their messages ──────────────────────
exports.getMyMessages = async (req, res) => {
  try {
    const messages = await Message.find({ orgUserId: req.user.id })
      .populate("trainingId", "title")
      .sort({ createdAt: -1 })

    res.json(messages)
  } catch (err) {
    console.error("getMyMessages error:", err)
    res.status(500).json({ message: "Failed to fetch messages", error: err.message })
  }
}

// ── PATCH /api/messages/:id/read — mark a single message read ────────────────
exports.markRead = async (req, res) => {
  try {
    const msg = await Message.findOneAndUpdate(
      { _id: req.params.id, orgUserId: req.user.id },
      { isRead: true },
      { new: true }
    )
    if (!msg) return res.status(404).json({ message: "Message not found" })
    res.json(msg)
  } catch (err) {
    res.status(500).json({ message: "Failed to mark read", error: err.message })
  }
}

// ── PATCH /api/messages/read-all — mark all unread messages read ──────────────
exports.markAllRead = async (req, res) => {
  try {
    await Message.updateMany({ orgUserId: req.user.id, isRead: false }, { isRead: true })
    res.json({ message: "All messages marked as read" })
  } catch (err) {
    res.status(500).json({ message: "Failed to mark all read", error: err.message })
  }
}
