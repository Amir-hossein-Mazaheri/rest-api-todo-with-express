class CustomError extends Error {
  constructor(message, statusCode, isArray = false, reason = "") {
    super(message);
    this.statusCode = statusCode;
    this.isArray = isArray;
    this.reason = reason;
  }
}

module.exports = CustomError;
