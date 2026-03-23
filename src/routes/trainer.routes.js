const router = require("express").Router()
const {
  getAllTrainers,
  getTrainerById,
  getTrainerBySlug,
  createOrUpdateProfile,
  getMyProfile,
  uploadResume,
  toggleBookmark,
  getBookmarks,
  uploadProfileImage,
} = require("../controllers/trainer.controller")
const { protect, requireRole } = require("../middleware/auth")
const upload = require("../middleware/upload")
const uploadImage = require("../middleware/uploadImage")

// Public — get all trainers
router.get("/", getAllTrainers)

// Protected — trainer profile CRUD (must be before /:id)
router.post("/profile", protect, requireRole("trainer"), createOrUpdateProfile)
router.get("/profile/me", protect, requireRole("trainer"), getMyProfile)

// Protected — resume upload
router.post("/resume", protect, requireRole("trainer"), upload.single("resume"), uploadResume)

// Protected — profile image upload
router.post("/profile-image", protect, requireRole("trainer"), uploadImage.single("image"), uploadProfileImage)

// Protected — bookmarks
router.patch("/bookmark/:trainingId", protect, requireRole("trainer"), toggleBookmark)
router.get("/bookmarks", protect, requireRole("trainer"), getBookmarks)

// Public — get single trainer by slug (for portfolio pages) — MUST be before /:id
router.get("/slug/:slug", getTrainerBySlug)

// Public — get single trainer by ID
router.get("/:id", getTrainerById)

module.exports = router