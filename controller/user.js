const User = require("../models/User");
const MyError = require("../utils/myError");
const asyncHandler = require("express-async-handler");
const paginate = require("../utils/paginate");
const sendEmail = require("../utils/email");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

// register
exports.register = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body);

  console.log(req.body);

  const token = user.getJsonWebToken();

  res.status(200).json({
    success: true,
    token,
    user: user,
  });
});

// логин хийнэ
exports.login = asyncHandler(async (req, res, next) => {
  const { phone, password } = req.body;

  // Оролтыгоо шалгана

  console.log(req.body);

  if (!phone || !password) {
    throw new MyError("Имэйл болон нууц үгээ дамжуулна уу", 400);
  }

  // Тухайн хэрэглэгчийн хайна
  const user = await User.findOne({ phone }).select("+password");

  if (!user) {
    throw new MyError("Имэйл болон нууц үгээ зөв оруулна уу", 401);
  }

  const ok = await user.checkPassword(password);

  if (!ok) {
    throw new MyError("нууц үгээ зөв оруулна уу", 401);
  }

  res.status(200).json({
    success: true,
    token: user.getJsonWebToken(),
    user: user,
  });
});

exports.getUsers = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10000;
  const sort = req.query.sort;
  const select = req.query.select;

  ["select", "sort", "page", "limit"].forEach((el) => delete req.query[el]);

  const pagination = await paginate(page, limit, User);

  const users = await User.find(req.query, select)
    .sort(sort)
    .skip(pagination.start - 1);

  res.status(200).json({
    success: true,
    data: users,
    pagination,
  });
});

exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    throw new MyError(req.params.id + " ID-тэй хэрэглэгч байхгүй!", 400);
  }

  res.status(200).json({
    success: true,
    data: user,
  });
});

exports.createUser = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body);

  res.status(200).json({
    success: true,
    data: user,
  });
});

exports.updateUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    throw new MyError(req.params.id + " ID-тэй хэрэглэгч байхгүйээээ.", 400);
  }

  res.status(200).json({
    success: true,
    data: user,
  });
});

exports.deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    throw new MyError(req.params.id + " ID-тэй хэрэглэгч байхгүйээээ.", 400);
  }

  user.remove();

  res.status(200).json({
    success: true,
    data: user,
  });
});

exports.updatePassword = asyncHandler(async (req, res, next) => {
  const { newPassword } = req.body;
  const { id } = req.params;

  // ID-тай хэрэглэгчийг олох
  const user = await User.findById(id);

  console.log(user);

  if (!user) {
    throw new MyError("Хэрэглэгч олдсонгүй", 404);
  }

  // Оруулсан хуучин нууц үгийг шалгах
  // const isMatch = await user.checkPassword(oldPassword);
  // if (!isMatch) {
  //   throw new MyError("Хуучин нууц үг буруу байна", 400);
  // }

  // Шинэ нууц үгийг хашин хийх
  const salt = await bcrypt.genSalt(10);
  // const hashedPassword = await bcrypt.hash(newPassword, salt);

  // Шинэ нууц үгийг хэрэглэгчийн мэдээллийн дэдэр хадгалах
  user.password = newPassword;
  await user.save();

  res.status(200).json({
    // password: newPassword,
    success: true,
    message: "Нууц үг амжилттай өөрчлөгдлөө",
  });
});
