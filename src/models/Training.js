const mongoose = require("mongoose")

const trainingSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    company: { type: String, default: "" },
    logo: { type: String, default: "" },
    location: { type: String, default: "" },
    category: { type: String, default: "" },
    type: {
      type: String,
      enum: ["Full Time", "Part Time", "Freelance", "Seasonal", "Fixed Price", "Remote"],
      default: "Full Time",
    },
    experience: {
      type: String,
      enum: ["No-experience", "Fresher", "Intermediate", "Expert"],
      default: "Fresher",
    },
    salaryMin: { type: Number, default: 0 },
    salaryMax: { type: Number, default: 0 },
    tags: [{ type: String }],
    description: { type: String, default: "" },
    rating: { type: Number, default: 0 },
    reviews: { type: Number, default: 0 },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    postedAt: { type: String, default: "Just now" },
  },
  { timestamps: true }
)

module.exports = mongoose.model("Training", trainingSchema)