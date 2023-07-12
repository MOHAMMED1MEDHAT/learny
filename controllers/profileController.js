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
            return res.status(204).json({ message: "ERROR No User" });
        }

        const ResponseObj = {
            name: user.name,
            email: user.email,
            phone: user.phone,
            imageUrl: user.imageUrl,
            address: user.address,
            dateOfbirth: user.dateOfBirth,
            subscription: user.subscription,
            isAdmin: user.isAdmin,
        };

        res.status(200).json({
            message: "user found",
            data: { ResponseObj },
        });
    } catch (err) {
        errorHandlerMw(err, res);
    }
};
