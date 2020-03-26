const express = require("express");
const router = express.Router();

const placesControllers = require("../controllers/places-controller");


router.get("/user/:userId", placesControllers.getPlacesByUserId);
router.get("/:placeId", placesControllers.getPlaceById);
router.post("/", placesControllers.createPlace);
router.patch("/:placeId", placesControllers.updatePlaceById);
router.delete("/:placeId", placesControllers.deletePlaceById);

module.exports = router;
