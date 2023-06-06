const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            ref: "user",
            required: [
                true,
                "A complaint must have a name of the user who complaint",
            ],
        },
        emailToContact: {
            type: String,
            trim: true,
            required: [true, "A complaint must have a emailToContact"],
        },
        subjectOfComplaint: {
            type: String,
            trim: true,
            required: [true, "A complaint must have a subjectOfComplaint"],
        },
        message: {
            type: String,
            trim: true,
            required: [true, "A complaint must have a message"],
        },
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

complaintSchema.virtual("id").get(function () {
    return this._id.toHexString();
});

module.exports = mongoose.model("compliant", complaintSchema);

/*TODO:
1-
*/
