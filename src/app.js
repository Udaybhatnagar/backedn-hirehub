const express = require("express")
const cors = require("cors")
const path = require("path")
require("dotenv").config()

const connectDB = require("./config/db")

const authRoutes = require("./routes/auth.routes")
const trainerRoutes = require("./routes/trainer.routes")
const hireRoutes = require("./routes/hire.routes")
const trainingRoutes = require("./routes/training.routes")
const applicationRoutes = require("./routes/application.routes")

connectDB()

const app = express()

app.use(cors())
app.use(express.json())

// Serve uploaded files (resumes, etc.)
app.use("/uploads", express.static(path.join(__dirname, "../uploads")))

app.use("/api/auth", authRoutes)
app.use("/api/trainers", trainerRoutes)
app.use("/api/hire", hireRoutes)
app.use("/api/trainings", trainingRoutes)
app.use("/api/applications", applicationRoutes)

module.exports = app