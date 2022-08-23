require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");

const todoRoutes = require("./routes/todo");
const userRoutes = require("./routes/user");
const { disableCORS } = require("./middlewares/disableCORS");
const { connectToDB } = require("./utils/db");
const { handle404, handle500 } = require("./controllers/error");
const { setUser } = require("./middlewares/setUser");

const app = express();

app.disable("x-powered-by");

app.use(bodyParser.json());

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
