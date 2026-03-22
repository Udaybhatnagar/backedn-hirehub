const User                = require("../models/User.model")
const OtpVerification     = require("../models/OtpVerification.model")
const bcrypt              = require("bcryptjs")
const jwt                 = require("jsonwebtoken")
const { sendOtpEmail }    = require("../utils/mailer")

// ── Helper: generate a 6-digit OTP ──────────────────────────────────────────
const generateOtp = () => String(Math.floor(100000 + Math.random() * 900000))

// ── 1. Register: send OTP instead of creating user immediately ───────────────
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body

    // Block if email already fully registered
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" })
    }

    const hashed      = await bcrypt.hash(password, 10)
    const allowedRoles = ["trainer", "organization"]
    const assignedRole = allowedRoles.includes(role) ? role : "user"

    const otp       = generateOtp()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    // Upsert: replace any previous pending OTP for this email
    await OtpVerification.findOneAndUpdate(
      { email },
      { name, email, password: hashed, role: assignedRole, otp, expiresAt },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    )

    await sendOtpEmail(email, otp)

    res.status(200).json({ message: "OTP sent to your email. Please verify to complete registration." })
  } catch (err) {
    console.error("Register error:", err)
    res.status(500).json({ message: "Registration failed", error: err.message })
  }
}

// ── 2. Verify OTP: validate and create the real User ─────────────────────────
exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body

    const record = await OtpVerification.findOne({ email })
    if (!record) {
      return res.status(400).json({ message: "No pending verification found. Please sign up again." })
    }

    if (new Date() > record.expiresAt) {
      await OtpVerification.deleteOne({ email })
      return res.status(400).json({ message: "OTP has expired. Please sign up again." })
    }

    if (record.otp !== otp.trim()) {
      return res.status(400).json({ message: "Incorrect OTP. Please try again." })
    }

    // OTP correct — create the real user
    const user = await User.create({
      name:     record.name,
      email:    record.email,
      password: record.password,
      role:     record.role,
    })

    // Clean up OTP record
    await OtpVerification.deleteOne({ email })

    res.status(201).json({ message: "Email verified! Account created successfully.", user })
  } catch (err) {
    console.error("Verify OTP error:", err)
    res.status(500).json({ message: "Verification failed", error: err.message })
  }
}

// ── 3. Resend OTP ────────────────────────────────────────────────────────────
exports.resendOtp = async (req, res) => {
  try {
    const { email } = req.body

    const record = await OtpVerification.findOne({ email })
    if (!record) {
      return res.status(400).json({ message: "No pending verification found. Please sign up again." })
    }

    const otp       = generateOtp()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000)

    record.otp       = otp
    record.expiresAt = expiresAt
    await record.save()

    await sendOtpEmail(email, otp)

    res.status(200).json({ message: "A new OTP has been sent to your email." })
  } catch (err) {
    console.error("Resend OTP error:", err)
    res.status(500).json({ message: "Failed to resend OTP", error: err.message })
  }
}

// ── 4. Login ─────────────────────────────────────────────────────────────────
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email })
    if (!user) return res.status(400).json({ message: "Invalid credentials" })

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" })

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    )

    res.json({
      token,
      user: {
        _id:   user._id,
        name:  user.name,
        email: user.email,
        role:  user.role,
      },
    })
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message })
  }
}

// ── 5. Change Password ───────────────────────────────────────────────────────
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body
    const user = await User.findById(req.user.id)
    if (!user) return res.status(404).json({ message: "User not found" })

    const isMatch = await bcrypt.compare(currentPassword, user.password)
    if (!isMatch) return res.status(400).json({ message: "Current password is incorrect" })

    user.password = await bcrypt.hash(newPassword, 10)
    await user.save()
    res.json({ message: "Password changed successfully" })
  } catch (err) {
    res.status(500).json({ message: "Failed to change password", error: err.message })
  }
}