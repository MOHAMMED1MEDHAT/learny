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
                        type: "string",
                    },
                    answer: {
                        type: "string",
                    },
                },
                required: ["question", "answer"],
            },
        },
    },
    required: ["answers"],
};

module.exports = ajv.compile(schema);
