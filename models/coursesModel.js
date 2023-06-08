const Track = require("./trackModel");
const deleteCourseFromTrack = require("./../services/deleteCourses");
const mongoose = require("mongoose");

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

const linksSchema = new mongoose.Schema({
    link: {
        type: String,
        trim: true,
        required: [true, "A course must have a link"],
    },
    title: {
        type: String,
        trim: true,
        required: [true, "A course must have a link"],
    },
    resource: {
        type: String,
        trim: true,
        default: "youtube",
    },
});

const courseSchema = new mongoose.Schema(
    {
        courseName: {
            type: String,
            trim: true,
            required: [true, "A course must have a courseName"],
        },
        links: [linksSchema],
        imageUrl: {
            type: String,
            trim: true,
            default: "ImageUrl",
            required: [true, "A course must have a imageUrl"],
        },
        subscripers: [subscripersSchema],
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

courseSchema.virtual("id").get(function () {
    return this._id.toHexString();
});

courseSchema.pre("findOneAndDelete", async function (next) {
    // console.log(this._conditions._id);
    await deleteCourseFromTrack.deleteCourse(Track, this._conditions._id);
    // console.log("deleting course from all tracks that it was in ....");
    next();
});

module.exports = mongoose.model("course", courseSchema);

/*TODO:
1-think about population issues
*/
