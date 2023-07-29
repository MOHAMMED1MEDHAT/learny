const Ajv = require("ajv");
const ajv = new Ajv();

const schema = {
    type: "object",
    properties: {
        planName: {
            type: "string",
        },
        features: {
            type: "array",
            items: {
                type: "string",
            },
        },
        priceDiscount: {
            type: "string",
        },
        costOfPlan: {
            type: "string",
        },
        subscriptionType: {
            type: "string",
        },
        subscriptionPeriod: {
            type: "string",
        },
    },
    required: [
        "planName",
        "features",
        "costOfPlan",
        "subscriptionType",
        "subscriptionPeriod",
    ],
};

module.exports = ajv.compile(schema);
