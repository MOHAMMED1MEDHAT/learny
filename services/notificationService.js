const Notification = require("./../models/notificationsModel");

exports.addNotification = async ({ message }) => {
    try {
        await Notification.create({ message });
    } catch (error) {
        throw new Error("error while  creating notification");
    }
};
