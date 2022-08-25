const express = require("express");

const {
  signIn,
  signUp,
  retrieveUser,
  createAccessKey,
  resetPassword,
  sendResetPasswordEmail,
} = require("../controllers/user");
const { userAuth } = require("../middlewares/userAuth");
const {
  validateSignUp,
  validateSignIn,
  validateCreateResetToken,
  validateResetPassword,
} = require("../validations/user");
const { validate } = require("../middlewares/validate");

const router = express.Router();

router.post("/signup", ...validateSignUp, validate, signUp);

router.post("/signin", ...validateSignIn, validate, signIn);

router.get("/me", userAuth, retrieveUser);

// make new access key in each request
router.post("/refresh", createAccessKey);

router.post(
  "/reset",
  ...validateCreateResetToken,
  validate,
  sendResetPasswordEmail
);

router.post(
  "/reset/:resetKey",
  ...validateResetPassword,
  validate,
  resetPassword
);

module.exports = router;
