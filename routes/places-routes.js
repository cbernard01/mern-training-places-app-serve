const {Router} = require("express");

const placesControllers = require("../controllers/places-controller");
const placesValidator = require("../validators/places-validator");
const fileUpload = require("../middleware/file-upload");
const Authorization = require("../middleware/authorization")

const router = Router();

router.get("/user/:userId", placesControllers.getPlacesByUserId);
router.get("/:placeId", placesControllers.getPlaceById);
router.post("/", Authorization, fileUpload.single("image"), placesValidator.createPlace, placesControllers.createPlace);
router.patch("/:placeId", Authorization, placesValidator.updatePlaceById, placesControllers.updatePlaceById);
router.delete("/:placeId", Authorization, placesControllers.deletePlaceById);

module.exports = router;
