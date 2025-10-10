const express = require("express");
const { createqpay, callback } = require("../controller/qpay");
const router = express.Router();

// invoice id g damjuulj qpay invoice dr uusgene
router
    .route("/:id")
    .post(createqpay)

router
    .route("/callback/:id")
    .get(callback)
    .post(callback)

module.exports = router;