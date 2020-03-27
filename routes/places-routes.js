const {Router} = require("express");

const placesControllers = require("../controllers/places-controller");
const placesValidator = require("../validators/places-validator");

const router = Router();

router.get("/user/:userId", placesControllers.getPlacesByUserId);
router.get("/:placeId", placesControllers.getPlaceById);
router.post("/", placesValidator.createPlace, placesControllers.createPlace);
router.patch("/:placeId", placesValidator.updatePlaceById, placesControllers.updatePlaceById);
router.delete("/:placeId", placesControllers.deletePlaceById);

module.exports = router;
