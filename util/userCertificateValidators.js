const Ajv = require("ajv");
const ajv = new Ajv();

const schema = {
    type: "object",
    properties: {
        certificateLink: {
            type: "string",
        },
        grade: {
            type: "string",
        },
    },
    required: ["certificateLink", "grade"],
};

module.exports = ajv.compile(schema);
