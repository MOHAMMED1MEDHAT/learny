const Ajv = require("ajv");
const ajv = new Ajv();

const schema = {
    type: "object",
    properties: {
        courses: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    courseId: {
                        type: "string",
                    },
                },
                required: ["courseId"],
            },
        },
    },
    required: ["courses"],
};

module.exports = ajv.compile(schema);
