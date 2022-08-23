const jose = require("jose");

const generateSecret = require("./generateSecret");

const generateToken = async (user, onlyAccess = false) => {
  const payload = {
    userId: user._id,
  };

  try {
    const accessToken = await new jose.SignJWT(payload)
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("15m")
      .sign(generateSecret(process.env.ACCESS_TOKEN_SECRET_KEY));

    let refreshToken;

    if (!onlyAccess) {
      refreshToken = await new jose.SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setExpirationTime("1h")
        .sign(generateSecret(process.env.REFRESH_TOKEN_SECRET_KEY));
    }

    return onlyAccess
      ? { access: accessToken }
      : {
          access: accessToken,
          refresh: refreshToken,
        };
  } catch (err) {
    return Promise.reject(err);
  }
};

module.exports = generateToken;
