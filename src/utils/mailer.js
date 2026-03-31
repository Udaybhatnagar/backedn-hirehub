const nodemailer = require("nodemailer")

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // SSL
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

// Verify connection config on startup
transporter.verify((error) => {
  if (error) {
    console.error("[Mailer] SMTP connection failed:", error.message)
  } else {
    console.log("[Mailer] ✅ Gmail SMTP ready — sending from:", process.env.EMAIL_USER)
  }
})

/**
 * Send an OTP email using Gmail SMTP.
 * @param {string} to  - Recipient email address
 * @param {string} otp - 6-digit OTP code
 */
const sendOtpEmail = async (to, otp) => {
  console.log(`[Mailer] Sending OTP to: ${to} | From: ${process.env.EMAIL_USER}`)
  const mailOptions = {
    from: `"HireHub" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Your HireHub Email Verification OTP",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 32px; background: #0B0E0D; color: #ffffff; border-radius: 12px;">
        <div style="text-align: center; margin-bottom: 24px;">
          <div style="display:inline-block; background:#10b981; padding:12px 20px; border-radius:10px;">
            <span style="font-size:24px; font-weight:900; color:#000; letter-spacing:1px;">HireHub</span>
          </div>
        </div>
        <h2 style="text-align:center; color:#10b981; margin-bottom:8px;">Verify Your Email</h2>
        <p style="text-align:center; color:#9ca3af; margin-bottom:32px;">Enter the OTP below to complete your registration. It expires in <strong style="color:#fff">10 minutes</strong>.</p>
        <div style="display:inline-block; background:#1A1D1C; border:1px solid #10b981; border-radius:10px; padding:14px 28px; margin-bottom:28px; box-shadow:0 0 16px rgba(16,185,129,0.15);">
          <span style="font-size:30px; font-weight:800; letter-spacing:8px; color:#10b981; font-family:monospace;">${otp}</span>
        </div>
        <p style="text-align:center; color:#6b7280; font-size:13px;">If you did not request this, please ignore this email.</p>
        <hr style="border-color:#374151; margin:24px 0;" />
        <p style="text-align:center; color:#4b5563; font-size:12px;">© 2025 HireHub. All rights reserved.</p>
      </div>
    `,
  }

  await transporter.sendMail(mailOptions)
}

module.exports = { sendOtpEmail }
