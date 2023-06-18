const Notification = require("./../controllers");
const router = require("express").Router();

//get all user notification
router.get("/", Notification.getAllNotifications);

// router.get("/:id", Plan.getPlanById);

module.exports = router;
