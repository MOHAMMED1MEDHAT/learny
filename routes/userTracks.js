//TODO:DELETE THIS FILE
const UserTrack = require("../controllers/userTrackController");

const router = require("express").Router();

//get user courses by user id
router.get("/user", UserTrack.getUserTracksByUserId);

//update Track watched time by track id
// router.patch(
//     "/update/userTrack/watchTime/:id",
//     UserCourse.updateCourseStatusByCourseId
// );

module.exports = router;
