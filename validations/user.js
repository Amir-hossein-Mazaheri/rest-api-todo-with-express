const { body } = require("express-validator");

const generateValidation = (field) =>
  body(field)
    .trim()
    .isString()
    .withMessage(`not a valid ${field}`)
    .not()
    .isEmpty()
    .withMessage(`${field} can't be empty.`)
    .isAlpha()
    .withMessage(`${field} should only contains letters.`);

const email = body("email")
  .trim()
  .normalizeEmail()
  .escape()
  .isEmail()
  .withMessage("not a valid email");

const password = body("password")
  .trim()
  .isString()
  .withMessage("not a valid password")
  .not()
  .isEmpty()
  .withMessage("password can't be empty")
  .isStrongPassword()
  .withMessage("not a strong password");

const validateSignUp = [
  generateValidation("firstname"),
  generateValidation("lastname"),
  email,
  password,
];

const validateSignIn = [email, password];

const validateCreateResetToken = [email];

const validateResetPassword = [password];

module.exports = {
  validateSignUp,
  validateSignIn,
  validateCreateResetToken,
  validateResetPassword,
};
