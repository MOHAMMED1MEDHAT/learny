const mongoose = require("mongoose");

const courseOfUserSchema = new mongoose.Schema({
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    watched: {
        type: String,
        trim: true,
        //calc amount watched by minutes
        default: "0.0",
        required: true,
    },
    passed: {
        type: Boolean,
        default: false,
    },
});

const userCoursesSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },
    courses: [courseOfUserSchema],
});

userCoursesSchema.virtual("id").get(function () {
    return this._id.toHexString();
});

userCoursesSchema.set("toJSON", {
    virtuals: true,
});

module.exports = mongoose.model("userCourses", userCoursesSchema);

/*TODO:
1-
*/
