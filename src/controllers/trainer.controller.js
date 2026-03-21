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

// PATCH /api/trainers/bookmark/:trainingId — toggle bookmark
exports.toggleBookmark = async (req, res) => {
  try {
    const User = require("../models/User.model")
    const Trainer = require("../models/Trainer.model")
    const user = await User.findById(req.user.id)
    // Upsert: create a minimal profile if one does not exist
    let trainer = await Trainer.findOneAndUpdate(
      { userId: req.user.id },
      { $setOnInsert: { name: user?.name || 'Trainer', userId: req.user.id } },
      { upsert: true, new: true }
    )

    const id = req.params.trainingId
    const idx = trainer.bookmarkedTrainings.findIndex(b => b.toString() === id)
    if (idx === -1) {
      trainer.bookmarkedTrainings.push(id)
    } else {
      trainer.bookmarkedTrainings.splice(idx, 1)
    }
    await trainer.save()
    res.json({ bookmarked: idx === -1, bookmarkedTrainings: trainer.bookmarkedTrainings })
  } catch (err) {
    res.status(500).json({ message: "Failed to toggle bookmark", error: err.message })
  }
}

// GET /api/trainers/bookmarks — get bookmarked trainings
exports.getBookmarks = async (req, res) => {
  try {
    const Trainer = require("../models/Trainer.model")
    const trainer = await Trainer.findOne({ userId: req.user.id }).populate("bookmarkedTrainings")
    if (!trainer) return res.json([]) // No profile yet — return empty array
    res.json(trainer.bookmarkedTrainings || [])
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch bookmarks", error: err.message })
  }
}

// POST /api/trainers/profile-image — upload profile picture
exports.uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" })
    const User = require("../models/User.model")
    const Trainer = require("../models/Trainer.model")
    const user = await User.findById(req.user.id)
    const imageUrl = `/uploads/images/${req.file.filename}`
    // Upsert: create a minimal profile if one does not exist
    const trainer = await Trainer.findOneAndUpdate(
      { userId: req.user.id },
      { image: imageUrl, $setOnInsert: { name: user?.name || 'Trainer', userId: req.user.id } },
      { upsert: true, new: true }
    )
    res.json({ message: "Profile image uploaded", imageUrl, trainer })
  } catch (err) {
    res.status(500).json({ message: "Failed to upload image", error: err.message })
  }
}