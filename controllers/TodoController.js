const Todo = require("../models/todosModel");
const User = require("../models/UserModel");
const catchAsyncError = require("../middleware/catchAsyncError");
const ErrorHandler = require("../utility/ErrorHandler");

exports.createTodo = async (req, res, next) => {
    try {
        const todo = await Todo.create({
            ...req.body,
            owner: req.user._id,
        });
        req.user.todos.push(todo._id);
        req.user.save();

        res.json({
            success: true,
            todo: todo,
            message: "todo created successfully",
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            error: err.message,
        });
    }
};

exports.getTodos = catchAsyncError(async (req, res, next) => {
    const todos = await Todo.find({ owner: req.user });
    res.status(200).json({
        success: true,
        todos: todos,
    });
});

exports.deleteTodo = async (req, res, next) => {
    try {
        let todo = await Todo.findById({ _id: req.params.id });

        if (!todo) {
            return res.status(400).json({
                success: false,
                message: "Todo not found",
            });
        }

        await Todo.findByIdAndRemove(req.params.id)
            .then((data) => {
                res.status(200).json(data);
            })
            .catch((error) => {
                console.log(error);
                res.status(500).json({
                    error: error.message,
                });
            });
    } catch (error) {
        res.status(500).json({
            error: error.message,
        });
    }
};

exports.updateTodo = async (req, res, next) => {
    try {
        await Todo.findByIdAndUpdate(req.params.id, req.body).then(() => {
            res.status(200).json(req.body);
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: error.message,
        });
    }
};

exports.toggleCompleted = async (req, res, next) => {
    try {
        const todo = await Todo.findById(req.params.id);
        todo.completed = !todo.completed;
        await todo.save();
        res.status(200).json(todo);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: error.message,
        });
    }
}

exports.getTodo = async (req, res, next) => {
    try {
        const todo = await Todo.findById(req.params.id);
        res.status(200).json(todo);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: error.message,
        });
    }
};
