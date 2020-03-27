const {v4: uuid} = require("uuid");
const {validationResult} = require("express-validator");

const HttpResponse = require("../models/http-response");
const getLocationFromAddress = require("../util/location");

let PLACES = [
  {
    id: "p1",
    title: "Empire State Building",
    description: "One of the most famous sky scrappers in the world.",
    imageURL: "https://media.tacdn.com/media/attractions-splice-spp-674x446/06/71/33/e6.jpg",
    address: "20 W 34th St, New York, NY 10001",
    location: {lat: 40.7484405, lng: -73.9856644},
    creator: "u1"
  },
  {
    id: "p2",
    title: "Chrysler Building",
    description: "The Chrysler Building is an Art Deco–style skyscraper located in the Turtle Bay neighborhood on the East Side of Manhattan, New York City, at the intersection of 42nd Street and Lexington Avenue near Midtown Manhattan.",
    imageURL: "https://static.dezeen.com/uploads/2019/01/chrysler-building-for-sale-news-architecture-new-york-city-dezeen-2364-shutterstock-65007532-sq.jpg",
    address: "405 Lexington Ave, New York, NY 10174",
    location: {lat: 40.7516208, lng: -73.975502},
    creator: "u2"
  },
  {
    id: "p3",
    title: "Niagara Falls State Park",
    description: "Niagara Falls is a group of three waterfalls at the southern end of Niagara Gorge, spanning the border between the US state of New York and the Canadian province of Ontario.",
    imageURL: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/3Falls_Niagara.jpg/1280px-3Falls_Niagara.jpg",
    address: "24 Buffalo Avenue\n Niagara Falls, NY, 14303",
    location: {lat: 43.081528, lng: -79.064240},
    creator: "u2"
  }
];

const getPlaceById = (req, res, next) => {
  const httpResponse = new HttpResponse(res);
  const place = PLACES.find(p => p.id === req.params.placeId);

  if (!place) return httpResponse.error(404, "Could not find a place with the provided place id.");
  return httpResponse.send({place: place});
};

const getPlacesByUserId = (req, res, next) => {
  const httpResponse = new HttpResponse(res);
  const places = PLACES.filter(p => p.creator === req.params.userId);

  if (places.length === 0) return httpResponse.error(404, "Could not find places with the provided user id.");
  return httpResponse.send({places: places});
};

const createPlace = async (req, res, next) => {
  const httpResponse = new HttpResponse(res);
  const errors = validationResult(req);

  if (!errors.isEmpty()) return httpResponse.error(422, errors.errors, 401);

  const {title, description, address, creator} = req.body;
  const location = await getLocationFromAddress(address);

  if (location.errors) return httpResponse.error(422, location.errors, 401);

  const createdPlace = {
    id: uuid(),
    title: title,
    description: description,
    location: location,
    address: address,
    creator: creator,
    imageURL: ""
  };
  PLACES.push(createdPlace);

  return httpResponse.send({place: createdPlace});
};

const updatePlaceById = (req, res, next) => {
  const httpResponse = new HttpResponse(res);
  const updatePlace = req.body;
  const errors = validationResult(req);
  const placeIndex = PLACES.findIndex(p => p.id === req.params.placeId);

  if (!errors.isEmpty()) return httpResponse.error(422, errors.errors, 401);
  else if (placeIndex < 0) return httpResponse.error(404, "Could not find place with the provided id.");
  else PLACES[placeIndex] = updatePlace;

  return httpResponse.send({place: updatePlace});
};

const deletePlaceById = (req, res, next) => {
  const httpResponse = new HttpResponse(res);
  const place = PLACES.find(p => p.id === req.params.placeId);

  if (!place) return httpResponse.error(404, "Could not delete place with the provided id.");
  else PLACES = PLACES.filter(p => p.id !== req.params.placeId);

  return httpResponse.send({});
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlaceById = updatePlaceById;
exports.deletePlaceById = deletePlaceById;
