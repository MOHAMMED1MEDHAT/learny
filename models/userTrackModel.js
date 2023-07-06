const mongoose = require("mongoose");

const trackOfUserSchema = new mongoose.Schema({
    trackId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "A trackOfUser must have a trackId"],
    },
    passed: {
        type: Boolean,
        default: false,
    },
});

const userTrackSchema = mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: [true, "A userCourse must have a userId"],
        },
        tracks: [trackOfUserSchema],
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

userTrackSchema.virtual("id").get(function () {
    return this._id.toHexString();
});

module.exports = mongoose.model("userTrackss", userTrackSchema);

/*TODO:
1-
*/
