const jose = require("jose");

const User = require("../models/User");
const generateSecret = require("../utils/generateSecret");

const setUser = async (req, res, next) => {
  const authorization = req.get("Authorization");

  if (!authorization) {
    next();
    return;
  }
  const jwtToken = authorization.split(" ")[1];

  try {
    const {
      payload: { userId },
    } = await jose.jwtVerify(
      jwtToken,
      generateSecret(process.env.ACCESS_TOKEN_SECRET_KEY)
    );

    req.user = await User.findById(userId).select("-password -__v");
    req.isAuthenticated = true;
  } catch (err) {
    req.isAuthenticated = false;
    next(err);
  }

  next();
};

module.exports = { setUser };
