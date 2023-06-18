const Notification = require("./../models/notificationsModel");

exports.addNotification = async ({ userId, message }) => {
    try {
        await Notification.create({ message, userId });
    } catch (error) {
        throw new Error("error while  creating notification");
    }
};
