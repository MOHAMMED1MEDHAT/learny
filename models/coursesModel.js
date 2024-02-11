const mongoose = require("mongoose");
const CourseService = require("./../services/courseService");
const Track=require('./trackModel');

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
            unique: true,
            required: [true, "A course must have a courseName"],
        },
        links: [linksSchema],
        totalWatchTime: {
            type: Number,
            required: [true, "A course must have a totalWatchTime"],
        },
        imageUrl: {
            type: String,
            trim: true,
            default: "ImageUrl",
            required: [true, "A course must have a imageUrl"],
        },
        certificateLink: {
            type: String,
            trem: true,
            required: [true, "A Track must have a certificateLink"],
        },
        testId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "test",
            required: [true, "A course must have a test"],
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
    // await CourseService.deleteCourseFromAllTracks({
    //     courseId: this._conditions._id,
    // });

    const tracks=await Track.find({courses:this._conditions._id})

    tracks.map(async(track)=>{
        const idx=track.courses.indexOf(this._conditions._id);
        track.courses.splice(idx,1);

        await Track.findByIdAndUpdate(track.id,{
            courses:track.courses
        })

    })

    next();
});

module.exports = mongoose.model("course", courseSchema);

/*TODO:
1-think about population issues
*/
