const express = require("express");
const router = express.Router();
const DropdownController = require("../controllers/dropdown.controller");
const authentication = require("../middlewares/authentication");
const adminAuthorization = require("../middlewares/admin.authorization");

router.use(authentication);
router.get("/trip-form", DropdownController.tripForm);

router.use(adminAuthorization);

module.exports = router;
