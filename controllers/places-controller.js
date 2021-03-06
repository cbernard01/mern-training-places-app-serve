const fs = require("fs");
const {validationResult} = require("express-validator");
const mongoose = require("mongoose");

const Place = require("../models/Place");
const User = require("../models/User");
const HttpResponse = require("../models/http-response");
const getLocationFromAddress = require("../util/location");

const unlinkFile = (req) => {
  if (req.file) fs.unlink(req.file.path, err => {
    if (err) console.log(err);
  });
};

const getPlaceById = async (req, res) => {
  const httpResponse = new HttpResponse(res);

  let place;
  try {
    place = await Place.findById(req.params.placeId);
  } catch (err) {
    return httpResponse.error(500, "Fetching place by Id failed, please try again later", 500);
  }

  if (!place) return httpResponse.error(404, "Could not find a place with the provided place id.");
  return httpResponse.send({place: place.toObject({getters: true})});
};

const getPlacesByUserId = async (req, res) => {
  const httpResponse = new HttpResponse(res);

  let places;
  try {
    places = await Place.find({creator: req.params.userId});
  } catch (err) {
    return httpResponse.error(500, "Fetching places failed, please try again later", 500);
  }

  if (!places || places.length === 0) return httpResponse.send({places: []});
  return httpResponse.send({places: places.map(p => p.toObject({getters: true}))});
};

const createPlace = async (req, res) => {
  const httpResponse = new HttpResponse(res);
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    unlinkFile(req);
    return httpResponse.validationError(422, errors, 401);
  }

  const {title, description, address} = req.body;

  const location = await getLocationFromAddress(address);
  if (location.errors) {
    unlinkFile(req);
    return httpResponse.error(422, location.errors, 401);
  }

  if (!req.file) return httpResponse.error(500, "Could not find file, please provide an image file.", 500);

  const createdPlace = new Place({
    title: title,
    description: description,
    location: location,
    address: address,
    creator: req.userData.userId,
    imageURL: req.file.path
  });

  let user;
  try {
    user = await User.findById(req.userData.userId);
  } catch (err) {
    unlinkFile(req);
    return httpResponse.error(500, "Could not create place, please try again later", 500);
  }

  if (!user) {
    unlinkFile(req);
    return httpResponse.error(404, "Could not find the user for provided id", 400);
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdPlace.save({session: sess});
    user.places.push(createdPlace);
    await user.save({session: sess});
    await sess.commitTransaction();
  } catch (err) {
    unlinkFile(req);
    return httpResponse.error(500, "Could not create place, please try again later", 500);
  }

  return httpResponse.send({place: createdPlace.toObject({getters: true})});
};

const updatePlaceById = async (req, res) => {
  const httpResponse = new HttpResponse(res);
  const updatePlace = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) return httpResponse.validationError(422, errors, 401);

  let place;
  try {
    place = await Place.findById(req.params.placeId);
  } catch (err) {
    return httpResponse.error(500, "Fetching place by Id failed, please try again later", 500);
  }

  if (place.creator.id !== req.userData.userId) return httpResponse.error(403, "You are not allowed to edit this place.", 403);

  if (updatePlace.title && place.title !== updatePlace.title) place.title = updatePlace.title;
  if (updatePlace.description && place.description !== updatePlace.description) place.description = updatePlace.description;
  if (updatePlace.imageURL && place.imageURL !== updatePlace.imageURL) place.imageURL = updatePlace.imageURL;
  if (updatePlace.address && place.address !== updatePlace.address) {
    const location = await getLocationFromAddress(updatePlace.address);

    if (location.errors) return httpResponse.error(422, location.errors, 401);

    place.address = updatePlace.address;
    place.location = location;
  }

  try {
    await place.save()
  } catch (err) {
    return httpResponse.error(500, "Could not update place, please try again later", 500);
  }

  return httpResponse.send({place: place.toObject({getters: true})});
};

const deletePlaceById = async (req, res) => {
  const httpResponse = new HttpResponse(res);

  let place;
  try {
    place = await Place.findById(req.params.placeId).populate("creator");
  } catch (err) {
    return httpResponse.error(500, "Fetching place by Id failed, please try again later", 500);
  }

  if (place.creator.id !== req.userData.userId) return httpResponse.error(403, "You are not allowed to edit this place.", 403);

  if (!place) return httpResponse.error(404, "Could not find place with provided id", 400);

  const imagePath = place.imageURL;

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await place.remove({session: sess});
    place.creator.places.pull(place);
    await place.creator.save({session: sess});
    await sess.commitTransaction();
  } catch (err) {
    return httpResponse.error(500, "Could not delete place, please try again later", 500);
  }

  fs.unlink(imagePath, err => {
    if (err) console.log(err);
  });

  return httpResponse.send({}, 204);
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlaceById = updatePlaceById;
exports.deletePlaceById = deletePlaceById;
