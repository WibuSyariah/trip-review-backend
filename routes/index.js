const express = require("express");
const router = express.Router();

const auth = require("./auth.route")
const user = require("./user.route")
const division = require("./division.route")
const driver = require("./driver.route")
const car = require("./car.route")

router.use("/auth", auth);
router.use("/user", user);
router.use("/division", division);
router.use("/driver", driver);
router.use("/car", car);

module.exports = router;