const express = require("express");
const router = express.Router(); // ← энд бас express() биш, express.Router() байх ёстой!
const { createModel, getModel, getModels } = require("../controller/slider"); // анхаар controllers биш controller бол зөв шалгаарай
const upload = require("../middleware/fileUpload");

router.route("/").get(getModels).post(upload.any(), createModel);
router.route("/:id").get(getModel);

module.exports = router;
