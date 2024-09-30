const express = require("express");
const router = express.Router();

const auth = require("./auth.route")
const user = require("./user.route")
const division = require("./division.route")

router.use("/auth", auth);
router.use("/user", user);
router.use("/division", division);

module.exports = router;