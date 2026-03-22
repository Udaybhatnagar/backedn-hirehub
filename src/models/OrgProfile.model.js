const mongoose = require("mongoose")

const orgProfileSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },

    // Identity
    name:        { type: String, default: "" },
    logo:        { type: String, default: "" },   // URL or upload path
    description: { type: String, default: "" },
    website:     { type: String, default: "" },
    industry:    { type: String, default: "" },
    companySize: { type: String, default: "" },

    // Contact / Location
    location:  { type: String, default: "" },
    phone:     { type: String, default: "" },
    founded:   { type: String, default: "" },
    teamSize:  { type: String, default: "" },
    about:     { type: String, default: "" },

    // Social links: [{ platform, url }]
    socialLinks: [{ platform: String, url: String }],

    // Preferences
    notifyApplications: { type: Boolean, default: true },
    notifyHire:         { type: Boolean, default: true },
    profileVisible:     { type: Boolean, default: true },
  },
  { timestamps: true }
)

module.exports = mongoose.model("OrgProfile", orgProfileSchema)
