const HireRequest = require("../models/HireRequest.model")
const Trainer = require("../models/Trainer.model")
const User = require("../models/User.model")

// POST /api/hire — org sends a hire request to a trainer
exports.sendHireRequest = async (req, res) => {
  try {
    const { trainerId, message } = req.body

    // Get org's full user record (JWT only has id+role, not name/email)
    const orgUser = await User.findById(req.user.id).select("name email")
    if (!orgUser) return res.status(404).json({ message: "Organization user not found" })

    // Find the trainer doc to get trainerUserId + name
    const trainerDoc = await Trainer.findById(trainerId)
    if (!trainerDoc) return res.status(404).json({ message: "Trainer not found" })

    // Prevent duplicate pending requests
    const existing = await HireRequest.findOne({
      organizationId: req.user.id,
      trainerId,
      status: "pending",
    })
    if (existing) {
      return res.status(409).json({ message: "You already have a pending hire request for this trainer." })
    }

    const hire = await HireRequest.create({
      organizationId: req.user.id,
      organizationName: orgUser.name,
      organizationEmail: orgUser.email,
      trainerId,
      trainerUserId: trainerDoc.userId,
      trainerName: trainerDoc.name,
      message: message || "",
    })

    res.status(201).json({ message: "Hire request sent", hire })
  } catch (err) {
    res.status(500).json({ message: "Failed to send hire request", error: err.message })
  }
}

// GET /api/hire/trainer — trainer sees all hire requests sent to them
exports.getHireRequestsForTrainer = async (req, res) => {
  try {
    const trainerDoc = await Trainer.findOne({ userId: req.user.id })
    if (!trainerDoc) return res.status(404).json({ message: "Trainer profile not found" })

    const requests = await HireRequest.find({ trainerId: trainerDoc._id }).sort({ createdAt: -1 })
    res.json(requests)
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch hire requests", error: err.message })
  }
}

// PATCH /api/hire/:id/respond — trainer accepts or rejects a hire request
exports.respondToHireRequest = async (req, res) => {
  try {
    const { status } = req.body
    if (!["accepted", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status. Use 'accepted' or 'rejected'." })
    }

    const trainerDoc = await Trainer.findOne({ userId: req.user.id })
    if (!trainerDoc) return res.status(404).json({ message: "Trainer profile not found" })

    const hire = await HireRequest.findOne({ _id: req.params.id, trainerId: trainerDoc._id })
    if (!hire) return res.status(404).json({ message: "Hire request not found" })

    hire.status = status
    await hire.save()

    res.json({ message: `Hire request ${status}`, hire })
  } catch (err) {
    res.status(500).json({ message: "Failed to respond to hire request", error: err.message })
  }
}

// GET /api/hire/org — org sees all hire requests they have sent
exports.getHireRequestsForOrg = async (req, res) => {
  try {
    const requests = await HireRequest.find({ organizationId: req.user.id }).sort({ createdAt: -1 })
    res.json(requests)
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch hire requests", error: err.message })
  }
}