const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
        },
        message: {
            type: String,
            trim: true,
            required: [true, "A notification must have a message"],
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

notificationSchema.virtual("id").get(function () {
    return this._id.toHexString();
});

module.exports = mongoose.model("notification", notificationSchema);

/*TODO:
1-
*/
