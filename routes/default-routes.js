const HttpResponse = require("../models/http-response");

const defaultRoute = (req, res, next) => {
  const httpResponse = new HttpResponse(res, {});
  return httpResponse.error(404, "Could not find this route.");
};

module.exports = defaultRoute;
