const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: [true, "Username is required"],
        },
        email: {
            type: String,
            match: [
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                "Please fill a valid email address",
            ],
            required: [true, "Email is required"],
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            select: false,
        },
        todos: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Todo",
            },
        ],
    },
    { timestamps: true }
);

UserSchema.pre("save", async function (next) {
    const user = this;

    if (!user.isModified("password")) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

UserSchema.methods.generateAuthTokens = async function () {
    const access_token = jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: "5h",
    });
    const refresh_token = jwt.sign(
        { id: this._id },
        process.env.REFRESH_SECRET,
        {
            expiresIn: "1d",
        }
    );

    return { access_token, refresh_token };
};

UserSchema.methods.comparePassword = async function (password) {
    const isMatch = await bcrypt.compare(password, this.password);
    return isMatch;
};

module.exports = mongoose.model("User", UserSchema);
