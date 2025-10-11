const Model = require("../models/Guides");
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
  let avatar = "no-avatar.jpg";
  let coverImage = "no-cover.jpg";

  // Handle multiple file uploads
  if (req.files && req.files.length > 0) {
    req.files.forEach((file) => {
      if (file.fieldname === "avatar") {
        avatar = file.filename;
      } else if (file.fieldname === "coverImage") {
        coverImage = file.filename;
      }
    });
  }

  // Parse JSON strings for embedded objects
  let contact = {};
  let stats = { views: 0, likes: 0, bookmarks: 0 };
  let upcomingTours = [];

  if (req.body.contact) {
    try {
      contact = JSON.parse(req.body.contact);
    } catch (error) {
      contact = {};
    }
  }

  if (req.body.stats) {
    try {
      stats = JSON.parse(req.body.stats);
    } catch (error) {
      stats = { views: 0, likes: 0, bookmarks: 0 };
    }
  }

  if (req.body.upcomingTours) {
    try {
      upcomingTours = JSON.parse(req.body.upcomingTours);
    } catch (error) {
      upcomingTours = [];
    }
  }

  const modelData = {
    ...req.body,
    avatar,
    coverImage,
    contact,
    stats,
    upcomingTours,
  };

  const model = await Model.create(modelData);

  res.status(200).json({
    success: true,
    data: model,
  });
});

exports.updateModel = asyncHandler(async (req, res, next) => {
  let updateData = { ...req.body };

  // Handle multiple file uploads
  if (req.files && req.files.length > 0) {
    req.files.forEach((file) => {
      if (file.fieldname === "avatar") {
        updateData.avatar = file.filename;
      } else if (file.fieldname === "coverImage") {
        updateData.coverImage = file.filename;
      }
    });
  }

  // Parse JSON strings for embedded objects
  if (req.body.contact) {
    try {
      updateData.contact = JSON.parse(req.body.contact);
    } catch (error) {
      // Keep existing contact if parsing fails
    }
  }

  if (req.body.stats) {
    try {
      updateData.stats = JSON.parse(req.body.stats);
    } catch (error) {
      // Keep existing stats if parsing fails
    }
  }

  if (req.body.upcomingTours) {
    try {
      updateData.upcomingTours = JSON.parse(req.body.upcomingTours);
    } catch (error) {
      // Keep existing upcomingTours if parsing fails
    }
  }

  const model = await Model.findByIdAndUpdate(req.params.id, updateData, {
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
