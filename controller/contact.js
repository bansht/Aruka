const Model = require("../models/Contact");
const MyError = require("../utils/myError");
const asyncHandler = require("express-async-handler");
const paginate = require("../utils/paginate");
const os = require("os");
const requestIp = require("request-ip");
const transporter = require("../config/nodemailer-gmail");

exports.getModels = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10000;
  const sort = req.query.sort;
  const select = req.query.select;

  ["select", "sort", "page", "limit"].forEach((el) => delete req.query[el]);

  const pagination = await paginate(page, limit, Model);

  const model = await Model.find(req.query, select)
    .sort(sort)
    .skip(pagination.start - 1)
    .limit(limit);

  res.status(200).json({
    success: true,
    data: model,
    pagination,
  });
});

exports.getUserModels = asyncHandler(async (req, res, next) => {
  const user = req.query.userId;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10000;
  const sort = req.query.sort;
  const select = req.query.select;

  ["select", "sort", "page", "limit"].forEach((el) => delete req.query[el]);

  const pagination = await paginate(page, limit, Model);

  const model = await Model.find({ user: user }, select)
    .sort(sort)
    .skip(pagination.start - 1);

  res.status(200).json({
    success: true,
    data: model,
    pagination,
  });
});

exports.getModel = asyncHandler(async (req, res, next) => {
  const model = await Model.findById(req.params.id);

  if (!model) {
    throw new MyError(req.params.id + " ID-тэй категори байхгүй!", 400);
  }

  res.status(200).json({
    success: true,
    data: model,
  });
});

exports.createModel = asyncHandler(async (req, res, next) => {
  const { title, email, phone, address, map } = req.body;

  // Validation
  // if (!title || !email || !phone || !address) {
  //   throw new MyError("Бүх шаардлагатай мэдээллийг оруулна уу!", 400);
  // }

  const modelData = {
    title,
    email,
    phone,
    address,
    map: map || "",
  };

  const model = await Model.create(modelData);

  try {
    await transporter.sendMail({
      from: `"Mongolia Trekking Contact" <${process.env.GMAIL_USER}>`,
      to: process.env.RECEIVE_EMAIL || process.env.GMAIL_USER,
      subject: "🔔 Шинэ Contact мэдээлэл",
      html: `
        <h2>✅ Шинэ Contact мэдээлэл ирлээ</h2>
        <hr/>
        <p><strong>Гарчиг:</strong> ${title}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Утас:</strong> ${phone}</p>
        <p><strong>Хаяг:</strong> ${address}</p>
        ${map ? `<p><strong>Map:</strong> ${map}</p>` : ''}
        <hr/>
        <p><small>Огноо: ${new Date().toLocaleString('mn-MN')}</small></p>
      `,
      replyTo: email,
    });
  } catch (emailError) {
    console.error("Email илгээхэд алдаа:", emailError.message);
  }

  res.status(200).json({
    success: true,
    message: "Contact амжилттай хадгалагдлаа!",
    data: model,
  });
});

exports.updateModel = asyncHandler(async (req, res, next) => {
  const model = await Model.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!model) {
    throw new MyError(req.params.id + " ID-тэй категори байхгүйээээ.", 400);
  }

  res.status(200).json({
    success: true,
    data: model,
  });
});

exports.deleteModel = asyncHandler(async (req, res, next) => {
  const model = await Model.findById(req.params.id);

  if (!model) {
    throw new MyError(req.params.id + " ID-тэй категори байхгүйээээ.", 400);
  }

  model.remove();

  res.status(200).json({
    success: true,
    data: model,
  });
});
