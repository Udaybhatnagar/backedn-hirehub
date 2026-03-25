const router = require("express").Router();
const { register, login, changePassword, verifyOtp, resendOtp } = require("../controllers/auth.controller");
const { protect } = require("../middleware/auth");
const passport = require("../config/passport");
const jwt = require("jsonwebtoken");

// ================= ROUTES =================
router.post("/register", register);
router.post("/verify-otp", verifyOtp);
router.post("/resend-otp", resendOtp);
router.post("/login", login);
router.patch("/change-password", protect, changePassword);

module.exports = router;

// ================= GOOGLE OAUTH =================

// Step 1: Redirect to Google
router.get("/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
);

// Step 2: Callback from Google — use custom callback to handle errors properly
router.get("/google/callback",
    (req, res, next) => {
        passport.authenticate("google", { session: false }, (err, user, info) => {
            const frontendURL = process.env.FRONTEND_URL || "http://localhost:5173";

            if (err) {
                console.error("❌ Google OAuth error:", err);
                return res.redirect(`${frontendURL}/login?error=google_failed`);
            }

            if (!user) {
                console.error("❌ Google OAuth: no user returned.", info);
                return res.redirect(`${frontendURL}/login?error=google_failed`);
            }

            // Generate JWT
            const token = jwt.sign(
                { id: user._id, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: "7d" }
            );

            const userData = encodeURIComponent(JSON.stringify({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            }));

            console.log("✅ Google OAuth success for:", user.email);
            res.redirect(`${frontendURL}/auth/callback?token=${token}&user=${userData}`);
        })(req, res, next);
    }
);

module.exports = router;