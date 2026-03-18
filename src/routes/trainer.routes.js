const router = require("express").Router()
const {
  getAllTrainers,
  getTrainerById,
  createOrUpdateProfile,
  getMyProfile,
  uploadResume,
} = require("../controllers/trainer.controller")
const { protect, requireRole } = require("../middleware/auth")
const upload = require("../middleware/upload")

// Public — get all trainers
router.get("/", getAllTrainers)

// Protected — trainer profile CRUD (must be before /:id)
router.post("/profile", protect, requireRole("trainer"), createOrUpdateProfile)
router.get("/profile/me", protect, requireRole("trainer"), getMyProfile)

// Protected — resume upload
router.post("/resume", protect, requireRole("trainer"), upload.single("resume"), uploadResume)

// Public — get single trainer by ID
router.get("/:id", getTrainerById)

module.exports = router