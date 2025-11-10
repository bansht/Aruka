const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
// const promocategoryRoute = require("./routes/promocategory")

// Routes
const authorRoute = require("./routes/author");
const guidesRoute = require("./routes/guides");
const sliderRoute = require("./routes/slider");
const tourRoute = require("./routes/tour");
const upcomingRoute = require("./routes/upcoming");
const userRoute = require("./routes/user");
const newsRoute = require("./routes/news");
const cartRoute = require("./routes/cart");
const orderRoute = require("./routes/order");
const instgmRoute = require("./routes/instgm");
const testimonialsRoute = require("./routes/testimonials");
const sponsorRoute = require("./routes/sponsor");
const categoryRoute = require("./routes/category");
const contactRoute = require("./routes/contact");
const nodemailer = require("nodemailer");
const emailRoute = require("./routes/email");

const app = express();
const cookieParser = require("cookie-parser");
const multer = require("multer");
const bodyParser = require("body-parser");
const uploadMiddleware = multer({
  dest: "uploads/",
  limits: { fileSize: 300 * 1024 * 1024 },
});
const fs = require("fs");
const dotenv = require("dotenv");
mongoose.set("strictQuery", true);
const requestIp = require("request-ip");

dotenv.config({ path: "./config/config.env" });
require("dotenv").config();

app.set("trust proxy", true);
app.use(requestIp.mw());
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json({ limit: "300mb" }));
app.use("/uploads", express.static(__dirname + "/uploads"));
app.use("/api/v1/news", newsRoute);
app.use("/api/v1/authors", authorRoute);
app.use("/api/v1/guides", guidesRoute);
app.use("/api/v1/sliders", sliderRoute);
app.use("/api/v1/tour", tourRoute);
app.use("/api/v1/upcomings", upcomingRoute);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/cart", cartRoute);
app.use("/api/v1/order", orderRoute);
app.use("/api/v1/instgm", instgmRoute);
app.use("/api/v1/testimonials", testimonialsRoute);
app.use("/api/v1/sponsors", sponsorRoute);
app.use("/api/v1/categories", categoryRoute);
app.use("/api/v1/contact", contactRoute);
app.use("/api/v1/email", emailRoute);
app.post("/subscribe", async (req, res) => {
  const { email, title, phone, address } = req.body;

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

    await transporter.verify();

    await transporter.sendMail({
      from: `"Mongolian Steppe Subscriber:" <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER,
      subject: "New Mongolian Steppe Subscriber",
      text: `Шинэ хэрэглэгч Subscribe дарлаа: ${email} ${title} ${phone} ${address}`,
    });

    res.status(200).json({ message: "Subscribed successfully" });
  } catch (err) {
    console.error("❌ Email sending error:", err.message);
    res
      .status(500)
      .json({ message: "Email sending failed", error: err.message });
  }
});

mongoose.connect(
  "mongodb+srv://zolbootbaatar123:Zolboot123.@cluster0.s5hpmqn.mongodb.net/arujan",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);
const PORT = 3012;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
