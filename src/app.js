const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const connectDB = require("./config/db");

// 🔥 ADD THIS
const passport = require("./config/passport");

const authRoutes         = require("./routes/auth.routes");
const trainerRoutes      = require("./routes/trainer.routes");
const hireRoutes         = require("./routes/hire.routes");
const trainingRoutes     = require("./routes/training.routes");
const applicationRoutes  = require("./routes/application.routes");
const organizationRoutes = require("./routes/organization.routes");

connectDB();

const app = express();

// ── Startup diagnostics ────────────────────────────────────────────
console.log('🔍 ENV CHECK:');
console.log('  MONGO_URI:', process.env.MONGO_URI ? '✅ set' : '❌ MISSING');
console.log('  JWT_SECRET:', process.env.JWT_SECRET ? '✅ set' : '❌ MISSING');
console.log('  GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID ? '✅ set' : '⚠️  not set (OAuth disabled)');
console.log('  FRONTEND_URL:', process.env.FRONTEND_URL || '(not set - using hardcoded)');

// ── CORS: allow all origins (reflect) so credentials work everywhere ──
app.use(cors({
  origin: true,  // reflects the request origin — works with credentials
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 🔥 INITIALIZE PASSPORT (VERY IMPORTANT)
app.use(passport.initialize());

// Serve uploaded files (resumes, images, etc.)
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// ================= ROUTES =================
app.use("/api/auth",          authRoutes);
app.use("/api/trainers",      trainerRoutes);
app.use("/api/hire",          hireRoutes);
app.use("/api/trainings",     trainingRoutes);
app.use("/api/applications",  applicationRoutes);
app.use("/api/organizations", organizationRoutes);

// ================= GOOGLE OAUTH ROUTE PREFIX =================
// ⚠️ IMPORTANT: OAuth routes should NOT be under /api
// Because Google expects exact callback path
app.use("/auth", authRoutes);

// Health check
app.get("/", (req, res) => res.json({ status: "HireHub API is running 🚀" }));

module.exports = app;