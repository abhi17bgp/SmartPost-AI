const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD
  },
  tls: {
    rejectUnauthorized: false
  },
  connectionTimeout: 10000, // 10 seconds
  greetingTimeout: 10000,   // 10 seconds
  socketTimeout: 15000      // 15 seconds
});

const sendEmail = async (options) => {
  // 2) Define the email options
  const mailOptions = {
    from: process.env.EMAIL_FROM || `SmartPost AI <${process.env.EMAIL_USERNAME}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html
  };

  // 3) Actually send the email
  try {
    console.log(`📩 Sending email to: ${options.email}`);
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent: ${info.messageId}`);
    return info;
  } catch (err) {
    console.error(`❌ EMAIL ERROR: ${err.message}`);
    throw err;
  }
};

module.exports = sendEmail;
