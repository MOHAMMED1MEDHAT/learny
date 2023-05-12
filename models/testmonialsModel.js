const mongoose = require("mongoose");

const testmonialSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    dateOfSubmation: {
        type: String,
        required: true,
    },
});

testmonialSchema.virtual("id").get(function () {
    return this._id.toHexString();
});

testmonialSchema.set("toJSON", {
    virtuals: true,
});

module.exports = mongoose.model("testmonial", testmonialSchema);
