const Ajv = require("ajv");
const ajv = new Ajv();

const schema = {
    type: "object",
    properties: {
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
    required: ["emailToContact", "subjectOfComplaint", "message"],
};

module.exports = ajv.compile(schema);
