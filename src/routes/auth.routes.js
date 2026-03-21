const router = require("express").Router()
const { register, login, changePassword } = require("../controllers/auth.controller")
const { protect } = require("../middleware/auth")

router.post("/register", register)
router.post("/login", login)
router.patch("/change-password", protect, changePassword)

module.exports = router