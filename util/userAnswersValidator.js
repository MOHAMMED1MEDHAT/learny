const Ajv = require("ajv");
const ajv = new Ajv();

const schema = {
    type: "object",
    properties: {
        answers: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    questionIdx: {
                        type: "integer",
                    },
                    answer: {
                        type: "string",
                    },
                },
                required: ["questionIdx", "answer"],
            },
        },
    },
    required: ["answers"],
};

module.exports = ajv.compile(schema);
