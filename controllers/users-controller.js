const HttpResponse = require("../models/http-response");

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

const getUserById = (req, res, next) => {
  const user = USERS.find(u => u.id === req.params.userId);

  const httpResponse = new HttpResponse(res, {user: user});

  if (!user) return httpResponse.error(404, "Could not find a user with the provided user id.");
  return httpResponse.send();
};

exports.getUserById = getUserById;
