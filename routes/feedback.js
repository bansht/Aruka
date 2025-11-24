const express = require("express");
const {
  getModels,
  createModel,
  getModel,
  updateModel,
  deleteModel,
} = require("../controller/feedback");
const router = express.Router();

router.route("/").get(getModels).post(createModel);

router.route("/:id").get(getModel).put(updateModel).delete(deleteModel);

module.exports = router;
