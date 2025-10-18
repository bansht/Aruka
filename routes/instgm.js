const express = require("express");
const {
  getModels,
  createModel,
  getModel,
  updateModel,
  deleteModel,
  getUserModels,
} = require("../controller/instgm");    
const router = express.Router();
const upload = require("../middleware/fileUpload");

// router.route('/:userId').get(getUserModels);

router.route("/").get(getModels).post(upload.single("image"), createModel);

router
  .route("/:id")
  .get(getModel)
  .put(upload.single("image"), updateModel)
  .delete(deleteModel);

module.exports = router;
