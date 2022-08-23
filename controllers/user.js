const bcrypt = require("bcrypt");

const User = require("../models/User");
const validateRefreshToken = require("../utils/validateRefreshToken");
const generateToken = require("../utils/generateToken");
const CustomError = require("../utils/CustomError");

const signIn = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    console.log(user);

    if (!user) {
      throw new CustomError("No user found.", 401);
    }
    const matchPass = await bcrypt.compare(password, user.password);
    console.log(matchPass);

    if (!matchPass) {
      throw new CustomError("Password doesn't match.", 401);
    }

    res.json(await generateToken(user));
  } catch (err) {
    console.log(err);
    next(err);
  }
};

const signUp = async (req, res, next) => {
  const { firstname, lastname, email, password } = req.body;

  try {
    const hashedPass = await bcrypt.hash(password, 12);
    const user = await User.create({
      firstname,
      lastname,
      email,
      password: hashedPass,
    });
    const tokens = await generateToken(user);

    res.json({
      message: "User created",
      user,
      ...tokens,
    });
  } catch (err) {
    next(err);
  }
};

const retrieveUser = async (req, res, next) => {
  try {
    res.json(req.user);
  } catch (err) {
    next(err);
  }
};

const createAccessKey = async (req, res, next) => {
  const { refresh } = req.body;

  try {
    const {
      payload: { userId },
    } = await validateRefreshToken(refresh);

    res.json(await generateToken({ _id: userId }, true));
  } catch (err) {
    next(err);
  }
};

module.exports = { signIn, signUp, retrieveUser, createAccessKey };
