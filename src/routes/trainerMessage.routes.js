const router = require("express").Router()
const {
  sendTrainerMessage,
  getMyTrainerMessages,
  markTrainerMessageRead,
  markAllTrainerMessagesRead,
} = require("../controllers/trainerMessage.controller")
const { protect, requireRole } = require("../middleware/auth")

// Public — anyone can send a message to a trainer
router.post("/", sendTrainerMessage)

// Protected — trainer only
router.get("/mine",        protect, requireRole("trainer"), getMyTrainerMessages)
router.patch("/read-all",  protect, requireRole("trainer"), markAllTrainerMessagesRead)
router.patch("/:id/read",  protect, requireRole("trainer"), markTrainerMessageRead)

module.exports = router
