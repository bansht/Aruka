// Хэрвээ Brevo ажиллахгүй бол, nodemailer-gmail ашигла
// const transporter = require("../config/nodemailer-gmail");
const transporter = require("../config/nodemailer");
const Email = require("../models/Email");

const sendSubscribeEmail = async (email) => {
  try {
    // Check if email already exists, if not create
    const existingEmail = await Email.findOne({ email });
    
    if (!existingEmail) {
      await Email.create({ email });
    }

    // Send email notification regardless
    await transporter.sendMail({
      from: `"Mongolia Trekking" <${process.env.GMAIL_USER}>`,
      to: process.env.RECEIVE_EMAIL || process.env.GMAIL_USER,
      subject: "🔔 Шинэ Newsletter Subscribe хүсэлт",
      html: `
        <h2>✅ Newsletter Subscribe хүсэлт</h2>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Статус:</strong> ${existingEmail ? 'Аль хэдийн бүртгэлтэй' : 'Шинэ бүртгэл'}</p>
        <p><strong>Огноо:</strong> ${new Date().toLocaleString('mn-MN')}</p>
      `,
      text: `Newsletter хүсэлт: ${email}`,
    });

    await transporter.sendMail({
      from: `"Mongolia Trekking" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "Welcome to Mongolia Trekking Newsletter",
      html: `
        <h2>Баярлалаа!</h2>
        <p>Та Mongolia Trekking-ийн newsletter-д амжилттай бүртгэгдлээ.</p>
        <p>Бид танд Монголын аялал, tour болон бусад сонирхолтой мэдээллүүдийг тогтмол илгээх болно.</p>
        <br/>
        <p>Хүндэтгэсэн,</p>
        <p><strong>Mongolia Trekking Tours</strong></p>
      `,
      text: `Баярлалаа! Та Mongolia Trekking-ийн newsletter-д амжилттай бүртгэгдлээ.`,
    });

    return { success: true, message: "Subscribed successfully" };
  } catch (error) {
    console.error("Subscribe error:", error);
    throw error;
  }
};

module.exports = { sendSubscribeEmail };
