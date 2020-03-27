const {check} = require("express-validator");

const createPlace = [
  check("title").not().isEmpty(),
  check("description").isLength({min: 5}),
  check("address").not().isEmpty()
];

const updatePlaceById = [
  check("title").not().isEmpty(),
  check("description").isLength({min: 5}),
  check("address").not().isEmpty()
];

exports.createPlace = createPlace;
exports.updatePlaceById = updatePlaceById;
