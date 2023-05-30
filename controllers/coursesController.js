const errorHandlerMw = require("../middlewares/errorHandlerMw");
const Course = require("../models/coursesModel");
const UserCourse = require("../models/userCoursesModel");
const userCourseService = require("../services/userCourseService");
const courseService = require("../services/courseService");

const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const config = require("config");
const jwtSCRT = config.get("env_var.jwtScreteKey");

//get all courses
exports.getAllCourses = async (req, res) => {
    try {
        const filter = req.query;
        console.log(filter);
        const courses = await Course.find(filter).exec();
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
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: "Invalid id" });
        }

        const course = await Course.findById(req.params.id).exec();

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

        const { courseName, links, imageUrl } = req.body;
        const courseAddedBefore = await Course.findOne({
            courseName,
        }).exec();

        if (courseAddedBefore) {
            return res.status(200).json({ message: "this name is used" });
        }

        const course = await Course.create({ courseName, links, imageUrl });

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
        if (!isAdmin) {
            return res.status(401).json({ message: "UNAUTHORIZED ACTION" });
        }

        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: "Invalid id" });
        }

        const { courseName, links, imageUrl } = req.body;

        const course = await Course.findByIdAndUpdate(
            req.params.id,
            {
                courseName,
                links,
                imageUrl,
            },
            { returnOriginal: false }
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
        if (!isAdmin) {
            return res.status(401).json({ message: "UNAUTHORIZED ACTION" });
        }

        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: "Invalid id" });
        }

        const { links } = req.body;

        const course = await Course.findByIdAndUpdate(
            req.params.id,
            {
                links,
            },
            { returnOriginal: false }
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

//subscripe to course by course id
exports.subscripeToCourseByCourseId = async (req, res) => {
    try {
        const { userId } = jwt.verify(req.header("x-auth-token"), jwtSCRT);

        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: "Invalid id" });
        }

        //add subscription to courses Model
        const course = await courseService.subscripe({
            Course,
            userId,
            courseId: req.params.id,
        });

        if (course === "subscriped".toUpperCase()) {
            return res.status(400).json({ message: "User subscriped before" });
        }

        if (!course) {
            return res.status(400).json({ message: "Bad Request" });
        }

        //add subscription to userCourses Model
        userCourseService.subscripe({
            UserCourse,
            userId,
            courseId: req.params.id,
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

        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: "Invalid id" });
        }

        //remove subscription to course Model
        const course = await courseService.unsubscripe({
            Course,
            userId,
            courseId: req.params.id,
        });
        if (!course) {
            return res.status(400).json({ message: "Bad Request" });
        }
        //-----------------------------------------------

        //remove subscription from userCourse model
        const userCourse = userCourseService.unsubscripe({
            UserCourse,
            userId,
            courseId: req.params.id,
        });
        //-----------------------------------------------
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
        if (!isAdmin) {
            return res.status(401).json({ message: "UNAUTHORIZED ACTION" });
        }

        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: "Invalid id" });
        }

        const course = await Course.findByIdAndDelete(req.params.id).exec();

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
