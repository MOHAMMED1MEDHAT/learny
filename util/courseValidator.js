const Ajv = require("ajv");
const ajv = new Ajv();

const schema = {
    type: "object",
    properties: {
        courseName: {
            type: "string",
        },
        links: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    link: {
                        type: "string",
                    },
                    title: {
                        type: "string",
                    },
                    rescource: {
                        type: "string",
                    },
                },
                required: ["link", "title"],
            },
        },
        imageUrl: {
            type: "string",
        },
    },
    required: ["courseName", "links", "imageUrl"],
};

module.exports = ajv.compile(schema);
