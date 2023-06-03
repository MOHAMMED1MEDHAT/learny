const mongoose = require("mongoose");

const planSchema = new mongoose.Schema({
    planName: {
        type: String,
        trim: true,
        required: true,
    },
    features: [String],
    costOfPlan: {
        type: String,
        trim: true,
        required: true,
    },
    subscriptionType: {
        type: String,
        trim: true,
        default: "FREE",
        required: true,
    },
});

planSchema.virtual("id").get(function () {
    return this._id.toHexString();
});

planSchema.set("toJSON", {
    virtuals: true,
});

module.exports = mongoose.model("plan", planSchema);

/*TODO:
1-
*/
