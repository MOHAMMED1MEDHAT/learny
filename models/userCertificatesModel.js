const mongoose = require("mongoose");

const userCertificateSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: [true, "A userTest must have a userId"],
        },
        certificateLink: {
            type: String,
            trem: true,
            required: [true, "A userCertificate must have a certificateLink"],
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

userCertificateSchema.virtual("id").get(function () {
    return this._id.toHexString();
});

module.exports = mongoose.model("userCertificate", userCertificateSchema);

/*TODO:
1-
*/
