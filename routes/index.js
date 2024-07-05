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

router.get("/todos", getTodos);

router.post("/todos", createTodo);

router.get("/todos/:id", getTodo);

router.delete("/todos/:id", deleteTodo);

router.put("/todos/:id", updateTodo);

router.delete("/logout", LogoutUser);

router.get('/isCompleted/:id', toggleCompleted);

module.exports = router;
