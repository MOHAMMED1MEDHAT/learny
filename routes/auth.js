const errorHandlerMw = require("../middlewares/errorHandlerMw");
const validator = require("../middlewares/authValidatorMw");
const User = require("../models/userModel");

const bcrypt = require("bcrypt");
const router = require("express").Router();

router.post("/login", validator, async (req, res) => {
    try {
        console.log(req.body);
        const { email, password } = req.body;

        const user = await User.findOne({ email }).exec();
        //test--------------------
        // console.log(user);
        //test--------------------
        if (!user) {
            return res
                .status(401)
                .json({ message: "Invalid email or password" });
        }

        const validPass = await bcrypt.compare(password, user.password);
        //test--------------------
        // console.log(validPass);
        //test--------------------
        if (!validPass) {
            return res
                .status(401)
                .json({ message: "Invalid email or password" });
        }

        const token = user.getAuthToken(user._id, user.isAdmin);
        res.cookie("x-auth-token", token, { httpOnly: true });
        res.status(200).json({ message: "user signed in successfully" });
    } catch (err) {
        errorHandlerMw(err);
    }
});

router.get("/logout", async (req, res) => {
    try {
        res.cookie("x-auth-token", "", { httpOnly: true });
        res.status(200).json({ message: "logged out successfully..." });
        //test---------------
        // console.log(req.body.type.toUpperCase());
        //--------------------------
    } catch (err) {
        errorHandlerMw(err);
    }
});

module.exports = router;
