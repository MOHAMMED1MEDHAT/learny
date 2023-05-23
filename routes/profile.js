const User = require("../controllers/profileController");

const router = require("express").Router();

//get all courses
router.get("/", User.getUser);

module.exports = router;
