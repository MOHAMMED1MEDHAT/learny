//TODO: delete this file
const validator = require("../middlewares/usercoursesValidatorMw");
const UserCourse = require("../controllers/userCoursesController");

const router = require("express").Router();

//get user courses by user id
router.get("/user", UserCourse.getUserCoursesByUserId);

//update time course watched by course id
router.patch(
    "/update/course/watchedTime/:id",
    UserCourse.updateWatchedTimeByCourseId
);

router.get("/course/:id", UserCourse.getUserCoursesByCourseId);

// //update course status by course id
// router.patch(
//     "/update/course/status/:id",
//     UserCourse.updateCourseStatusByCourseId
// );

module.exports = router;
