const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");

const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.headers["authorization"];
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Authentication failed/ NO token",
            });
        } else {
            const decodedId = await jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decodedId.id);

            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: "Authentication failed/ User not found",
                });
            } else {
                req.user = user;
                next();
            }
        }
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Authentication failed/ token expired",
            error: error.message,
        });
    }
};

module.exports = isAuthenticated;
