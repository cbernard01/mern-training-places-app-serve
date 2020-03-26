const express = require("express");
const bodyParser = require("body-parser");

const placesRoutes = require("./routes/places-routes");
const usersRoutes = require("./routes/users-routes");

const app = express();

app.use(bodyParser.json());
app.use("/api/places", placesRoutes);
app.use("/api/users", usersRoutes);

app.use((err, req, res, next) => {
  if (res.headersSent) return next(err);

  res.status(err.code || 500).json({
    error: err.message || "An unknown error occurred. ",
    payload: err.payload
  });
});

app.listen(5000, () => {
  console.log("App started; server is listening on port 5000");
});
