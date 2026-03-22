const router = require("express").Router()
const { register, login, changePassword, verifyOtp, resendOtp } = require("../controllers/auth.controller")
const { protect } = require("../middleware/auth")

router.post("/register",        register)
router.post("/verify-otp",      verifyOtp)
router.post("/resend-otp",      resendOtp)
router.post("/login",           login)
router.patch("/change-password", protect, changePassword)

module.exports = router