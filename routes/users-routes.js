const express = require("express");
const router = express.Router();

const usersController = require("../controllers/users-controller");
const usersValidator = require("../validators/users-validator");
const fileUpload = require("../middleware/file-upload");


router.get("/", usersController.getUsers);
router.post("/signup", fileUpload.single("image"), usersValidator.signUpUser, usersController.signUpUser);
router.post("/login", usersValidator.logInUser, usersController.logInUser);
router.get("/:userId", usersController.getUserById);

module.exports = router;
