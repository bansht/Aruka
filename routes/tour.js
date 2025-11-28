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

router.route("/").get(getModels).post(upload.any(), createModel);

router
  .route("/:id")
  .get(getModel)
  .put(upload.any(), updateModel)
  .delete(deleteModel);

module.exports = router;
