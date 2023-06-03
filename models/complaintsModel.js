const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        ref: "user",
        required: true,
    },
    emailToContact: {
        type: String,
        trim: true,
        required: true,
    },
    subjectOfComplaint: {
        type: String,
        trim: true,
        required: true,
    },
    message: {
        type: String,
        trim: true,
        required: true,
    },
});

complaintSchema.virtual("id").get(function () {
    return this._id.toHexString();
});

complaintSchema.set("toJSON", {
    virtuals: true,
});

module.exports = mongoose.model("compliant", complaintSchema);

/*TODO:
1-
*/
