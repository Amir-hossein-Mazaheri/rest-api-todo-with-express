const handle404 = (req, res, next) => {
  res.status(404).json({
    error: "Couldn't find the specific route.",
  });

  next();
};

const handle500 = (err, req, res, next) => {
  res.status(500).json({
    message: "Something happened, please try again.",
    error: err.message,
  });

  next();
};

module.exports = { handle404, handle500 };
