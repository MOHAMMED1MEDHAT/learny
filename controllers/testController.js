const errorHandlerMw = require("../middlewares/errorHandlerMw");
const Test = require("../models/testModel");
const UserTrack = require("../models/userTrackModel");
const UserCourse = require("../models/userCoursesModel");
const userTrackService = require("./../services/userTrackService");
const userCourseService = require("./../services/userCourseService");
const APIfeatures = require("./../util/queryHandler");
const { calcGrade } = require("./../services/userTestService");

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
        const testId = req.params.id;

        if (!mongoose.isValidObjectId(testId)) {
            return res.status(400).json({ message: "Invalid id" });
        }

        const test = await Test.findById(testId).exec();

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
exports.CheckUserAnswersToTestById = async (req, res) => {
    try {
        const { userId } = jwt.verify(req.header("x-auth-token"), jwtSCRT);
        const { testId, type, typeId } = req.query;
        const { answers } = req.body;

        const { grade, message, correctAndNotObj } = await calcGrade({
            testId,
            userId,
            answers,
        });

        if (message === "passed") {
            if (type === "track") {
                await userTrackService.updateTrackPassedState({
                    UserTrack,
                    trackId: typeId,
                    userId,
                    isPassed: true,
                });
            } else if (type === "course") {
                await userCourseService.updateCoursePassedState({
                    UserCourse,
                    courseId: typeId,
                    userId,
                    isPassed: true,
                });
            }
        }

        res.status(200).json({
            message: "success",
            data: { grade, message, correctAndNotObj },
        });
    } catch (err) {
        // console.log(err);
        errorHandlerMw(err, res);
    }
};

//update test by test id
exports.updateTestById = async (req, res) => {
    try {
        const { isAdmin } = jwt.verify(req.header("x-auth-token"), jwtSCRT);
        const testId = req.params.id;
        if (!isAdmin) {
            return res.status(401).json({ message: "UNAUTHORIZED ACTION" });
        }

        if (!mongoose.isValidObjectId(testId)) {
            return res.status(400).json({ message: "Invalid id" });
        }

        const { testName, questions, successGrade } = req.body;

        const test = await Test.findByIdAndUpdate(
            testId,
            {
                testName,
                questions,
                successGrade,
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
        const testId = req.params.id;

        if (!isAdmin) {
            return res.status(401).json({ message: "UNAUTHORIZED ACTION" });
        }

        if (!mongoose.isValidObjectId(testId)) {
            return res.status(400).json({ message: "Invalid id" });
        }

        const test = await Test.findByIdAndDelete(testId).exec();

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
