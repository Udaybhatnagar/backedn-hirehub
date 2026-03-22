const mongoose = require("mongoose")

const otpVerificationSchema = new mongoose.Schema({
  email:     { type: String, required: true, unique: true },
  name:      { type: String, required: true },
  password:  { type: String, required: true },   // already bcrypt-hashed
  role:      { type: String, required: true },
  otp:       { type: String, required: true },
  expiresAt: { type: Date,   required: true },
})

// Automatically delete expired documents (MongoDB TTL index)
otpVerificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })

module.exports = mongoose.model("OtpVerification", otpVerificationSchema)
