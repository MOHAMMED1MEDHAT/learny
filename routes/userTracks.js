//TODO:DELETE THIS FILE
const UserTrack = require("../controllers/userTrackController");

const router = require("express").Router();

//get user courses by user id
router.get("/user", UserTrack.getUserCoursesByUserId);

module.exports = router;
