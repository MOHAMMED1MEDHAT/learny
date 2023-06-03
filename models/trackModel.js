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
});

const trackSchema = new mongoose.Schema({
    categoryName: {
        type: String,
        trim: true,
        required: true,
    },
    roadmap: {
        type: String,
        trim: true,
        required: true,
    },
    subscriptionLevel: {
        type: String,
        trim: true,
        default: "FREE",
        required: true,
    },
    imageUrl: {
        type: String,
        trim: true,
        default: "ImageUrl",
        required: true,
    },
    courses: [coursesSchema],
    subscripers: [subscripersSchema],
});

trackSchema.virtual("id").get(function () {
    return this._id.toHexString();
});

trackSchema.set("toJSON", {
    virtuals: true,
});

module.exports = mongoose.model("track", trackSchema);

/*TODO:
1- add course link to the Roadmap to make the user go to course if (clicked)
2- think about population issues
*/
