const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "user",
    },
    token: {
        type: String,
        trim: true,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        expires: 3600,
    },
});

module.exports = mongoose.model("Token", tokenSchema);
