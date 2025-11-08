const nodemailer = require("nodemailer");

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Only POST allowed" });
  }

  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: "Email required" });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `"Newsletter" <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER,
      subject: "New Newsletter Subscriber",
      text: `Шинэ хэрэглэгч бүртгэгдлээ: ${email}`,
    });

    res.status(200).json({ message: "Subscribed successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Email sending failed" });
  }
}
