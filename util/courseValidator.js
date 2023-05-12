const Ajv = require("ajv");
const ajv = new Ajv();

const schema = {
    type: "object",
    properties: {
        courseName: {
            type: "string",
        },
        links: {
            type: "array",
        },
        imageUrl: {
            type: "string",
        },
    },
    required: ["courseName", "links", "imageUrl"],
};

module.exports = ajv.compile(schema);
