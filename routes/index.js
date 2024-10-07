const express = require("express");
const router = express.Router();

const auth = require("./auth.route");
const user = require("./user.route");
const division = require("./division.route");
const driver = require("./driver.route");
const car = require("./car.route");
const eMoney = require("./eMoney.route");
const trip = require("./trip.route");
const review = require("./review.route");
const dropdown = require("./dropdown.route");

router.use("/auth", auth);
router.use("/user", user);
router.use("/division", division);
router.use("/driver", driver);
router.use("/car", car);
router.use("/e-money", eMoney);
router.use("/trip", trip);
router.use("/review", review);
router.use("/dropdown", dropdown);

module.exports = router;
