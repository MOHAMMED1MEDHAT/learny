// const jwt = require('jsonwebtoken');
var { expressjwt: jwt } = require("express-jwt");
const config = require("config");
const jwtSecret = config.get("env_var.jwtScreteKey");

function auth() {
    return jwt({
        secret: jwtSecret,
        algorithms: ["HS256"],
        credentialsRequired: true,
        // isRevoked: isRevoked
    }).unless({
        path: [
            "/api/v1/user/login",
            "/api/v1/user/signup",
            "/api/v1/user/passwordReset",
            "/api/v1/user/resetPasswordRequest",
            "/api/v1/user/logout",
            "/api/v1/upload/image",
            "/api/v1/testmonial",
        ],
    });
}

async function isRevoked(req, payload, done) {
    if (!payload.isAdmin) {
        done(null, true);
        console.log("isRevoked");
    }
    done();
}

module.exports = auth;
