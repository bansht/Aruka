const express = require("express");
const router = express();
const {
    create,
    detail,
    getAll,
} = require("../controller/slider");

router.route("/").post(create).get(getAll);
router.route("/:id").get(detail);

module.exports = router;