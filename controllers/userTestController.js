const errorHandlerMw = require("../middlewares/errorHandlerMw");
const UserTest = require("./../models/userTestModel");

const jwt = require("jsonwebtoken");
const config = require("config");
const jwtSCRT = config.get("env_var.jwtScreteKey");

//get all user test by user id
exports.getAllUserTestByUserId = async (req, res) => {
    try {
        const { userId } = jwt.verify(req.header("x-auth-token"), jwtSCRT);

        const userTest = await UserTest.find({ userId }).exec();
        if (userTest.length == 0) {
            return res
                .status(204)
                .json({ message: "No userTest were added yet" });
        }

        res.status(200).json({
            message: "userTest found",
            results: userTest.length,
            data: { userTest },
        });
    } catch (err) {
        errorHandlerMw(err, res);
    }
};

//get all user test by user id
exports.getAllUserTestByTestId = async (req, res) => {
    try {
        const testId = req.params.testId;

        const userTest = await UserTest.find({ testId }).exec();
        if (userTest.length == 0) {
            return res
                .status(204)
                .json({ message: "No userTest were added yet" });
        }

        res.status(200).json({
            message: "userTest found",
            results: userTest.length,
            data: { userTest },
        });
    } catch (err) {
        errorHandlerMw(err, res);
    }
};
