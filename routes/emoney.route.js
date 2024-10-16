const express = require("express");
const router = express.Router();
const EMoneyController = require("../controllers/eMoney.controller");
const authentication = require("../middlewares/authentication");
const adminAuthorization = require("../middlewares/admin.authorization");

router.use(authentication)
router.use(adminAuthorization);
router.get("/", EMoneyController.readAll);
router.post("/", EMoneyController.create);
router.delete("/:id", EMoneyController.delete);

module.exports = router;
