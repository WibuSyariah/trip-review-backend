const express = require("express");
const router = express.Router();
const CarController = require("../controllers/car.controller");
const authentication = require("../middlewares/authentication");
const adminAuthorization = require("../middlewares/admin.authorization");

router.use(authentication);
router.get("/", CarController.readAll);

router.use(adminAuthorization);
router.post("/", CarController.create);
router.delete("/:id", CarController.delete);

module.exports = router;
