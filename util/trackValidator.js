const Ajv = require("ajv");
const ajv = new Ajv();

const schema = {
    type: "object",
    properties: {
        categoryName: {
            type: "string",
        },
        roadmap: {
            type: "array",
        },
        subscriptionLevel: {
            type: "string",
        },
        imageUrl: {
            type: "string",
        },
        courses: {
            type: "array",
        },
    },
    required: [
        "categoryName",
        "roadmap",
        "subscriptionLevel",
        "imageUrl",
        "courses",
    ],
};

module.exports = ajv.compile(schema);
