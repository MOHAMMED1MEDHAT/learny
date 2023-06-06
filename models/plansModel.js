const mongoose = require("mongoose");

const planSchema = new mongoose.Schema(
    {
        planName: {
            type: String,
            trim: true,
            required: [true, "A plan must have a planName"],
        },
        features: [String],
        costOfPlan: {
            type: String,
            trim: true,
            required: [true, "A plan must have a costOfPlan"],
        },
        subscriptionType: {
            type: String,
            trim: true,
            default: "FREE",
            required: [true, "A plan must have a subscriptionLevel"],
        },
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

planSchema.virtual("id").get(function () {
    return this._id.toHexString();
});

module.exports = mongoose.model("plan", planSchema);

/*TODO:
1-
*/
