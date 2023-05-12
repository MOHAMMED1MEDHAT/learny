const validator = require("../middlewares/coursesValidatorMw");
const Course = require("../controllers/coursesController");

const router = require("express").Router();

//get all courses
router.get("/", Course.getAllCourses);

//get course by course id
router.get("/:id", Course.getCourseByCourseId);

//add course
router.post("/", validator, Course.addCourse);

//update course by course id
router.put("/:id", validator, Course.updateCourseByCourseId);

// router.put("/", async (req, res) => {
//     console.log(req.header("Cookie").split("").slice(13).join(""));
//     res.end();
// });

//update course links by course id
router.patch("/update/links/:id", Course.updateCourseLinksByCourseId);

//subscripe to course by course id
router.patch("/subscripe/:id", Course.subscripeToCourseByCourseId);

//unsubscripe to course by course id
router.patch("/unsubscripe/:id", Course.unsubscripeToCourseByCourseId);

//delete course by course id
router.delete("/:id", Course.deleteCourseByCourseId);

module.exports = router;
