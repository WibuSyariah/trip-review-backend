const express = require("express");
const router = express.Router();
const DriverController = require("../controllers/driver.controller");
const authentication = require("../middlewares/authentication");
const adminAuthorization = require("../middlewares/admin.authorization");
const fileUpload = require("../middlewares/multer");

router.use(authentication);
router.use(adminAuthorization);
router.get("/", DriverController.readAll);
router.post("/", fileUpload.single("image"), DriverController.create);
router.patch("/:id", fileUpload.single("image"), DriverController.update);

router.delete("/:id", DriverController.delete);

module.exports = router;
