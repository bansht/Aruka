const express = require("express");
const {
  getModels,
  createModel,
  getModel,
  updateModel,
  deleteModel,
  getUserModels,
} = require("../controller/tour");
const router = express.Router();
const upload = require("../middleware/fileUpload");

// router.route('/:userId').get(getUserModels);

router.route("/").get(getModels).post(upload.array("images", 10), createModel);

router
  .route("/:id")
  .get(getModel)
  .put(upload.array("images", 10), updateModel)
  .delete(deleteModel);

module.exports = router;
