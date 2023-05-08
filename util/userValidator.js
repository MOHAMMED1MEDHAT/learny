const Ajv = require("ajv");
const ajv = new Ajv();

const schema = {
    type: "object",
    properties: {
        name: {
            type: "string",
        },
        email: {
            type: "string",
            pattern: ".+@.+..",
        },
        password: {
            type: "string",
            minLength: 5,
        },
        phone: {
            type: "string",
            minLength: 5,
        },
        address: {
            type: "string",
        },
        imageUrl: {
            type: "string",
        },
        dateOfBirth: {
            type: "string",
        },
        gender: {
            type: "string",
        },
    },
    required: [
        "name",
        "email",
        "password",
        "phone",
        "imageUrl",
        "gender",
        "address",
    ],
};

module.exports = ajv.compile(schema);
