const Training = require("../models/Training")
const OrgProfile = require("../models/OrgProfile.model")

// Helper: attach org logo to a plain training object
async function attachLogo(training) {
  const obj = training.toObject ? training.toObject() : { ...training }
  if (obj.logo) return obj // already has a logo
  try {
    const org = await OrgProfile.findOne({ userId: obj.postedBy }).select("logo").lean()
    if (org && org.logo) obj.logo = org.logo
  } catch {}
  return obj
}

// GET /api/trainings — public
exports.getAllTrainings = async (req, res) => {
  try {
    const trainings = await Training.find().sort({ createdAt: -1 })
    const withLogos = await Promise.all(trainings.map(attachLogo))
    res.json(withLogos)
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch trainings", error: err.message })
  }
}

// GET /api/trainings/:id — public
exports.getTrainingById = async (req, res) => {
  try {
    const training = await Training.findById(req.params.id)
    if (!training) return res.status(404).json({ message: "Training not found" })
    const withLogo = await attachLogo(training)
    res.json(withLogo)
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch training", error: err.message })
  }
}

// POST /api/trainings — organization only (protected)
exports.addTraining = async (req, res) => {
  try {
    // Fetch the org's logo so it's embedded directly on the training
    let logo = req.body.logo || ''
    if (!logo) {
      try {
        const orgProfile = await OrgProfile.findOne({ userId: req.user.id }).select('logo').lean()
        if (orgProfile?.logo) logo = orgProfile.logo
      } catch {}
    }

    const training = await Training.create({
      ...req.body,
      logo,
      postedBy: req.user.id,
      postedAt: "Just now",
    })
    res.status(201).json({ message: "Training posted", training })
  } catch (err) {
    res.status(500).json({ message: "Failed to post training", error: err.message })
  }
}

// GET /api/trainings/my — organization only (protected)
exports.getMyTrainings = async (req, res) => {
  try {
    const trainings = await Training.find({ postedBy: req.user.id }).sort({ createdAt: -1 })
    res.json(trainings)
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch your trainings", error: err.message })
  }
}

// DELETE /api/trainings/:id — organization only (protected)
exports.deleteTraining = async (req, res) => {
  try {
    const training = await Training.findById(req.params.id)
    if (!training) return res.status(404).json({ message: "Training not found" })

    if (training.postedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to delete this training" })
    }

    await training.deleteOne()
    res.json({ message: "Training deleted" })
  } catch (err) {
    res.status(500).json({ message: "Failed to delete training", error: err.message })
  }
}
