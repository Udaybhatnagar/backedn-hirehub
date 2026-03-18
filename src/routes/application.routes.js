const router = require("express").Router()
const {
  applyForTraining,
  getMyApplicationsAsTrainer,
  getApplicationsForOrg,
  respondToApplication,
} = require("../controllers/application.controller")
const { protect, requireRole } = require("../middleware/auth")

// Trainer applies for a training
router.post("/", protect, requireRole("trainer"), applyForTraining)

// Trainer sees their own applications
router.get("/trainer", protect, requireRole("trainer"), getMyApplicationsAsTrainer)

// Org sees all applications for their trainings
router.get("/org", protect, requireRole("organization"), getApplicationsForOrg)

// Org accepts or rejects an application
router.patch("/:id/respond", protect, requireRole("organization"), respondToApplication)

module.exports = router
