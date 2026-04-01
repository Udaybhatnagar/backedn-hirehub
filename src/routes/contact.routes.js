const express = require("express")
const router = express.Router()
const { sendOtpEmail } = require("../utils/mailer")

// POST /api/contact — sends contact form message to admin email
router.post("/", async (req, res) => {
  try {
    const { firstName, lastName, email, phone, subject, message } = req.body

    if (!firstName || !email || !message) {
      return res.status(400).json({ message: "Name, email and message are required." })
    }

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 32px; background: #0B0E0D; color: #ffffff; border-radius: 12px;">
        <div style="text-align: center; margin-bottom: 24px;">
          <div style="display:inline-block; background:#10b981; padding:12px 20px; border-radius:10px;">
            <span style="font-size:24px; font-weight:900; color:#000; letter-spacing:1px;">HireHub</span>
          </div>
        </div>
        <h2 style="color:#10b981; text-align:center; margin-bottom:4px;">New Contact Form Submission</h2>
        <p style="text-align:center; color:#9ca3af; margin-bottom:28px;">Someone filled out the contact form on HireHub.</p>

        <div style="background:#1A1D1C; border:1px solid #374151; border-radius:12px; padding:24px; margin-bottom:20px;">
          <table style="width:100%; border-collapse:collapse;">
            <tr><td style="color:#9ca3af; padding:8px 0; font-size:13px; width:120px;">Name</td><td style="color:#fff; font-weight:bold;">${firstName} ${lastName || ""}</td></tr>
            <tr><td style="color:#9ca3af; padding:8px 0; font-size:13px;">Email</td><td style="color:#10b981;">${email}</td></tr>
            ${phone ? `<tr><td style="color:#9ca3af; padding:8px 0; font-size:13px;">Phone</td><td style="color:#fff;">${phone}</td></tr>` : ""}
            ${subject ? `<tr><td style="color:#9ca3af; padding:8px 0; font-size:13px;">Subject</td><td style="color:#fff;">${subject}</td></tr>` : ""}
          </table>
        </div>

        <div style="background:#1A1D1C; border:1px solid #374151; border-radius:12px; padding:24px; margin-bottom:24px;">
          <p style="color:#9ca3af; font-size:13px; margin:0 0 8px 0;">Message</p>
          <p style="color:#ffffff; font-size:15px; line-height:1.7; margin:0;">${message.replace(/\n/g, "<br>")}</p>
        </div>

        <p style="text-align:center; color:#6b7280; font-size:12px;">Received via HireHub Contact Page — Reply directly to ${email}</p>
        <hr style="border-color:#374151; margin:20px 0;" />
        <p style="text-align:center; color:#4b5563; font-size:12px;">© 2025 HireHub. All rights reserved.</p>
      </div>
    `

    // Reuse mailer — send to admin email
    const nodemailer = require("nodemailer")
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      requireTLS: true,
      family: 4,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: { rejectUnauthorized: false },
    })

    await transporter.sendMail({
      from: `"HireHub Contact" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, // send to techiguru.in@gmail.com
      replyTo: email,             // reply goes to the person who contacted
      subject: `[HireHub] New Message from ${firstName} ${lastName || ""} — ${subject || "Contact Form"}`,
      html,
    })

    res.status(200).json({ message: "Message sent successfully!" })
  } catch (err) {
    console.error("Contact form error:", err)
    res.status(500).json({ message: "Failed to send message. Please try again.", error: err.message })
  }
})

module.exports = router
