const handle404 = (req, res, next) => {
  res.status(404).json({
    error: "Couldn't find the specific route.",
  });

  next();
};

const handle500 = (err, req, res, next) => {
  const errMessage = err.isArray ? JSON.parse(err.message) : err.message;
  const statusCode = err.statusCode || 500;
  const reason = err.reason || "Something happened, please try again.";

  res.status(statusCode).json({
    message: reason,
    error: errMessage,
  });

  next();
};

module.exports = { handle404, handle500 };
