const CustomError = require("../utils/CustomError");

const userAuth = (req, res, next) => {
  if (!req.isAuthenticated) {
    throw new CustomError("Not Authenticated", 401);
  }

  next();
};

module.exports = { userAuth };
