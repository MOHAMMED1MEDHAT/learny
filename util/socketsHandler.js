const jwt = require("jsonwebtoken");
const config = require("config");
const jwtSCRT = config.get("env_var.jwtScreteKey");

const User = require("./../models/userModel");

class socket {
    constructor(socketId, token) {
        this.socketId = socketId;
        this.userId = jwt.verify(token, jwtSCRT).userId;
    }
}

module.exports = socket;
