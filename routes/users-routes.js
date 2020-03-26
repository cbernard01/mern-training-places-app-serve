const express = require("express");
const router = express.Router();

const usersController = require("../controllers/users-controller");


router.get("/:userId", usersController.getUserById);

module.exports = router;
