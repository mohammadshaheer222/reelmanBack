const nodemailer = require("nodemailer");

const sendMail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_MAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });
  const mailOptions = {
    to: process.env.SMTP_MAIL,
    subject: options.subject,
    text: options.message,
  };
  await transporter.sendMail(mailOptions);
};

module.exports = sendMail;
