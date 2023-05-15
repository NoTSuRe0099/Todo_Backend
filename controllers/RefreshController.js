const User = require("../models/UserModel");
const RefreshToken = require("../models/RefreshModel");
const jwt = require("jsonwebtoken");

exports.refresh_controller = async (req, res, next) => {
    try {
        if (!req.body.refresh_token) {
            return res.status(401).json({
                success: false,
                message: "No refresh token provided",
            });
        }

        const refreshToken = await RefreshToken.findOne({
            token: req.body.refresh_token,
        });

        if (!refreshToken) {
            return res.status(401).json({
                success: false,
                message: "Refresh token not found",
            });
        }

        const decoded = await jwt.verify(
            refreshToken.token,
            process.env.REFRESH_SECRET
        );
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found",
            });
        }

        await RefreshToken.deleteOne({ token: refreshToken.token });
        const { access_token, refresh_token } = await user.generateAuthTokens();

        await RefreshToken.create({ token: refresh_token });

        res.status(200).json({
            access_token,
            refresh_token,
            success: true,
        });
    } catch (error) {
        res.status(401).json({
            error: error.message,
            message: "Something went wrong/refresh token err",
        });
    }
};
