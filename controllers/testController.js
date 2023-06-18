const errorHandlerMw = require("../middlewares/errorHandlerMw");
const Test = require("../models/testModel");
const UserTest = require("../models/userTestModel");
const APIfeatures = require("./../util/queryHandler");
const userTestService = require("./../services/userTestService");

const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const config = require("config");
const jwtSCRT = config.get("env_var.jwtScreteKey");

//get all tests
exports.getAllTests = async (req, res) => {
    try {
        let Query = Test.find();

        const APIfeaturesObj = new APIfeatures(Query, req.query)
            .filter()
            .sort()
            .project()
            .pagination();

        const tests = await APIfeaturesObj.MongooseQuery;
        if (tests.length == 0) {
            return res.status(204).json({ message: "No tests were added yet" });
        }

        res.status(200).json({
            message: "tests found",
            results: tests.length,
            data: { tests },
        });
    } catch (err) {
        errorHandlerMw(err, res);
    }
};

exports.getTestById = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: "Invalid id" });
        }

        const test = await Test.findById(req.params.id).exec();

        if (!test) {
            return res.status(204).json({ message: "test not found" });
        }

        res.status(200).json({
            message: "test found",
            data: { test },
        });
    } catch (err) {
        errorHandlerMw(err, res);
    }
};

exports.addTest = async (req, res) => {
    try {
        const { isAdmin } = jwt.verify(req.header("x-auth-token"), jwtSCRT);
        if (!isAdmin) {
            return res.status(401).json({ message: "UNAUTHORIZED ACTION" });
        }

        const { testName, questions, successGrade } = req.body;

        const test = await Test.create({
            testName,
            questions,
            successGrade,
        });

        res.status(200).json({
            message: "test was added successfully",
            data: { test },
        });
    } catch (err) {
        errorHandlerMw(err, res);
    }
};

//test answers for each user
exports.addUserAnswersToTestById = async (req, res) => {
    // try {
    const { userId } = jwt.verify(req.header("x-auth-token"), jwtSCRT);
    const testId = req.params.id;

    const { answers } = req.body;

    const { grade, message, correctAndNotObj } =
        await userTestService.calcGrade({
            UserTest,
            Test,
            userId,
            testId,
            answers,
        });

    res.status(200).json({
        data: { grade, message, correctAndNotObj },
    });
    // } catch (err) {
    //     errorHandlerMw(err, res);
    // }
};

//update test by test id
exports.updateTestById = async (req, res) => {
    try {
        const { isAdmin } = jwt.verify(req.header("x-auth-token"), jwtSCRT);
        if (!isAdmin) {
            return res.status(401).json({ message: "UNAUTHORIZED ACTION" });
        }

        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: "Invalid id" });
        }

        const { testName, questions } = req.body;

        const test = await Test.findByIdAndUpdate(
            req.params.id,
            {
                testName,
                questions,
            },
            { runValidators: true, new: true }
        ).exec();

        if (!test) {
            return res.status(400).json({ message: "Bad request" });
        }

        res.status(200).json({
            message: "test was updated successfully",
            data: { test },
        });
    } catch (err) {
        errorHandlerMw(err, res);
    }
};

exports.deleteTest = async (req, res) => {
    try {
        const { isAdmin } = jwt.verify(req.header("x-auth-token"), jwtSCRT);
        if (!isAdmin) {
            return res.status(401).json({ message: "UNAUTHORIZED ACTION" });
        }

        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: "Invalid id" });
        }

        const test = await Test.findByIdAndDelete(req.params.id).exec();

        if (!test) {
            return res.status(400).json({ message: "Bad Request" });
        }

        res.status(200).json({
            message: "test was deleted successfully",
            data: { test },
        });
    } catch (err) {
        errorHandlerMw(err, res);
    }
};
