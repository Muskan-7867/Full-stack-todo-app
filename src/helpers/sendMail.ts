const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  
  secure: true, // true for port 465, false for other ports
  auth: {
    user: "learncodewith2004@gmail.com",
    pass: "fukxexgwdtraphuv",
  },
});

// async..await is not allowed in global scope, must use a wrapper
async function sendMail(to, subject, text, html) {
  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: 'learncodewith2004@gmail.com', // sender address
    to, 
    subject,
    text,
    html,
  })

}

module.exports = {sendMail}