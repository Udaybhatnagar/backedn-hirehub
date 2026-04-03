const OrgProfile = require("../models/OrgProfile.model")

// ── GET /api/organizations/profile ─────────────────────────────────────────────
const getProfile = async (req, res) => {
  try {
    // Try both _id (ObjectId) and id (string) forms for robustness
    const profile = await OrgProfile.findOne({
      $or: [
        { userId: req.user._id },
        { userId: req.user.id },
      ]
    })
    res.json(profile || {})
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch profile" })
  }
}

// ── POST /api/organizations/profile ────────────────────────────────────────────
const saveProfile = async (req, res) => {
  try {
    const allowed = [
      "name", "logo", "description", "website", "industry", "companySize",
      "location", "phone", "founded", "teamSize", "about",
      "socialLinks", "notifyApplications", "notifyHire", "profileVisible",
    ]

    const update = {}
    allowed.forEach((key) => {
      if (req.body[key] !== undefined) update[key] = req.body[key]
    })

    const profile = await OrgProfile.findOneAndUpdate(
      { userId: req.user._id },
      {
        $set: update,
        $setOnInsert: { userId: req.user._id || req.user.id }, // ensure userId set on first create
      },
      { new: true, upsert: true, runValidators: true }
    )

    res.json({ organization: profile })
  } catch (err) {
    console.error("saveProfile error:", err)
    res.status(500).json({ message: "Failed to save profile" })
  }
}

// ── POST /api/organizations/logo ────────────────────────────────────────────────
// Receives image via multer memoryStorage, converts to base64 data URL,
// and stores it directly in MongoDB — works on any host (no local disk needed).
const uploadLogo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image file provided" })
    }

    const mime     = req.file.mimetype                          // e.g. "image/png"
    const b64      = req.file.buffer.toString("base64")
    const logoUrl  = `data:${mime};base64,${b64}`              // data URL

    const profile = await OrgProfile.findOneAndUpdate(
      { userId: req.user._id },
      {
        $set: { logo: logoUrl },
        $setOnInsert: { userId: req.user._id || req.user.id }, // ensure userId set on first create
      },
      { new: true, upsert: true }
    )

    res.json({ logoUrl, organization: profile })
  } catch (err) {
    console.error("uploadLogo error:", err)
    res.status(500).json({ message: "Logo upload failed" })
  }
}

module.exports = { getProfile, saveProfile, uploadLogo }
