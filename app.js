require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const xssClean = require("xss-clean");
const morgan = require("morgan");
const mongoSanitize = require("express-mongo-sanitize");

const todoRoutes = require("./routes/todo");
const userRoutes = require("./routes/user");
const { disableCORS } = require("./middlewares/disableCORS");
const { connectToDB } = require("./utils/db");
const { handle404, handle500 } = require("./controllers/error");
const { setUser } = require("./middlewares/setUser");

const app = express();

app.disable("x-powered-by");

// third party middlewares
app.use(bodyParser.json());
app.use(helmet());
app.use(xssClean());
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms")
);
app.use(mongoSanitize());

// helpers middlewares
app.use(disableCORS);
app.use(setUser);

// routes
app.use("/todo", todoRoutes);
app.use("/user", userRoutes);

// error handlers middlewares
app.use(handle404);
app.use(handle500);

const port = process.env.PORT || 3000;

connectToDB()
  .then(() => {
    app.listen(port);
  })
  .catch((err) => {
    console.log("An error happened while trying to access mongodb.");
    console.log(err);
  });
