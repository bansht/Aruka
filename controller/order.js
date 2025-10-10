const Model = require("../models/Orders");
const MyError = require("../utils/myError");
const asyncHandler = require("express-async-handler");
const paginate = require("../utils/paginate");
const os = require("os");
const requestIp = require("request-ip");

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
  let cover;

  // req.files.forEach((e) => {
  //   console.log(e.file);
  // })

  // console.log(req.files)

  if (req.file && req.file.filename) {
    cover = req.file.filename;
  } else {
    cover = "no-jpg";
  }

  // let plans;
  // if (req.body.plans) {
  //   plans = JSON.parse(req.body.plans);
  // }

  const modelData = {
    ...req.body,
    cover,
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
