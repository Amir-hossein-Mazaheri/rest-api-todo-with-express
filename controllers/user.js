const Promise = require("bluebird");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
// turn callback style functions into promise style :)
Promise.promisifyAll(crypto);

const User = require("../models/User");
const addHourToDate = require("../utils/addHourToDate");
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

const resetPassword = async (req, res, next) => {
  const {
    params: { resetKey },
    body: { password },
  } = req;

  try {
    const query = { "reset.key": resetKey };

    const user = await User.findOne(query);
    console.log(user);

    if (!user) {
      throw new CustomError("Not a valid reset key.", 400);
    }

    if (user.reset.exp < Date.now()) {
      // clear database
      await User.updateOne(query, { reset: { key: "", exp: null } });
      throw new CustomError("Token has expired.", 404);
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const updatedUser = await User.updateOne(query, {
      reset: { key: "", exp: null },
      password: hashedPassword,
    });

    res.json({
      message: "successfully reset the password",
      user: updatedUser,
    });
  } catch (err) {
    next(err);
  }
};

const sendResetPasswordEmail = async (req, res, next) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      throw new CustomError("Couldn't find user.", 404);
    }

    // generate random and unique token
    const buffer = await crypto.randomBytes(32);
    const token = buffer.toString("hex");

    const exp = addHourToDate(1);
    await User.updateOne({ email }, { reset: { key: token, exp } });

    const resetLink = `${req.protocol}://${req.get(
      "host"
    )}/user/reset/${token}`;

    res.json({
      message: "sent an email with reset link.",
      link: resetLink,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  signIn,
  signUp,
  retrieveUser,
  createAccessKey,
  sendResetPasswordEmail,
  resetPassword,
};
