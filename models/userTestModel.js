const mongoose = require("mongoose");

const userTestSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: [true, "A userTest must have a userId"],
        },
        testId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "test",
            required: [true, "A userTest must have a testId"],
        },
        grade: {
            type: Number,
            required: [true, "A userTest must have a grade"],
        },
        createdAt: {
            type: Date,
            default: Date.now(),
        },
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

userTestSchema.virtual("id").get(function () {
    return this._id.toHexString();
});

module.exports = mongoose.model("userTest", userTestSchema);

/*TODO:
1-
*/
