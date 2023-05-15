const mongoose = require("mongoose");

const RefreshSchema = mongoose.Schema({
    token: {
        type: String,
        required: [true, "Token is required"],
    },
});

module.exports = mongoose.model(
    "RefreshModel",
    RefreshSchema,
    "Refresh_Tokens"
);
