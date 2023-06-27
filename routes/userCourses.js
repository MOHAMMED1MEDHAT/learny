const validator = require("../middlewares/usercoursesValidatorMw");
const UserCourse = require("../controllers/userCoursesController");

const router = require("express").Router();

//get user courses by user id
router.get("/user", UserCourse.getUserCoursesByUserId);

router.get("/course/:id", UserCourse.getUserCoursesByCourseId);

//update time course watched by course id
router.patch(
    "/update/course/watchedTime/:id",
    UserCourse.updateWatchedTimeByCourseId
);

//update course status by course id
router.patch(
    "/update/course/status/:id",
    UserCourse.updateCourseStatusByCourseId
);

module.exports = router;
