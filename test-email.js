require("dotenv").config()
const nodemailer = require("nodemailer")

console.log("EMAIL_USER:", process.env.EMAIL_USER)
console.log("EMAIL_PASS length:", process.env.EMAIL_PASS ? process.env.EMAIL_PASS.length : "NOT SET")

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

transporter.verify((error, success) => {
  if (error) {
    console.error("❌ SMTP Error:", error.message)
    console.error("Full error:", JSON.stringify(error, null, 2))
  } else {
    console.log("✅ Gmail SMTP connected! Sending test OTP...")
    transporter.sendMail({
      from: `"HireHub" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: "HireHub OTP Test",
      text: "Test OTP: 123456 — If you see this, email is working!",
    }, (err, info) => {
      if (err) console.error("❌ Send failed:", err.message)
      else console.log("✅ Test email sent! MessageId:", info.messageId)
      process.exit(0)
    })
  }
})
