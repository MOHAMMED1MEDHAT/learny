const mongoose = require("mongoose");

const testmonialSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: [true, "A testmonial must have a userId"],
        },
        description: {
            type: String,
            trim: true,
            required: [true, "A testmonial must have a description"],
        },
        dateOfSubmation: {
            type: String,
            trim: true,
            required: [true, "A testmonial must have a dateOfSubmation"],
        },
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

testmonialSchema.virtual("id").get(function () {
    return this._id.toHexString();
});

module.exports = mongoose.model("testmonial", testmonialSchema);
