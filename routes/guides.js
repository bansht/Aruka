const express = require("express");
const {
  getModels,
  createModel,
  getModel,
  updateModel,
  deleteModel,
  getUserModels,
} = require("../controller/guides");
const router = express.Router();
const upload = require("../middleware/fileUpload");

// router.route('/:userId').get(getUserModels);

router
  .route("/")
  .get(getModels)
  .post(
    upload.fields([
      { name: "avatar", maxCount: 1 },
      { name: "coverImage", maxCount: 1 },
    ]),
    createModel
  );

router
  .route("/:id")
  .get(getModel)
  .put(
    upload.fields([
      { name: "avatar", maxCount: 1 },
      { name: "coverImage", maxCount: 1 },
    ]),
    updateModel
  )
  .delete(deleteModel);

module.exports = router;
