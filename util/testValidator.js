const Ajv = require("ajv");
const ajv = new Ajv();

const schema = {
    type: "object",
    properties: {
        testName: {
            type: "string",
        },
        questions: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    question: {
                        type: "string",
                    },
                    answers: {
                        type: "array",
                        items: {
                            type: "string",
                        },
                    },
                    correctAnswer: {
                        type: "string",
                    },
                },
                required: ["question", "answers", "correctAnswer"],
            },
        },
        successGrade: {
            type: "string",
        },
    },
    required: ["testName", "questions", "successGrade"],
};

module.exports = ajv.compile(schema);
