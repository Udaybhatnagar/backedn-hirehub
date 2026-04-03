const router = require("express").Router()
const {
  getAllTrainings,
  getTrainingById,
  addTraining,
  getMyTrainings,
  deleteTraining,
  expireTraining,
} = require("../controllers/training.controller")
const { protect, requireRole } = require("../middleware/auth")

// Public
router.get("/", getAllTrainings)

// Protected — org only — must be before /:id to avoid route conflict
router.get("/my", protect, requireRole("organization"), getMyTrainings)
router.post("/", protect, requireRole("organization"), addTraining)
router.patch("/:id/expire", protect, requireRole("organization"), expireTraining)
router.delete("/:id", protect, requireRole("organization"), deleteTraining)

// Public — single training by ID (after /my to avoid conflict)
router.get("/:id", getTrainingById)

module.exports = router