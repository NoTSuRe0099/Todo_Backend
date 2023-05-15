const User = require("../models/UserModel");
const RefreshToken = require("../models/RefreshModel");
const catchAsyncError = require("../middleware/catchAsyncError");
const ErrorHandler = require("../utility/ErrorHandler");

exports.RegisterUser = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                message: "User already exists",
            });
        }
        const newUser = new User({
            username,
            email,
            password,
        });
        await newUser.save();

        const { access_token, refresh_token } =
            await newUser.generateAuthTokens();

        await RefreshToken.create({ token: refresh_token });

        res.status(201).json({
            access_token,
            refresh_token,
            message: "User created successfully",
        });
    } catch (error) {
        res.status(500).json({
            error: error.message,
            message: "Something went wrong",
        });
        console.log(error);
    }
};

exports.LoginUser = catchAsyncError(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new ErrorHandler("Please provide email and password", 400));
    }

    let user = await User.findOne({ email: email }).select("+password");

    if (!user) {
        return next(new ErrorHandler("Invalid email or password", 401));
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
        return next(new ErrorHandler("Invalid email or password", 401));
    }

    const { access_token, refresh_token } = await user.generateAuthTokens();

    await RefreshToken.create({ token: refresh_token });

    res.status(200).json({
        access_token,
        refresh_token,
        message: "Logged in successfully",
    });
});

exports.LogoutUser = async (req, res, next) => {
    try {
        const RefToken = req.body.refresh_token;

        if (!RefToken) {
            return res.status(401).json({
                success: false,
                message: "No refresh token provided",
            });
        }

        const refreshToken = await RefreshToken.findOne({
            token: RefToken,
        });

        if (!refreshToken) {
            return res.status(401).json({
                success: false,
                message: "Refresh token not found",
            });
        }

        await RefreshToken.deleteOne({ token: refreshToken.token });

        res.status(200).json({
            success: true,
            message: "Logged out successfully",
        });
    } catch (error) {
        res.status(500).json({
            error: error.message,
            message: "Something went wrong",
        });
        console.log(error);
    }
};

exports.getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id).select("-password");

        if (!user) {
            return next(new ErrorHandler("User not found", 404));
        }

        res.status(200).json({
            success: true,
            data: user,
        });
    } catch (error) {
        res.status(500).json({
            error: error.message,
            message: "Something went wrong",
        });
        console.log(error);
    }
};
