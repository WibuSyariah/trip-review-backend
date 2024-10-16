const express = require("express");
const router = express.Router();
const DivisionController = require("../controllers/division.controller");
const authentication = require("../middlewares/authentication");
const adminAuthorization = require("../middlewares/admin.authorization");

router.use(authentication)
router.use(adminAuthorization);
router.get("/", DivisionController.readAll);
router.post("/", DivisionController.create);
router.delete("/:id", DivisionController.delete);

module.exports = router;
