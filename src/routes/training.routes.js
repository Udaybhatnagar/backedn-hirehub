const router = require("express").Router()
const {
  getAllTrainings,
  addTraining,
  getMyTrainings,
  deleteTraining,
} = require("../controllers/training.controller")
const { protect, requireRole } = require("../middleware/auth")

// Public
router.get("/", getAllTrainings)

// Protected — org only
router.post("/", protect, requireRole("organization"), addTraining)
router.get("/my", protect, requireRole("organization"), getMyTrainings)
router.delete("/:id", protect, requireRole("organization"), deleteTraining)

module.exports = router