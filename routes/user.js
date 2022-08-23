const express = require("express");

const {
  signIn,
  signUp,
  retrieveUser,
  createAccessKey,
} = require("../controllers/user");
const { userAuth } = require("../middlewares/userAuth");
const { validateSignUp, validateSignIn } = require("../validations/user");
const { validate } = require("../middlewares/validate");

const router = express.Router();

router.post("/signup", ...validateSignUp, validate, signUp);

router.post("/signin", ...validateSignIn, validate, signIn);

router.get("/me", userAuth, retrieveUser);

// make new access key in each request
router.post("/refresh", createAccessKey);

module.exports = router;
