const express = require("express");

const {
  retrieveTodos,
  retrieveSingleTodo,
  createTodo,
} = require("../controllers/todo");

const router = express.Router();

router.get("/", retrieveTodos);

router.post("/", createTodo);

router.get("/:todoId", retrieveSingleTodo);

module.exports = router;
