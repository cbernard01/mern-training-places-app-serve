const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs");

const {validationResult} = require("express-validator");
const User = require("../models/User");
const HttpResponse = require("../models/http-response");

const unlinkFile = (req) => {
  if (req.file) fs.unlink(req.file.path, err => {
    if (err) console.log(err);
  });
};

const passwordHashing = async (password, httpResponse) => {
  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
    return hashedPassword;
  } catch (errs) {
    return httpResponse.error(500, "Could not create user, please try again.");
  }
};

const passwordValidation = async (challengePassword, password, httpResponse) => {
  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(challengePassword, password);
    return isValidPassword;
  } catch (errs) {
    return httpResponse.error(500, "Could validate user, please try again.");
  }
};

const createToken = (createdUser, httpResponse) => {
  let token;
  try {
    token = jwt.sign(
      {userId: createdUser.id, email: createdUser.email},
      "super_secret_dont_share",
      {expiresIn: "1h"});
  } catch (errs) {
    return httpResponse.error(500, "Could validate user, please try again.");
  }

  return token;
};

const formattedUser = (user) => {
  return {id: user.id, name: user.name, email: user.email, image: user.image, places: user.places};
};

const getUsers = async (req, res) => {
  const httpResponse = new HttpResponse(res);

  let users;
  try {
    users = await User.find({}, "-password");
  } catch (err) {
    return httpResponse.error(500, "Fetching users failed, please try again later", 500);
  }

  if (!users) return httpResponse.error(404, "No users found.");
  else return httpResponse.send({users: users.map(user => formattedUser(user))});
};

const getUserById = async (req, res) => {
  const httpResponse = new HttpResponse(res);

  let user;
  try {
    user = await User.findById(req.params.userId);
  } catch (err) {
    return httpResponse.error(500, "Fetching user failed, please try again later", 500);
  }

  if (!user) return httpResponse.error(404, "Could not find a user with the provided user id.");
  return httpResponse.send({user: formattedUser(user)});
};

const signUpUser = async (req, res) => {
  const httpResponse = new HttpResponse(res);
  const errors = validationResult(req);
  const {name, email, password} = req.body;

  if (!errors.isEmpty()) {
    unlinkFile(req);
    return httpResponse.validationError(422, errors, 401);
  }

  let existingUser;
  try {
    existingUser = await User.findOne({email: email});
  } catch (err) {
    unlinkFile(req);
    return httpResponse.error(500, "Fetching user failed, please try again later", 500);
  }

  let newUser;
  if (existingUser) {
    unlinkFile(req);
    return httpResponse.error(404, "Could not create user, email already exists");
  } else {
    const hashedPassword = await passwordHashing(password, httpResponse);

    newUser = new User({
      name: name, email: email, password: hashedPassword, image: req.file.path, places: []
    });
  }

  let createdUser;
  try {
    createdUser = await newUser.save();
  } catch (err) {
    unlinkFile(req);
    return httpResponse.error(500, "Saving user failed, please try again later", 500);
  }

  const token = createToken(createdUser, httpResponse);
  createdUser.password = "";

  return httpResponse.send({user: formattedUser(createdUser), token: token}, 202);
};

const logInUser = async (req, res) => {
  const httpResponse = new HttpResponse(res);
  const errors = validationResult(req);
  const {email, password} = req.body;

  if (!errors.isEmpty()) return httpResponse.validationError(422, errors, 401);

  let user;
  try {
    user = await User.findOne({email: email});
  } catch (err) {
    return httpResponse.error(500, "Fetching user failed, please try again later", 500);
  }

  const isValidPassword = await passwordValidation(password, user.password, httpResponse);

  if (!user || !isValidPassword) return httpResponse.error(401, "Could not identify user, invalid credentials.", 402);

  const token = createToken(user, httpResponse);

  return httpResponse.send({user: formattedUser(user), token: token}, 202);
};

exports.getUsers = getUsers;
exports.getUserById = getUserById;
exports.signUpUser = signUpUser;
exports.logInUser = logInUser;
