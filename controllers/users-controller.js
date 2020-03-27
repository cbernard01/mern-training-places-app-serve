const {v4: uuid} = require("uuid");

const User = require("../models/User");
const HttpResponse = require("../models/http-response");

let USERS = [
  new User("u1", "Clifford Bernard", "cliffordbernard@hotmail.com", "12345", "https://ak6.picdn.net/shutterstock/videos/9925526/thumb/1.jpg", 4),
  new User("u2", "Megan Bernard", "meganjbernard@hotmail.com", "12345", "https://images.pexels.com/photos/104827/cat-pet-animal-domestic-104827.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500", 2)
];

const getUsers = (req, res, next) => {
  const users = USERS;
  const httpResponse = new HttpResponse(res);

  if (!users) return httpResponse.error(404, "No users found.");

  return httpResponse.send({users: USERS});
};

const getUserById = (req, res, next) => {
  const user = USERS.find(u => u.id === req.params.userId);

  const httpResponse = new HttpResponse(res);

  if (!user) return httpResponse.error(404, "Could not find a user with the provided user id.");
  return httpResponse.send({user: user.toJson()});
};

const signUpUser = (req, res, next) => {
  const {name, password, email} = req.body;
  const newUser = new User(uuid(), name, email, password, "", 0);
  const user = USERS.find(u=> u.email === email);

  const httpResponse = new HttpResponse(res);

  if(user) return httpResponse.error(404,"User with the same email already exists");

  USERS.push(newUser);
  return httpResponse.send({user: newUser.toJson()},202);
};

const logInUser = (req, res, next)=> {
  const {email, password} = req.body;
  const user = USERS.find(u => u.email === email);
  const httpResponse = new HttpResponse(res);

  if (!user || user.password !== password) return httpResponse.error(401, "Could not identify user, invalid credentials.", 402);
  return httpResponse.send({user: user.toJson()}, 202);
};

exports.getUsers = getUsers;
exports.getUserById = getUserById;
exports.signUpUser = signUpUser;
exports.logInUser = logInUser;
