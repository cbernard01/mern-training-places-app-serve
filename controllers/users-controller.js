const {validationResult} = require("express-validator");

const User = require("../models/User");
const HttpResponse = require("../models/http-response");

const getUsers = async (req, res) => {
  const httpResponse = new HttpResponse(res);

  let users;
  try {
    users = await User.find({}, "-password");
  } catch(err) {
    return httpResponse.error(500, "Fetching users failed, please try again later", 500);
  }

  if (!users) return httpResponse.error(404, "No users found.");
  else return httpResponse.send({users: users.map(user => user.toObject({getters: true}))});
};

const getUserById = async (req, res) => {
  const httpResponse = new HttpResponse(res);

  let user;
  try {
    user = await User.findById(req.params.userId);
  } catch(err) {
    return httpResponse.error(500, "Fetching user failed, please try again later", 500);
  }

  if (!user) return httpResponse.error(404, "Could not find a user with the provided user id.");

  user.password = "";

  return httpResponse.send({user: user.toObject({getters: true})});
};

const signUpUser = async (req, res) => {
  const httpResponse = new HttpResponse(res);
  const errors = validationResult(req);
  const {name, email, password, image} = req.body;

  if (!errors.isEmpty()) return httpResponse.error(422, errors.errors, 401);

  let existingUser;
  try {
    existingUser = await User.findOne({email: email});
  } catch(err) {
    return httpResponse.error(500, "Fetching user failed, please try again later", 500);
  }

  let newUser;
  if (existingUser) return httpResponse.error(404, "Could not create user, email already exists");
  else newUser = new User({name, email, password, image, places: []});

  let createdUser;
  try {
    createdUser = await newUser.save();
  } catch(err) {
    return httpResponse.error(500, "Saving user failed, please try again later", 500);
  }

  createdUser.password = "";

  return httpResponse.send({user: createdUser.toObject({getters: true})}, 202);
};

const logInUser = async (req, res) => {
  const httpResponse = new HttpResponse(res);
  const errors = validationResult(req);
  const {email, password} = req.body;

  if (!errors.isEmpty()) return httpResponse.error(422, errors.errors, 401);

  let user;
  try {
    user = await User.findOne({email: email});
  } catch (err) {
    return httpResponse.error(500, "Fetching user failed, please try again later", 500);
  }

  if (!user || user.password !== password) return httpResponse.error(401, "Could not identify user, invalid credentials.", 402);

  user.password = "";

  return httpResponse.send({user: user.toObject({getters: true})}, 202);
};

exports.getUsers = getUsers;
exports.getUserById = getUserById;
exports.signUpUser = signUpUser;
exports.logInUser = logInUser;
