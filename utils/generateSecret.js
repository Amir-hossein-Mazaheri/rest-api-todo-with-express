const { createSecretKey } = require("crypto");

const generateSecret = (secret) => createSecretKey(secret, "utf-8");

module.exports = generateSecret;
