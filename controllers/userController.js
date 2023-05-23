const User = require("../models/userModel");
const {
    requestPasswordReset,
    resetPassword,
} = require("../services/authService");

const bcrypt = require("bcrypt");

const signUpController = async (req, res) => {
    try {
        const { name, email, password, phone, imageUrl, gender, address } =
            req.body;

        const used = await User.findOne({ email: req.body.email }).exec();
        if (used) {
            return res.status(409).json({ message: "user already registered" });
        }

        const salt = await bcrypt.genSalt(process.env.BCRYPT_SALT * 1);
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

        res.status(200).json({
            message: "user was added successfully",
            user,
            token: token,
        });
    } catch (err) {
        console.log(err);
        errorHandlerMw(err);
    }
};

const resetPasswordRequestController = async (req, res, next) => {
    const requestPasswordResetService = await requestPasswordReset(
        req.body.email
    );
    return res.json(requestPasswordResetService);
};

const resetPasswordController = async (req, res, next) => {
    const resetPasswordService = await resetPassword(
        req.body.userId,
        req.body.token,
        req.body.password
    );
    return res.json({ status: resetPasswordService });
};

const login = async (req, res) => {
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
        res.cookie("x-auth-token", token, {
            httpOnly: false,
            sameSite: "None",
            secure: true,
        });
        res.status(200).json({
            message: "user signed in successfully",
            token: token,
        });
    } catch (err) {
        errorHandlerMw(err);
    }
};

const logout = async (req, res) => {
    try {
        res.cookie("x-auth-token", "", { httpOnly: true });
        res.status(200).json({ message: "logged out successfully..." });
        //test---------------
        // console.log(req.body.type.toUpperCase());
        //--------------------------
    } catch (err) {
        errorHandlerMw(err);
    }
};

module.exports = {
    signUpController,
    resetPasswordRequestController,
    resetPasswordController,
    login,
    logout,
};
