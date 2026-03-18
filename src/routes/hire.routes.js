const router = require("express").Router()
const {
  sendHireRequest,
  getHireRequestsForTrainer,
  respondToHireRequest,
  getHireRequestsForOrg,
} = require("../controllers/hire.controller")
const { protect, requireRole } = require("../middleware/auth")

// Org sends a hire request to a trainer
router.post("/", protect, requireRole("organization"), sendHireRequest)

// Org sees all hire requests they've sent
router.get("/org", protect, requireRole("organization"), getHireRequestsForOrg)

// Trainer sees all hire requests sent to them
router.get("/trainer", protect, requireRole("trainer"), getHireRequestsForTrainer)

// Trainer accepts or rejects a hire request
router.patch("/:id/respond", protect, requireRole("trainer"), respondToHireRequest)

module.exports = router