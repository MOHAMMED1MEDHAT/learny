const Ajv = require("ajv");
const ajv = new Ajv();

const schema = {
    type: "object",
    properties: {
        name: {
            type: "string",
        },
        emailToContact: {
            type: "string",
            pattern: ".+@.+..",
        },
        subjectOfComplaint: {
            type: "string",
        },
        message: {
            type: "string",
        },
    },
    required: ["name", "emailToContact", "subjectOfComplaint", "message"],
};

module.exports = ajv.compile(schema);
