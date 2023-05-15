const User = require("../controllers/userController");
const validator = require("../middlewares/userValidatorMw");
const authValidator = require("../middlewares/authValidatorMw");

const router = require("express").Router();

router.post("/signup", validator, User.signUpController);

router.post("/resetPasswordRequest", User.resetPasswordRequestController);

router.post("/passwordReset", User.resetPasswordController);

router.post("/login", authValidator, User.login);

router.get("/logout", User.logout);

module.exports = router;
