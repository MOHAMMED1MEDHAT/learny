const mongoose = require("mongoose");

const paymentRequestSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
        },
        orderId: {
            type: Number,
        },
        planId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "plan",
        },
        planSubscriptionType: {
            type: String,
            trim: true,
            required: [true, "A plan must have a planName"],
        },
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

paymentRequestSchema.virtual("id").get(function () {
    return this._id.toHexString();
});

module.exports = mongoose.model("paymentRequest", paymentRequestSchema);

/*TODO:
1-
*/
