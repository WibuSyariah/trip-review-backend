const express = require("express");
const router = express.Router();
const EmoneyController = require("../controllers/emoney.controller");
const authentication = require("../middlewares/authentication");
const adminAuthorization = require("../middlewares/admin.authorization");

router.use(authentication)
router.get("/", EmoneyController.readAll);

router.use(adminAuthorization);
router.post("/", EmoneyController.create);
router.delete("/:id", EmoneyController.delete);

module.exports = router;
