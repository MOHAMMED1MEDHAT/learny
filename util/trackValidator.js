const Ajv = require("ajv");
const ajv = new Ajv();

const schema = {
    type: "object",
    properties: {
        categoryName: {
            type: "string",
        },
        roadmap: {
            type: "array",
            items: {
                type: "string",
            },
        },
        subscriptionLevel: {
            type: "string",
        },
        imageUrl: {
            type: "string",
        },
        testId: {
            type: "string",
        },
        certificateLink: {
            type: "string",
        },
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
    required: [
        "categoryName",
        "roadmap",
        "subscriptionLevel",
        "imageUrl",
        "courses",
        "testId",
        "certificateLink",
    ],
};

module.exports = ajv.compile(schema);
