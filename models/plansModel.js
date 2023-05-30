const mongoose = require("mongoose");

const featuresShcema = new mongoose.Schema({
    feature: {
        type: String,
        required: true,
    },
});

const planSchema = new mongoose.Schema({
    planName: {
        type: String,
        required: true,
    },
    features: [featuresShcema],
    costOfPlan: {
        type: String,
        required: true,
    },
    subscriptionType: {
        type: String,
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
