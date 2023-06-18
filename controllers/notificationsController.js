const errorHandlerMw = require("../middlewares/errorHandlerMw");
const Notifications = require("./../models/notificationsModel");

const jwt = require("jsonwebtoken");
const config = require("config");
const jwtSCRT = config.get("env_var.jwtScreteKey");

//get all notifications by user id
exports.getAllNotificationsByUserId = async (req, res) => {
    try {
        const { userId } = jwt.verify(req.header("x-auth-token"), jwtSCRT);

        const notifications = await Notifications.find({ userId }).exec();
        if (notifications.length == 0) {
            return res
                .status(204)
                .json({ message: "No notifications were added yet" });
        }

        res.status(200).json({
            message: "notifications found",
            results: notifications.length,
            data: { notifications },
        });
    } catch (err) {
        errorHandlerMw(err, res);
    }
};
