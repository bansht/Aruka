const Model = require("../models/Tour");
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
  let images = [];

  if (req.files && req.files.length > 0) {
    images = req.files.map(file => file.filename);
  }

  let guideData = req.body.guide;
  if (typeof guideData === "string") {
    try {
      guideData = JSON.parse(guideData);
    } catch (error) {
      throw new MyError("Guide field must be a valid JSON object", 400);
    }
  }

  let pricePerPersonData = req.body.price_per_person;
  if (typeof pricePerPersonData === "string") {
    try {
      pricePerPersonData = JSON.parse(pricePerPersonData);
    } catch (error) {
      throw new MyError("Price per person field must be a valid JSON array", 400);
    }
  }

  let itineraryData = req.body.itinerary;
  if (typeof itineraryData === "string") {
    try {
      itineraryData = JSON.parse(itineraryData);
    } catch (error) {
      throw new MyError("Itinerary field must be a valid JSON array", 400);
    }
  }

  let includesData = req.body.includes;
  if (typeof includesData === "string") {
    try {
      includesData = JSON.parse(includesData);
    } catch (error) {
      throw new MyError("Includes field must be a valid JSON array", 400);
    }
  }

  let notIncludesData = req.body.not_includes;
  if (typeof notIncludesData === "string") {
    try {
      notIncludesData = JSON.parse(notIncludesData);
    } catch (error) {
      throw new MyError("Not includes field must be a valid JSON array", 400);
    }
  }

  const modelData = {
    ...req.body,
    guide: guideData,
    price_per_person: pricePerPersonData,
    itinerary: itineraryData,
    includes: includesData,
    not_includes: notIncludesData,
    images: images.length > 0 ? images : undefined,
  };

  console.log("Creating model with data:", modelData);

  const model = await Model.create(modelData);

  res.status(200).json({
    success: true,
    data: model,
  });
});

exports.updateModel = asyncHandler(async (req, res, next) => {
  // Handle file uploads
  let updateData = { ...req.body };
  
  if (req.files && req.files.length > 0) {
    updateData.images = req.files.map(file => file.filename);
  }
  
  // Parse guide field if it's a JSON string
  if (updateData.guide && typeof updateData.guide === "string") {
    try {
      updateData.guide = JSON.parse(updateData.guide);
    } catch (error) {
      throw new MyError("Guide field must be a valid JSON object", 400);
    }
  }

  // Parse price_per_person field if it's a JSON string
  if (updateData.price_per_person && typeof updateData.price_per_person === "string") {
    try {
      updateData.price_per_person = JSON.parse(updateData.price_per_person);
    } catch (error) {
      throw new MyError("Price per person field must be a valid JSON array", 400);
    }
  }

  // Parse itinerary field if it's a JSON string
  if (updateData.itinerary && typeof updateData.itinerary === "string") {
    try {
      updateData.itinerary = JSON.parse(updateData.itinerary);
    } catch (error) {
      throw new MyError("Itinerary field must be a valid JSON array", 400);
    }
  }

  // Parse includes field if it's a JSON string
  if (updateData.includes && typeof updateData.includes === "string") {
    try {
      updateData.includes = JSON.parse(updateData.includes);
    } catch (error) {
      throw new MyError("Includes field must be a valid JSON array", 400);
    }
  }

  // Parse not_includes field if it's a JSON string
  if (updateData.not_includes && typeof updateData.not_includes === "string") {
    try {
      updateData.not_includes = JSON.parse(updateData.not_includes);
    } catch (error) {
      throw new MyError("Not includes field must be a valid JSON array", 400);
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
