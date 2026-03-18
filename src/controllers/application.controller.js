const TrainingApplication = require("../models/TrainingApplication.model")
const Trainer = require("../models/Trainer.model")
const Training = require("../models/Training")
const User = require("../models/User.model")

// POST /api/applications — trainer applies for a training
exports.applyForTraining = async (req, res) => {
  try {
    const { trainingId, coverNote } = req.body

    // Get the trainer's profile
    const trainerDoc = await Trainer.findOne({ userId: req.user.id })
    if (!trainerDoc) {
      return res.status(404).json({ message: "Please set up your trainer profile before applying." })
    }

    // Get the trainer's user record for email (JWT only has id+role)
    const trainerUser = await User.findById(req.user.id).select("email")

    // Get the training to find the org (postedBy)
    const training = await Training.findById(trainingId)
    if (!training) return res.status(404).json({ message: "Training not found" })

    // Get org name from the org user record
    const orgUser = await User.findById(training.postedBy).select("name")

    // Prevent duplicate applications
    const existing = await TrainingApplication.findOne({
      trainingId,
      trainerId: trainerDoc._id,
      status: "pending",
    })
    if (existing) {
      return res.status(409).json({ message: "You have already applied for this training." })
    }

    const application = await TrainingApplication.create({
      trainingId,
      trainingTitle: training.title,
      organizationId: training.postedBy,
      organizationName: orgUser?.name || training.company || "",
      trainerId: trainerDoc._id,
      trainerUserId: req.user.id,
      trainerName: trainerDoc.name,
      trainerEmail: trainerUser?.email || "",
      coverNote: coverNote || "",
    })

    res.status(201).json({ message: "Application submitted", application })
  } catch (err) {
    res.status(500).json({ message: "Failed to apply", error: err.message })
  }
}

// GET /api/applications/trainer — trainer sees their own applications
exports.getMyApplicationsAsTrainer = async (req, res) => {
  try {
    const trainerDoc = await Trainer.findOne({ userId: req.user.id })
    if (!trainerDoc) return res.status(404).json({ message: "Trainer profile not found" })

    const applications = await TrainingApplication.find({ trainerId: trainerDoc._id }).sort({ createdAt: -1 })
    res.json(applications)
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch applications", error: err.message })
  }
}

// GET /api/applications/org — org sees all applications for their trainings (with full trainer profile)
exports.getApplicationsForOrg = async (req, res) => {
  try {
    const applications = await TrainingApplication.find({ organizationId: req.user.id }).sort({ createdAt: -1 })

    // Enrich each application with full trainer profile
    const enriched = await Promise.all(
      applications.map(async (app) => {
        const plain = app.toObject()
        try {
          const trainerProfile = await Trainer.findById(app.trainerId).lean()
          plain.trainerProfile = trainerProfile || null
        } catch {
          plain.trainerProfile = null
        }
        return plain
      })
    )

    res.json(enriched)
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch applications", error: err.message })
  }
}

// PATCH /api/applications/:id/respond — org accepts or rejects an application
exports.respondToApplication = async (req, res) => {
  try {
    const { status } = req.body
    if (!["accepted", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status. Use 'accepted' or 'rejected'." })
    }

    const application = await TrainingApplication.findOne({
      _id: req.params.id,
      organizationId: req.user.id,
    })
    if (!application) return res.status(404).json({ message: "Application not found" })

    application.status = status
    await application.save()

    // Re-enrich with trainer profile
    const plain = application.toObject()
    try {
      plain.trainerProfile = await Trainer.findById(application.trainerId).lean()
    } catch {
      plain.trainerProfile = null
    }

    res.json({ message: `Application ${status}`, application: plain })
  } catch (err) {
    res.status(500).json({ message: "Failed to respond to application", error: err.message })
  }
}
