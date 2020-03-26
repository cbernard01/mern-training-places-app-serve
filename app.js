const express = require("express");
const bodyParser = require("body-parser");

const placesRoutes = require("./routes/places-routes");
const usersRoutes = require("./routes/users-routes");
const defaultRoutes = require("./routes/default-routes");

const app = express();

app.use(bodyParser.json());

app.use("/api/places", placesRoutes);
app.use("/api/users", usersRoutes);
app.use(defaultRoutes);

app.listen(5000, () => {
  console.log("App started; server is listening on port 5000");
});
