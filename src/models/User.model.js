const mongoose = require("mongoose")

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String }, // optional — Google OAuth users have no password
    googleId: { type: String },  // for Google OAuth
    role: {
      type: String,
      enum: ["user", "trainer", "organization", "admin"],
      default: "user",
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model("User", userSchema)