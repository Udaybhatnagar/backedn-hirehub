const Trainer = require("../models/Trainer.model")

// GET /api/trainers — public
exports.getAllTrainers = async (req, res) => {
  try {
    const trainers = await Trainer.find().sort({ createdAt: -1 })
    res.json(trainers)
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch trainers", error: err.message })
  }
}

// GET /api/trainers/:id — public
exports.getTrainerById = async (req, res) => {
  try {
    const trainer = await Trainer.findById(req.params.id)
    if (!trainer) return res.status(404).json({ message: "Trainer not found" })
    res.json(trainer)
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch trainer", error: err.message })
  }
}

// POST /api/trainers/profile — trainer only (protected)
exports.createOrUpdateProfile = async (req, res) => {
  try {
    const userId = req.user.id
    const data = req.body

    const trainer = await Trainer.findOneAndUpdate(
      { userId },
      { ...data, userId },
      { upsert: true, new: true, runValidators: true }
    )

    res.json({ message: "Profile saved", trainer })
  } catch (err) {
    res.status(500).json({ message: "Failed to save profile", error: err.message })
  }
}

// GET /api/trainers/profile/me — trainer only (protected)
exports.getMyProfile = async (req, res) => {
  try {
    const trainer = await Trainer.findOne({ userId: req.user.id })
    if (!trainer) return res.status(404).json({ message: "Profile not found" })
    res.json(trainer)
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch profile", error: err.message })
  }
}

// POST /api/trainers/resume — trainer only (protected, multipart)
exports.uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" })
    }
    const trainer = await Trainer.findOneAndUpdate(
      { userId: req.user.id },
      { resumeUrl: req.file.filename },
      { new: true }
    )
    if (!trainer) return res.status(404).json({ message: "Trainer profile not found. Please create your profile first." })
    res.json({ message: "Resume uploaded", resumeUrl: req.file.filename, trainer })
  } catch (err) {
    res.status(500).json({ message: "Failed to upload resume", error: err.message })
  }
}