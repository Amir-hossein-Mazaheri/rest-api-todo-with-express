const jose = require("jose");

const CustomError = require("./CustomError");
const generateSecret = require("./generateSecret");
const User = require("../models/User");

const validateRefreshToken = async (refresh) => {
  try {
    const decodedToken = await jose.jwtVerify(
      refresh,
      generateSecret(process.env.REFRESH_TOKEN_SECRET_KEY)
    );

    if (!decodedToken) {
      throw new CustomError("Not a valid refresh token.", 422);
    }

    if (!("userId" in decodedToken.payload)) {
      throw new CustomError("Payload should contain userId.", 422);
    }

    // validate token payload
    const user = await User.findById(decodedToken.payload.userId);

    if (!user) {
      throw new CustomError("Not a valid userId", 422);
    }

    return decodedToken;
  } catch (err) {
    throw new CustomError("Not a valid refresh token.", 422);
  }
};

module.exports = validateRefreshToken;
