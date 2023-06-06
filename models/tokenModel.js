const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "A token must have a userId"],
        ref: "user",
    },
    token: {
        type: String,
        trim: true,
        required: [true, "must have a token"],
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        expires: 3600,
    },
});

module.exports = mongoose.model("Token", tokenSchema);
