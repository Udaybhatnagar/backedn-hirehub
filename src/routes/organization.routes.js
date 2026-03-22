const router      = require("express").Router()
const multer      = require("multer")
const { protect } = require("../middleware/auth")
const {
  getProfile,
  saveProfile,
  uploadLogo,
} = require("../controllers/organization.controller")

// Memory storage — no disk write, works on Render/serverless
const memUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (_req, file, cb) => {
    const allowed = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp", "image/svg+xml"]
    if (allowed.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error("Only image files are allowed"), false)
    }
  },
})

// All routes require authentication
router.use(protect)

// Get org profile
router.get("/profile", getProfile)

// Save (upsert) org profile fields — JSON body
router.post("/profile", saveProfile)

// Upload organization logo — multipart/form-data, field name: "image"
// Uses memoryStorage, stores as base64 data URL in MongoDB
router.post("/logo", memUpload.single("image"), uploadLogo)

module.exports = router
