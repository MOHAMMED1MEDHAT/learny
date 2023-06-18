const Ajv = require("ajv");
const ajv = new Ajv();

const schema = {
    type: "object",
    properties: {
        testId: {
            type: "string",
        },
        grade: {
            type: "string",
        },
    },
    required: ["testId", "grade"],
};

module.exports = ajv.compile(schema);
