const express = require("express");

const {
  register,
  login,
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  updatePassword,
} = require("../controller/user");

const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/update-password/:id").put(updatePassword);

router
  .route("/")
  .get(getUsers)
  .post(createUser);

router
  .route("/:id")
  .get(getUser)
  .put(updateUser)
  .delete(deleteUser);

module.exports = router;
