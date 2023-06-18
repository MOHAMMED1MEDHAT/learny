const Notification = require("./../controllers/notificationsController");
const router = require("express").Router();

//get all user notification
router.get("/", Notification.getAllNotificationsByUserId);

// router.get("/:id", Plan.getPlanById);

module.exports = router;
