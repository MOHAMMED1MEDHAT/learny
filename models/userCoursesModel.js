const mongoose = require("mongoose");

const courseOfUserSchema = new mongoose.Schema({
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "A courseOfUser must have a courseId"],
    },
    watched: {
        type: String,
        trim: true,
        //calc amount watched by minutes
        default: "0.0",
        required: [true, "A courseOfUser must have a watched time"],
    },
    passed: {
        type: Boolean,
        default: false,
    },
});

const userCoursesSchema = mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: [true, "A userCourse must have a userId"],
        },
        courses: [courseOfUserSchema],
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

userCoursesSchema.virtual("id").get(function () {
    return this._id.toHexString();
});

module.exports = mongoose.model("userCourses", userCoursesSchema);

/*TODO:
1-
*/
