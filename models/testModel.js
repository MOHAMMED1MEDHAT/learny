const Track = require("./trackModel");
const { deleteTestFromTracks } = require("./../services/testService");
const mongoose = require("mongoose");

const testSchema = new mongoose.Schema(
    {
        testName: {
            type: String,
            trim: true,
            required: [true, "A test must have a testName"],
        },
        questions: [
            {
                question: {
                    type: String,
                    trim: true,
                    required: [true, "questions must have a question"],
                },
                answers: [
                    {
                        type: String,
                        trim: true,
                        required: [true, "A question must have an answers"],
                    },
                ],
                correctAnswer: {
                    type: String,
                    trim: true,
                    required: [true, "A question must have a correctAnswer"],
                },
            },
        ],
        successGrade: {
            type: Number,
            required: [true, "A test must have a success grade"],
        },
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

testSchema.virtual("id").get(function () {
    return this._id.toHexString();
});

testSchema.pre("findOneAndDelete", async function (next) {
    await deleteTestFromTracks(Track, this._conditions._id);
    next();
});

module.exports = mongoose.model("test", testSchema);

/*TODO:
1-
*/
