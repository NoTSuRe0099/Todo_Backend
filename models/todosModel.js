const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema(
    {
        title: String,
        description: String,
        completed: {
            type: Boolean,
            default: false,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Todo", todoSchema);
