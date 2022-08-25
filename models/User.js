const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  reset: {
    key: { type: String, default: "" },
    exp: { type: Date, default: null },
  },
});

const User = model("User", userSchema);

module.exports = User;
