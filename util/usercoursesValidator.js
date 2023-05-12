const Ajv = require("ajv");
const ajv = new Ajv();

const schema = {
    type: "object",
    properties: {
        courses: {
            type: "array",
        },
    },
    required: ["courses"],
};

module.exports = ajv.compile(schema);
