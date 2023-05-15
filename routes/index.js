var express = require("express");
const { LogoutUser } = require("../controllers/AuthController");
const {
    createTodo,
    getTodos,
    getTodo,
    deleteTodo,
    updateTodo,
    toggleCompleted
} = require("../controllers/TodoController");
const isAuthenticated = require("../middleware/JWT_Service");
var router = express.Router();

/* GET home page. */
router.get("/", (req, res) => res.send("<h1> Welcome To Todos API</h1>"));

router.get("/todos", isAuthenticated, getTodos);

router.post("/todos", isAuthenticated, createTodo);

router.get("/todos/:id", isAuthenticated, getTodo);

router.delete("/todos/:id", isAuthenticated, deleteTodo);

router.put("/todos/:id", isAuthenticated, updateTodo);

router.delete("/logout", isAuthenticated, LogoutUser);

router.get('/isCompleted/:id', isAuthenticated, toggleCompleted);

module.exports = router;
