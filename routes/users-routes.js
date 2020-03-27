const express = require("express");
const router = express.Router();

const usersController = require("../controllers/users-controller");

router.get("/", usersController.getUsers);
router.post("/signup", usersController.signUpUser);
router.post("/login", usersController.logInUser);
router.get("/:userId", usersController.getUserById);

module.exports = router;
