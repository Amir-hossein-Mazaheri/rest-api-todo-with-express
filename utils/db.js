const mongoose = require("mongoose");

const { MONGO_URI_DEV, DB_NAME } = process.env;

const MONGO_URI = `${MONGO_URI_DEV}/${DB_NAME}`;

const connectToDB = () => {
  return mongoose.connect(MONGO_URI);
};

module.exports = {
  connectToDB,
};
