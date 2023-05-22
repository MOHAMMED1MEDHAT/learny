const User = require("../controllers/profileController");

const router = require("express").Router();

//get all courses
router.get("/:id", User.getUser);

module.exports = router;
