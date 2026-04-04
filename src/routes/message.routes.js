const router = require("express").Router()
const {
  sendMessage,
  getMyMessages,
  markRead,
  markAllRead,
} = require("../controllers/message.controller")
const { protect, requireRole } = require("../middleware/auth")

// Public — anyone can send a message
router.post("/", sendMessage)

// Protected — org only
router.get("/mine",         protect, requireRole("organization"), getMyMessages)
router.patch("/read-all",   protect, requireRole("organization"), markAllRead)
router.patch("/:id/read",   protect, requireRole("organization"), markRead)

module.exports = router
