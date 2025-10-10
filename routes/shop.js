const express = require("express");
const {
  getModels,
  createModel,
  getModel,
  updateModel,
  deleteModel,
  getUserModels,
} = require("../controller/shop");
const router = express.Router();
const upload = require("../middleware/fileUpload");

// router.route('/:userId').get(getUserModels);

router.route("/").get(getModels).post(upload.any(), createModel);

router
  .route("/:id")
  .get(getModel)
  .put(upload.single("file"), updateModel)
  .delete(deleteModel);

module.exports = router;
