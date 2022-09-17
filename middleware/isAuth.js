const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  let decodedToken;
  const authorization = req.get("Authorization");
  if (!authorization) {
    let error = new Error("Token is undefined");
    error.statusCode = 401;
    throw error;
  }
  const token = authorization.split(" ")[1];
  try {
    decodedToken = jwt.verify(token, "projectxsupertokenencryption");
    if (!decodedToken) {
      let error = new Error("Incorrect Token");
      error.statusCode = 401;
      throw error;
    }
    req.userId = decodedToken.userId;
    next()
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error)
  }
};
