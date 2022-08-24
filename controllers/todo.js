const Todo = require("../models/Todo");
const CustomError = require("../utils/CustomError");

const TODOS_PER_PAGE = 10;

const retrieveTodos = async (req, res, next) => {
  const page = Number(req.query.page) || 1;
  const { user } = req;

  try {
    const query = {
      $or: [
        { isPrivate: false },
        { isPrivate: { $exists: false } },
        { isPrivate: true, userId: user },
      ],
    };

    const todosCount = await Todo.countDocuments(query);
    const totalPages = Math.ceil(todosCount / TODOS_PER_PAGE);
    const hasNext = page * TODOS_PER_PAGE <= todosCount;
    const hasPrev = page > 1;

    if (page > totalPages) {
      throw new CustomError("This page index doesn't exists.", 400);
    }

    const todos = await Todo.find(query)
      .sort({ _id: -1 }) // reverse the order of todos
      .skip(TODOS_PER_PAGE * (page - 1))
      .limit(TODOS_PER_PAGE)
      .select("-isRemoved -__v")
      .populate("userId", "firstname lastname email");

    // generates next or prev page url
    const generateLink = (isPrev) =>
      `${req.protocol}://${req.get("host")}${
        req.originalUrl.split("?")[0]
      }?page=${isPrev ? page - 1 : page + 1}`;

    res.json({
      count: todosCount,
      currPage: page,
      nextPageLink: hasNext ? generateLink(false) : null,
      prevLink: hasPrev ? generateLink(true) : null,
      hasPrev,
      hasNext,
      totalPages,
      todos,
    });
  } catch (err) {
    next(err);
  }
};

const createTodo = async (req, res, next) => {
  const { title, description, isDone, isRemoved } = req.body;

  try {
    const createTodo = await Todo.create({
      title,
      description,
      isDone,
      isRemoved,
      userId: req.user, // mongoose can detect id of req.user
    });

    res.status(201).json({
      message: "Todo created.",
      todo: createTodo,
    });
  } catch (err) {
    next(err);
  }
};

const retrieveSingleTodo = async (req, res, next) => {
  const {
    params: { todoId },
    user,
  } = req;

  try {
    const todo = await Todo.findOne({
      _id: todoId,
      $or: [
        { isPrivate: false },
        { isPrivate: { $exists: false } },
        { isPrivate: true, userId: user },
      ],
    })
      .select("_id title description isDone isRemoved creationDate")
      .populate("userId", "firstname lastname email");

    const { isRemoved, ...rest } = todo._doc;

    if (isRemoved) {
      throw new CustomError("Can't find todo with this id.", 404);
    }

    res.json(rest);
  } catch (err) {
    next(err);
  }
};

const replaceSingleTodo = async (req, res, next) => {
  const { title, description, isDone } = req.body;
  const { todoId } = req.params;

  try {
    const todo = await Todo.findById(todoId).exec();

    if (todo.userId.toString() !== req.user._id.toString()) {
      throw new CustomError("Couldn't find todo with this id");
    }

    const result = await Todo.findByIdAndUpdate(todoId, {
      title,
      description,
      isDone,
    }).select("-isRemoved -__v -userId");

    res.json({
      message: "updated successfully",
      todo: result,
    });
  } catch (err) {
    next(err);
  }
};

const updateSingleTodo = async (req, res, next) => {};

module.exports = {
  retrieveTodos,
  retrieveSingleTodo,
  createTodo,
  replaceSingleTodo,
  updateSingleTodo,
};
