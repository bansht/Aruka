const Model = require("../models/Email");
const MyError = require("../utils/myError");
const asyncHandler = require("express-async-handler");
const paginate = require("../utils/paginate");
const os = require("os");
const requestIp = require("request-ip");
const { sendSubscribeEmail } = require("../utils/subscribe");

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
  const modelData = {
    ...req.body,
  };

  const model = await Model.create(modelData);

  res.status(200).json({
    success: true,
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

exports.subscribe = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    throw new MyError("Email хаяг оруулна уу!", 400);
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new MyError("Email хаяг буруу байна!", 400);
  }

  try {
    await sendSubscribeEmail(email);
    
    res.status(200).json({
      success: true,
      message: "Амжилттай бүртгэгдлээ! Та newsletter-үүдийг цахим шуудангаар хүлээн авах болно.",
    });
  } catch (error) {
    if (error.message === "Email already subscribed") {
      throw new MyError("Энэ email хаяг аль хэдийн бүртгэлтэй байна.", 400);
    }
    throw new MyError("Newsletter-д бүртгүүлэхэд алдаа гарлаа. Дахин оролдоно уу.", 500);
  }
});
