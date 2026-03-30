const mongoose = require("mongoose")

const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    console.error("❌ MONGO_URI environment variable is not set! Please add it in Render → Environment.")
    return // Don't crash — server will still start so health checks pass
  }
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log("✅ MongoDB Connected")
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message)
    // Don't exit — allows server to start and return proper errors
  }
}

module.exports = connectDB