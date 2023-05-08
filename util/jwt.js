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
        path: ["/api/user/login", "/api/user/signup", "/api/upload/image"],
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
