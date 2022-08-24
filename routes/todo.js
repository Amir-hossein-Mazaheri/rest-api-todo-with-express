const express = require("express");

const {
  retrieveTodos,
  retrieveSingleTodo,
  createTodo,
  replaceSingleTodo,
  updateSingleTodo,
} = require("../controllers/todo");
const { userAuth } = require("../middlewares/userAuth");

const router = express.Router();

// only return public todos
router.get("/", retrieveTodos);

router.get("/:todoId", retrieveSingleTodo);

router.use(userAuth);

router.post("/", createTodo);

router.put("/:todoId", replaceSingleTodo);

router.patch("/:todoId", updateSingleTodo);

module.exports = router;
