require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");

const todoRoutes = require("./routes/todo");
const { disableCORS } = require("./middlewares/disableCORS");
const { connectToDB } = require("./utils/db");
const { handle404, handle500 } = require("./controllers/error");

const app = express();

app.disable("x-powered-by");

app.use(bodyParser.json());

app.use(disableCORS);

app.use("/todo", todoRoutes);

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
