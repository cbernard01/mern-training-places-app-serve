const {check} = require("express-validator");

const signUpUser = [
  check("name").not().isEmpty(),
  check("password").isLength({min: 6}),
  check("email").normalizeEmail().isEmail(),
  check("image").not().isEmpty()
];

const logInUser = [
  check("email").normalizeEmail().isEmail(),
  check("password").isLength({min: 6})
];

exports.signUpUser = signUpUser;
exports.logInUser = logInUser;
