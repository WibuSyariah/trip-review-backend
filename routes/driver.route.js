const express = require("express");
const router = express.Router();
const DriverController = require("../controllers/driver.controller");
const authentication = require("../middlewares/authentication");
const adminAuthorization = require("../middlewares/admin.authorization");

router.use(authentication)
router.get("/", DriverController.readAll);

router.use(adminAuthorization);
router.post("/", DriverController.create);
router.delete("/:id", DriverController.delete);

module.exports = router;
