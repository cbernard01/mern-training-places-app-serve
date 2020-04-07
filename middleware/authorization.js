const jwt = require("jsonwebtoken");

const HttpResponse = require("../models/http-response");

module.exports = (req, res, next) => {
  const httpResponse = new HttpResponse(res);

  let token;
  try {
    token = req.headers.authorization.split(" ")[1];
    if (!token) return httpResponse.error(403, "Authorization failed.", 403);

    const decodedToken = jwt.verify(token, process.env.JWT_KEY);
    req.userData = {userId: decodedToken.userId};
    next();
  } catch (errs) {
    return httpResponse.error(403, "Could not authorize user, please try again.", 403);
  }
};
