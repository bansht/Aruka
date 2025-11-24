const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.SMTP_USER || process.env.GMAIL_USER,
        pass: process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD,
    },
    tls: {
        rejectUnauthorized: false
    }
});

transporter.verify((error, success) => {
    if (error) {
        console.log("SMTP тохиргоо буруу байна:", error.message);
        console.log("SMTP_USER:", process.env.SMTP_USER);
        console.log("SMTP_PASS:", process.env.SMTP_PASS ? '***configured***' : 'undefined');
    } else {
        console.log("SMTP тохиргоо амжилттай бэлэн боллоо ✓");
    }
});

module.exports = transporter;
