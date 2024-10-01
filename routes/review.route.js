const express = require("express");
const router = express.Router();
const ReviewController = require("../controllers/review.controller");
const authentication = require("../middlewares/authentication");

router.post("/", ReviewController.create);

router.use(authentication);
router.get("/", ReviewController.readAll);

module.exports = router;
