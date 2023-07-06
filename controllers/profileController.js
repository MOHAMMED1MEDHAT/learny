const errorHandlerMw = require("../middlewares/errorHandlerMw");
const User = require("../models/userModel");

const jwt = require("jsonwebtoken");
const config = require("config");
const jwtSCRT = config.get("env_var.jwtScreteKey");

//get by user id
exports.getUser = async (req, res) => {
    try {
        const { userId } = jwt.verify(req.header("x-auth-token"), jwtSCRT);

        const user = await User.findById(userId).exec();

        if (!user) {
            return res.status(204).json({ message: "ERROR no user" });
        }

        res.status(200).json({
            message: "user found",
            data: { user },
        });
    } catch (err) {
        errorHandlerMw(err, res);
    }
};
