const jwt = require("jsonwebtoken");

const HttpResponse = require("../models/http-response");

module.exports = (req, res, next) => {
  const httpResponse = new HttpResponse(res);

  let token;
  try {
    token = req.headers.authorization.split(" ")[1];
    if (!token) return httpResponse.error(401, "Authorization failed.", 402);

    const decodedToken = jwt.verify(token, "super_secret_dont_share");
    req.userData = {userId: decodedToken.userId};
    next();
  } catch (errs) {
    return httpResponse.error(401, "Could not authorize user, please try again.");
  }
};
