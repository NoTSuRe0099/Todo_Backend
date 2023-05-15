var express = require("express");
const {
    RegisterUser,
    LoginUser,
    LogoutUser,
    getUser,
} = require("../controllers/AuthController");
const { refresh_controller } = require("../controllers/RefreshController");
const router = express.Router();
const isAuthenticated = require("../middleware/JWT_Service");

/* GET users listing. */
router.post("/register", RegisterUser);
router.post("/login", LoginUser);
router.post("/refresh", refresh_controller);
router.delete("logout", isAuthenticated, LogoutUser);
router.get("/me", isAuthenticated, getUser);

module.exports = router;
