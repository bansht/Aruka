const express = require("express");
const router = express.Router(); // ← энд бас express() биш, express.Router() байх ёстой!
const {
  createModel,
  getModel,
  getModels,
} = require("../controller/slider"); // анхаар controllers биш controller бол зөв шалгаарай

router.route("/").get(getModels).post(createModel);
router.route("/:id").get(getModel);

module.exports = router;
