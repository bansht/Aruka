const transporter = require("../config/nodemailer-gmail");

const sendContactEmail = async ({ name, email, phone, subject, message }) => {
  try {
    // Send notification to admin
    await transporter.sendMail({
      from: `"Mongolia Trekking Contact" <${process.env.GMAIL_USER}>`,
      to: process.env.RECEIVE_EMAIL || process.env.GMAIL_USER,
      subject: `🔔 Шинэ Contact/Feedback: ${subject || 'Сэдэвгүй'}`,
      html: `
        <h2>🔔 Шинэ Contact/Feedback ирлээ</h2>
        <hr/>
        <p><strong>Нэр:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Утас:</strong> ${phone || 'Оруулаагүй'}</p>
        <p><strong>Сэдэв:</strong> ${subject || 'Оруулаагүй'}</p>
        <hr/>
        <p><strong>Мессеж:</strong></p>
        <p style="background: #f5f5f5; padding: 15px; border-radius: 5px;">
          ${message.replace(/\n/g, '<br/>')}
        </p>
        <hr/>
        <p><small>Огноо: ${new Date().toLocaleString('mn-MN')}</small></p>
      `,
      replyTo: email
    });

    // Send confirmation to user
    await transporter.sendMail({
      from: `"Mongolia Trekking" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "Таны мессежийг хүлээн авлаа - Mongolia Trekking",
      html: `
        <h2>Баярлалаа, ${name}!</h2>
        <p>Бид таны мессежийг амжилттай хүлээн авлаа.</p>
        <p>Бидний баг удахгүй та нартай холбогдох болно.</p>
        <hr/>
        <p><strong>Таны илгээсэн мессеж:</strong></p>
        <p style="background: #f5f5f5; padding: 15px; border-radius: 5px;">
          ${message.replace(/\n/g, '<br/>')}
        </p>
        <hr/>
        <p>Хүндэтгэсэн,</p>
        <p><strong>Mongolia Trekking Tours</strong></p>
        <p style="font-size: 12px; color: #666;">
          Email: ${process.env.GMAIL_USER}<br/>
          Website: mongoliatrekking.tours
        </p>
      `,
    });

    return { success: true, message: "Email successfully sent" };
  } catch (error) {
    console.error("Contact email error:", error);
    throw error;
  }
};

module.exports = { sendContactEmail };
