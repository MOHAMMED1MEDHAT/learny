const UserTest = require("./../controllers/userTestController.js");

const router = require("express").Router();

//get all userTests by userId
router.get("/", UserTest.getAllUserTestByUserId);

//get  all userTests by test id
router.get("/:testId", UserTest.getAllUserTestByTestId);

module.exports = router;
