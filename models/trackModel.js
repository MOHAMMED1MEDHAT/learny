const mongoose = require("mongoose");

const coursesSchema = new mongoose.Schema({
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "course",
    },
});

const subscripersSchema = new mongoose.Schema({
    subscriperId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
});

const trackSchema = new mongoose.Schema(
    {
        categoryName: {
            type: String,
            trim: true,
            required: [true, "A track must have a categoryName"],
        },
        roadmap: [String],
        subscriptionLevel: {
            type: String,
            trim: true,
            default: "FREE",
            required: [true, "A track must have a subscriptionLevel"],
        },
        imageUrl: {
            type: String,
            trim: true,
            default: "ImageUrl",
            required: [true, "A track must have a imageUrl"],
        },
        courses: [coursesSchema],
        subscripers: [subscripersSchema],
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

trackSchema.virtual("id").get(function () {
    return this._id.toHexString();
});

module.exports = mongoose.model("track", trackSchema);

/*TODO:
1- add course link to the Roadmap to make the user go to course if (clicked)
2- think about population issues
*/
