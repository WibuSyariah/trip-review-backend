const express = require("express");
const router = express.Router();
const CompanyController = require("../controllers/company.controller");
const authentication = require("../middlewares/authentication");
const adminAuthorization = require("../middlewares/admin.authorization");

router.use(authentication)
router.use(adminAuthorization);
router.get("/", CompanyController.readAll);
router.post("/", CompanyController.create);
router.delete("/:id", CompanyController.delete);

module.exports = router;
