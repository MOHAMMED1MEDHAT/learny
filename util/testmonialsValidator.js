const Ajv = require("ajv");
const ajv = new Ajv();

const schema = {
    type: "object",
    properties: {
        description: {
            type: "string",
        },
        dateOfSubmation: {
            type: "string",
        },
    },
    required: ["description", "dateOfSubmation"],
};

module.exports = ajv.compile(schema);
