const testValidator = require("../middlewares/testValidatorMw");
const userAnswerValidator = require("./../middlewares/userAnswerValidatorMw");
const Test = require("../controllers/testController");

const router = require("express").Router();

//get all tests with implementation of queryHandler
router.get("/", Test.getAllTests);

//get test by test id
router.get("/:id", Test.getTestById);

//add test
router.post("/", testValidator, Test.addTest);

//add user test answers
router.post(
    "/CheckUserAnswer/",
    // userAnswerValidator,
    Test.CheckUserAnswersToTestById
);

//update test by test id
router.put("/:id", testValidator, Test.updateTestById);

//update test questions by test id
// router.patch("/update/addQuestions/:id", Track.addCoursesToTrack);

// router.patch("/update/removeQuestions/:id", Track.deleteCoursesFromTrack);

//delete test by test id
router.delete("/:id", Test.deleteTest);

module.exports = router;
