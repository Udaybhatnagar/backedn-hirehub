const User = require("../models/User.model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" })
    }

    const hashed = await bcrypt.hash(password, 10)

    const allowedRoles = ["trainer", "organization"]
    const assignedRole = allowedRoles.includes(role) ? role : "user"

    const user = await User.create({
      name,
      email,
      password: hashed,
      role: assignedRole,
    })

    res.status(201).json({ message: "Account created successfully", user })
  } catch (err) {
    res.status(500).json({ message: "Registration failed", error: err.message })
  }
}

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
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message })
  }
}

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