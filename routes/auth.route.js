const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/auth.controller");
const authentication = require("../middlewares/authentication");

router.post("/login", AuthController.login);

router.use(authentication);
router.patch("/password", AuthController.changePassword);

module.exports = router;
