const nodemailer = require('nodemailer');

console.log('🔍 Checking Gmail credentials:');
console.log('GMAIL_USER:', process.env.GMAIL_USER);
console.log('GMAIL_APP_PASSWORD:', process.env.GMAIL_APP_PASSWORD ? '***configured***' : '❌ MISSING');

// Gmail SMTP configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
    }
});

transporter.verify((error, success) => {
    if (error) {
        console.log("❌ Gmail SMTP тохиргоо буруу байна:", error.message);
    } else {
        console.log("✅ Gmail SMTP тохиргоо амжилттай бэлэн боллоо!");
    }
});

module.exports = transporter;
