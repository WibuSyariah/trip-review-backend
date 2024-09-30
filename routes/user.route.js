const express = require("express");
const router = express.Router();
const authentication = require("../middlewares/authentication");
const adminAuthorization = require("../middlewares/admin.authorization");
const UserController = require("../controllers/user.controller");

router.use(authentication);
router.use(adminAuthorization);
router.post("", UserController.create);
router.get("", UserController.readAll);
router.patch("/:id", UserController.update);
router.delete("/:id", UserController.delete);

module.exports = router;
