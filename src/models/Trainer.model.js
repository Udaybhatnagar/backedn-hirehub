const mongoose = require("mongoose")

const trainerSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", unique: true },
    slug: { type: String, unique: true, sparse: true },
    name: { type: String, required: true },
    role: { type: String, default: "Trainer" },
    company: { type: String, default: "" },
    image: { type: String, default: "" },
    location: { type: String, default: "Remote" },
    bio: { type: String, default: "" },
    skills: [{ type: String }],
    hourlyRate: { type: Number, default: 0 },
    availability: {
      type: String,
      enum: ["Available", "Booked", "Weekend Only"],
      default: "Available",
    },
    experience: {
      type: String,
      enum: ["1-3 Years", "3-5 Years", "5-10 Years", "10+ Years"],
      default: "1-3 Years",
    },
    rating: { type: Number, default: 0 },
    reviews: { type: Number, default: 0 },
    students: { type: Number, default: 0 },
    socials: {
      linkedin: { type: String, default: "" },
      twitter: { type: String, default: "" },
      website: { type: String, default: "" },
    },
    resumeUrl: { type: String, default: "" },
    // Extended personal info
    phone: { type: String, default: "" },
    nationality: { type: String, default: "" },
    gender: { type: String, default: "" },
    maritalStatus: { type: String, default: "" },
    dateOfBirth: { type: String, default: "" },
    education: { type: String, default: "" },
    personalWebsite: { type: String, default: "" },
    // Social links (flexible array)
    socialLinks: [
      {
        platform: { type: String, default: "" },
        url: { type: String, default: "" },
      },
    ],
    // Account settings
    jobAlertTitle: { type: String, default: "" },
    jobAlertLocation: { type: String, default: "" },
    profileVisible: { type: Boolean, default: true },
    resumeVisible: { type: Boolean, default: true },
    notifyNewJobs: { type: Boolean, default: true },
    notifyApplications: { type: Boolean, default: true },
    notifyJobAlerts: { type: Boolean, default: true },
    bookmarkedTrainings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Training' }],
  },
  { timestamps: true }
)

module.exports = mongoose.model("Trainer", trainerSchema)