const jwt = require("jsonwebtoken");
const config = require("config");
const jwtSCRT = config.get("env_var.jwtScreteKey");

const Notification = require("./../models/notificationsModel");
const User = require("./../models/userModel");

exports.setUpConnection = async (token, socketId) => {
    try {
        const { userId } = jwt.verify(token, jwtSCRT);
        let sockets = (await User.findById(userId)).sockets;
        //TODO:change it to socketId from client
        sockets.push(socketId);
        await User.findByIdAndUpdate(userId, {
            sockets,
        });
    } catch (error) {
        throw new Error("Error in setup the connection");
    }
};

exports.deleteConnection = async (token, socketId) => {
    try {
        const { userId } = jwt.verify(token, jwtSCRT);
        let sockets = (await User.findById(userId)).sockets;
        if (sockets.indexOf(socketId) != -1) {
            sockets.splice(sockets.indexOf(socketId), 1);
        } else {
            console.log(socketId, "Not found");
        }
        await User.findByIdAndUpdate(userId, {
            sockets,
        });
    } catch (error) {
        throw new Error("Error in deleting the connection");
    }
};

exports.userSendNotification = async (token, msg) => {
    try {
        const { userId } = jwt.verify(token, jwtSCRT);
        let sockets = (await User.findById(userId)).sockets;

        const admins = await User.find({ isAdmin: true });
        const adminsSockets = admins.map((admin) => admin.sockets);
        adminsSockets.map((adminSocket) => sockets.concat(adminSocket));

        await Notification.create({ userId, message: msg });

        // console.log(sockets);
        return sockets;
    } catch (error) {
        throw new Error("Error in setting the sockets");
    }
};

exports.adminSendNotification = async (token, msg) => {
    try {
        const { userId } = jwt.verify(token, jwtSCRT);

        await Notification.create({
            userId,
            message: msg,
        });
    } catch (error) {
        throw new Error("Error in setting the sockets");
    }
};
