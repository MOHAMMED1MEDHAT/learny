const validator = require("../middlewares/coursesValidatorMw");
const Course = require("../controllers/coursesController");

const router = require("express").Router();

//get all courses
//add course
router.route("/").get(Course.getAllCourses).post(validator, Course.addCourse);

//update course links by course id
router.patch("/update/links/:id", Course.updateCourseLinksByCourseId);

// subscripe to course by course id
router.patch("/subscripe/:id", Course.subscripeToCourseByCourseId);

//unsubscripe to course by course id
router.patch("/unsubscripe/:id", Course.unsubscripeToCourseByCourseId);

router
    .route("/:id")
    //get course by course id
    .get(Course.getCourseByCourseId)
    //update course by course id
    .put(validator, Course.updateCourseByCourseId)
    //delete course by course id
    .delete(Course.deleteCourseByCourseId);

module.exports = router;
