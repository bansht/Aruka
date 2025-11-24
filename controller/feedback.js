const Model = require("../models/Feedback");
const MyError = require("../utils/myError");
const asyncHandler = require("express-async-handler");
const paginate = require("../utils/paginate");
const { sendContactEmail } = require("../utils/sendContactEmail");

exports.getModels = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10000;
  const sort = req.query.sort || '-createdAt';
  const select = req.query.select;

  ["select", "sort", "page", "limit"].forEach((el) => delete req.query[el]);

  const pagination = await paginate(page, limit, Model);

  const model = await Model.find(req.query, select)
    .sort(sort)
    .skip(pagination.start - 1)
    .limit(limit);

  res.status(200).json({
    success: true,
    count: model.length,
    data: model,
    pagination,
  });
});

exports.getModel = asyncHandler(async (req, res, next) => {
  const model = await Model.findById(req.params.id);

  if (!model) {
    throw new MyError(req.params.id + " ID-тэй feedback олдсонгүй!", 400);
  }

  // Mark as read
  if (model.status === 'new') {
    model.status = 'read';
    await model.save();
  }

  res.status(200).json({
    success: true,
    data: model,
  });
});

exports.createModel = asyncHandler(async (req, res, next) => {
  const { name, email, phone, subject, message } = req.body;

  if (!name || !email || !message) {
    throw new MyError("Нэр, email болон мессеж заавал оруулна уу!", 400);
  }

  const feedback = await Model.create({
    name,
    email,
    phone,
    subject,
    message,
  });

  try {
    await sendContactEmail({ name, email, phone, subject, message });
  } catch (emailError) {
    console.error("Email илгээхэд алдаа:", emailError.message);
  }

  res.status(201).json({
    success: true,
    message: "Таны мессежийг амжилттай хүлээн авлаа. Бид тантай удахгүй холбогдох болно.",
    data: feedback,
  });
});

exports.updateModel = asyncHandler(async (req, res, next) => {
  const model = await Model.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!model) {
    throw new MyError(req.params.id + " ID-тэй feedback олдсонгүй.", 400);
  }

  res.status(200).json({
    success: true,
    data: model,
  });
});

exports.deleteModel = asyncHandler(async (req, res, next) => {
  const model = await Model.findById(req.params.id);

  if (!model) {
    throw new MyError(req.params.id + " ID-тэй feedback олдсонгүй.", 400);
  }

  await model.remove();

  res.status(200).json({
    success: true,
    data: model,
  });
});
