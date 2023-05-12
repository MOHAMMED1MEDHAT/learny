const mongoose = require("mongoose");

const complaintSchema = mongoose.Schema({
    name: {
        type: String,
        ref: "user",
        required: true,
    },
    emailToContact: {
        type: String,
        required: true,
    },
    subjectOfComplaint: {
        type: String,
        required: true,
    },
    message: {
        type: String,
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
