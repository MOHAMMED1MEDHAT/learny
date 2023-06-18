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
        costOfPlan: {
            type: "string",
        },
        subscriptionType: {
            type: "string",
        },
    },
    required: ["planName", "features", "costOfPlan", "subscriptionType"],
};

module.exports = ajv.compile(schema);
