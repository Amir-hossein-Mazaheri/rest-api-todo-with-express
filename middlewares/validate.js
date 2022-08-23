const { validationResult } = require("express-validator");

const CustomError = require("../utils/CustomError");

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new CustomError(
      JSON.stringify(errors.array()),
      422,
      true,
      "validation failed"
    );
  }

  next();
};

module.exports = { validate };
