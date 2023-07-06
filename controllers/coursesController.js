const errorHandlerMw = require("../middlewares/errorHandlerMw");
const Course = require("../models/coursesModel");
const userCourseService = require("../services/userCourseService");
const courseService = require("../services/courseService");
const APIfeatures = require("./../util/queryHandler");

const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const config = require("config");
const jwtSCRT = config.get("env_var.jwtScreteKey");

//get all courses
exports.getAllCourses = async (req, res) => {
    try {
        let Query = Course.find();

        const APIfeaturesObj = new APIfeatures(Query, req.query)
            .filter()
            .sort()
            .project()
            .pagination();

        const courses = await APIfeaturesObj.MongooseQuery.populate({
            path: "testId",
        });
        if (courses.length == 0) {
            return res
                .status(204)
                .json({ message: "No courses were added yet" });
        }

        res.status(200).json({
            message: "courses found",
            results: courses.length,
            data: { courses },
        });
    } catch (err) {
        errorHandlerMw(err, res);
    }
};

//get course by course id
exports.getCourseByCourseId = async (req, res) => {
    try {
        const courseId = req.params.id;

        if (!mongoose.isValidObjectId(courseId)) {
            return res.status(400).json({ message: "Invalid id" });
        }

        const course = await Course.findById(courseId)
            .populate({
                path: "testId",
            })
            .exec();

        if (!course) {
            return res.status(204).json({ message: "course not found" });
        }

        res.status(200).json({ message: "course found", data: { course } });
    } catch (err) {
        errorHandlerMw(err, res);
    }
};

//add course
exports.addCourse = async (req, res) => {
    try {
        const { isAdmin } = jwt.verify(req.header("x-auth-token"), jwtSCRT);
        if (!isAdmin) {
            return res.status(401).json({ message: "UNAUTHORIZED ACTION" });
        }

        const { courseName, links, imageUrl, testId, totalWatchTime } =
            req.body;

        if (await courseService.isNameExist({ courseName })) {
            return res.status(409).json({ message: "this name is used" });
        }

        const course = await Course.create({
            courseName,
            links,
            imageUrl,
            testId,
            totalWatchTime,
        });

        res.status(200).json({
            message: "course was added successfully",
            data: { course },
        });
    } catch (err) {
        errorHandlerMw(err, res);
    }
};

//update course by course id
exports.updateCourseByCourseId = async (req, res) => {
    try {
        const { isAdmin } = jwt.verify(req.header("x-auth-token"), jwtSCRT);
        const courseId = req.params.id;

        if (!isAdmin) {
            return res.status(401).json({ message: "UNAUTHORIZED ACTION" });
        }

        if (!mongoose.isValidObjectId(courseId)) {
            return res.status(400).json({ message: "Invalid id" });
        }

        const { courseName, links, imageUrl, testId, totalWatchTime } =
            req.body;

        const course = await Course.findByIdAndUpdate(
            courseId,
            {
                courseName,
                links,
                imageUrl,
                testId,
                totalWatchTime,
            },
            { runValidators: true, new: true }
        ).exec();

        if (!course) {
            return res.status(400).json({ message: "Bad request" });
        }

        res.status(200).json({
            message: "course was updated successfully",
            data: { course },
        });
    } catch (err) {
        errorHandlerMw(err, res);
    }
};

//update course links by course id
exports.updateCourseLinksByCourseId = async (req, res) => {
    try {
        const { isAdmin } = jwt.verify(req.header("x-auth-token"), jwtSCRT);
        const courseId = req.params.id;

        if (!isAdmin) {
            return res.status(401).json({ message: "UNAUTHORIZED ACTION" });
        }

        if (!mongoose.isValidObjectId(courseId)) {
            return res.status(400).json({ message: "Invalid id" });
        }

        const { links } = req.body;

        const course = await Course.findByIdAndUpdate(
            courseId,
            {
                links,
            },
            { runValidators: true, new: true }
        ).exec();

        if (!course) {
            return res.status(400).json({ message: "Bad Request" });
        }

        res.status(200).json({
            message: "course links was updated successfully",
            data: { course },
        });
    } catch (err) {
        errorHandlerMw(err, res);
    }
};

//TODO:this will be inside sub of track in side a map of course ids
//subscripe to course by course id
exports.subscripeToCourseByCourseId = async (req, res) => {
    try {
        const { userId } = jwt.verify(req.header("x-auth-token"), jwtSCRT);
        const courseId = req.params.id;

        if (!mongoose.isValidObjectId(courseId)) {
            return res.status(400).json({ message: "Invalid id" });
        }

        //add subscription to courses Model
        const course = await courseService.subscripe({
            userId,
            courseId,
        });

        if (!course) {
            return res.status(400).json({ message: "Bad Request" });
        }

        //TODO: REMOVE IN PRODUCTION
        if (course === "subscriped".toUpperCase()) {
            return res.status(400).json({ message: "User subscriped before" });
        }

        //add subscription to userCourses Model
        await userCourseService.subscripe({
            userId,
            courseId,
        });

        res.status(200).json({
            message: "subscriped successfully",
            data: { course },
        });
    } catch (err) {
        errorHandlerMw(err, res);
    }
};

//unsubscripe to course by course id
exports.unsubscripeToCourseByCourseId = async (req, res) => {
    try {
        const { userId } = jwt.verify(req.header("x-auth-token"), jwtSCRT);
        const courseId = req.params.id;

        if (!mongoose.isValidObjectId(courseId)) {
            return res.status(400).json({ message: "Invalid id" });
        }

        //remove subscription to course Model
        const course = await courseService.unsubscripe({
            userId,
            courseId,
        });
        if (!course) {
            return res.status(400).json({ message: "Bad Request" });
        }

        //remove subscription from userCourse model
        const userCourse = await userCourseService.unsubscripe({
            userId,
            courseId,
        });

        res.status(200).json({
            message: "unsubscriped successfully",
            data: { course, userCourse },
        });
    } catch (err) {
        // console.log(err.message);
        errorHandlerMw(err, res);
    }
};

//delete course by course id
exports.deleteCourseByCourseId = async (req, res) => {
    try {
        const { isAdmin } = jwt.verify(req.header("x-auth-token"), jwtSCRT);
        const courseId = req.params.id;

        if (!isAdmin) {
            return res.status(401).json({ message: "UNAUTHORIZED ACTION" });
        }

        if (!mongoose.isValidObjectId(courseId)) {
            return res.status(400).json({ message: "Invalid id" });
        }

        const course = await Course.findByIdAndDelete(courseId).exec();

        if (!course) {
            return res.status(400).json({ message: "Bad Request" });
        }

        res.status(200).json({
            message: "course was deleted successfully",
            data: { course },
        });
    } catch (err) {
        errorHandlerMw(err, res);
    }
};
