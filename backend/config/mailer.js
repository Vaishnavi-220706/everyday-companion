// config/mailer.js
// Nodemailer transporter configuration

const nodemailer = require('nodemailer');

// Create reusable transporter using Gmail SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS  // Use Gmail App Password (not your real password)
  }
});

/**
 * Send a reminder email
 * @param {string} to - recipient email
 * @param {string} subject - email subject
 * @param {string} html - HTML body of email
 */
const sendEmail = async (to, subject, html) => {
  const mailOptions = {
    from: `"Everyday Companion 🌟" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`📧 Email sent to ${to}: ${info.messageId}`);
    return info;
  } catch (err) {
    console.error(`❌ Email failed to ${to}:`, err.message);
    throw err;
  }
};

module.exports = { sendEmail };
