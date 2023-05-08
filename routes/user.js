const errorHandlerMw = require("../middlewares/errorHandlerMw");
const validator = require("../middleWares/userValidatorMw");
const User = require("../models/userModel");

const bcrypt = require("bcrypt");
const config = require("config");
const router = require("express").Router();

const jwtSCRT = config.get("env_var.jwtScreteKey");

router.post("/", validator, async (req, res) => {
    try {
        const { name, email, password, phone, imageUrl, gender, address } =
            req.body;

        const used = await User.findOne({ email: req.body.email }).exec();
        if (used) {
            return res.status(200).json({ message: "user already registered" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        let user = new User({
            name,
            email,
            password: hashedPassword,
            phone,
            imageUrl,
            gender,
            address,
        });
        await user.save();

        const token = user.getAuthToken(user._id, user.isAdmin);

        res.cookie("x-auth-token", token, { httpOnly: true });

        res.status(200).json({ message: "user was added successfully", user });
    } catch (err) {
        console.log(err);
        errorHandlerMw(err);
    }
});

module.exports = router;
