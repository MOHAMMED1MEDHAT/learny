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
            type: Number,
            trim: true,
            required: [true, "A plan must have a costOfPlan"],
        },
        priceDiscount: {
            type: Number,
            validate: {
                validator: function (value) {
                    return value < this.costOfPlan;
                },
                message:
                    "dicount price ({VALUE}) should be blow the regular price",
            },
            default: 0,
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
