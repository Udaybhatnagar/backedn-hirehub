const express = require("express")
const cors = require("cors")
const path = require("path")
require("dotenv").config()

const connectDB = require("./config/db")

const authRoutes         = require("./routes/auth.routes")
const trainerRoutes      = require("./routes/trainer.routes")
const hireRoutes         = require("./routes/hire.routes")
const trainingRoutes     = require("./routes/training.routes")
const applicationRoutes  = require("./routes/application.routes")
const organizationRoutes = require("./routes/organization.routes")

connectDB()

const app = express()

app.use(cors())
app.use(express.json())

// Serve uploaded files (resumes, images, etc.)
app.use("/uploads", express.static(path.join(__dirname, "../uploads")))

app.use("/api/auth",          authRoutes)
app.use("/api/trainers",      trainerRoutes)
app.use("/api/hire",          hireRoutes)
app.use("/api/trainings",     trainingRoutes)
app.use("/api/applications",  applicationRoutes)
app.use("/api/organizations", organizationRoutes)

// Health check — required for Render to confirm the service is alive
app.get("/", (req, res) => res.json({ status: "HireHub API is running 🚀" }))

module.exports = app