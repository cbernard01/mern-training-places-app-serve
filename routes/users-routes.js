const express = require("express");
const router = express.Router();

const USERS = [
  {
    id: "u1",
    name: "Clifford Bernard",
    image: "https://ak6.picdn.net/shutterstock/videos/9925526/thumb/1.jpg",
    places: 4
  }, {
    id: "u2",
    name: "Megan Bernard",
    image: "https://images.pexels.com/photos/104827/cat-pet-animal-domestic-104827.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
    places: 2
  }
];

router.get("/:userId", (req, res, next) => {
  const userId = req.params.userId;
  const user = USERS.find(u => u.id === userId);

  if (user) res.status(200).json({user: user});
  else res.status(200).json({user: {}});
});

module.exports = router;
