const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const placesRoutes = require("./routes/places-routes");
const usersRoutes = require("./routes/users-routes");
const defaultRoutes = require("./routes/default-routes");

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
  next();
});

app.use("/api/places", placesRoutes);
app.use("/api/users", usersRoutes);
app.use(defaultRoutes);

mongoose.connect("mongodb+srv://admin:BEZoNEvzfnhyJxYq@cluster0-6jl11.gcp.mongodb.net/mern-places?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    app.listen(5000, () => {
      console.log("App started; server is listening on port 5000");
    });
  })
  .catch(err => {
    console.log(err);
  });
