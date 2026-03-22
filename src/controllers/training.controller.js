const Training = require("../models/Training")

// GET /api/trainings — public
exports.getAllTrainings = async (req, res) => {
  try {
    const trainings = await Training.find().sort({ createdAt: -1 })
    res.json(trainings)
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch trainings", error: err.message })
  }
}

// GET /api/trainings/:id — public
exports.getTrainingById = async (req, res) => {
  try {
    const training = await Training.findById(req.params.id)
    if (!training) return res.status(404).json({ message: "Training not found" })
    res.json(training)
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch training", error: err.message })
  }
}

// POST /api/trainings — organization only (protected)
exports.addTraining = async (req, res) => {
  try {
    const training = await Training.create({
      ...req.body,
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
