// src/app/api/sendMail.js
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
 
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS,
  },
});

// Function to send mail
async function sendMail(to, subject, text, html) {
  const mailOptions = {
    from:  process.env.EMAIL_USER, 
    to,
    subject,
    text,
    html,
  };

  await transporter.sendMail(mailOptions);
}

module.exports = { sendMail };
