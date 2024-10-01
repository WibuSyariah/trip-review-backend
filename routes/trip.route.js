const express = require("express");
const router = express.Router();
const TripController = require("../controllers/trip.controller");
const authentication = require("../middlewares/authentication");
const adminAuthorization = require("../middlewares/admin.authorization");

router.use(authentication);
router.get("/", TripController.readAll);
router.post("/", TripController.create);

router.use(adminAuthorization);
router.get("/:id", TripController.readOne);
router.patch("/:id", TripController.update);
router.delete("/:id", TripController.delete);

module.exports = router;
