const express = require("express");

const {
  retrieveTodos,
  retrieveSingleTodo,
  createTodo,
} = require("../controllers/todo");
const { userAuth } = require("../middlewares/userAuth");

const router = express.Router();

router.use(userAuth);

router.get("/", retrieveTodos);

router.post("/", createTodo);

router.get("/:todoId", retrieveSingleTodo);

module.exports = router;
