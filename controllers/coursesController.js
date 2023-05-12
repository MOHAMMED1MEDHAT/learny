const errorHandlerMw = require("../middlewares/errorHandlerMw");
const Course = require("../models/coursesModel");
const UserCourse = require("../models/userCoursesModel");

const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const config = require("config");
const jwtSCRT = config.get("env_var.jwtScreteKey");

//get all courses
const getAllCourses = async (req, res) => {
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
        errorHandlerMw(err, req, res);
    }
};

//get course by course id
const getCourseByCourseId = async (req, res) => {
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
        errorHandlerMw(err, req, res);
    }
};

//add course
const addCourse = async (req, res) => {
    try {
        const { isAdmin } = jwt.verify(
            req.header("Cookie").split("").slice(13).join(""),
            jwtSCRT
        );
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

        let course = new Course({
            courseName,
            links,
            imageUrl,
        });
        await course.save();

        res.status(200).json({
            message: "course was added successfully",
            data: { course },
        });
    } catch (err) {
        errorHandlerMw(err, req, res);
    }
};

//update course by course id
const updateCourseByCourseId = async (req, res) => {
    try {
        const { isAdmin } = jwt.verify(
            req.header("Cookie").split("").slice(13).join(""),
            jwtSCRT
        );
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
        errorHandlerMw(err, req, res);
    }
};

//update course links by course id
const updateCourseLinksByCourseId = async (req, res) => {
    try {
        const { isAdmin } = jwt.verify(
            req.header("Cookie").split("").slice(13).join(""),
            jwtSCRT
        );
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
        errorHandlerMw(err, req, res);
    }
};

//subscripe to course by course id
const subscripeToCourseByCourseId = async (req, res) => {
    try {
        const { userId } = jwt.verify(
            req.header("Cookie").split("").slice(13).join(""),
            jwtSCRT
        );

        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: "Invalid id" });
        }

        //add subscription to courses Model
        const { subscripers } = await Course.findById(req.params.id).exec();
        for (const subscriper of subscripers) {
            if (subscriper.subscriperId == userId) {
                return res
                    .status(400)
                    .json({ message: "user subscriped before" });
            }
        }

        const subscriper = {
            subscriperId: userId,
        };
        subscripers.push(subscriper);

        const course = await Course.findByIdAndUpdate(
            req.params.id,
            {
                subscripers,
            },
            { returnOriginal: false }
        ).exec();

        if (!course) {
            return res.status(400).json({ message: "Bad Request" });
        }

        //add subscription to userCourses Model
        //NOTE: if user never subscriped
        const userSubscripedCoursesBefore = await UserCourse.findOne({
            userId,
        }).exec();

        const coursesOfUser = {
            courseId: course._id,
            watched: "0.0",
            passed: false,
        };

        if (!userSubscripedCoursesBefore) {
            let userCourse = new UserCourse({
                userId,
                courses: [coursesOfUser],
            });
            await userCourse.save();
        } else {
            const { courses } = await UserCourse.findOne({ userId }).exec();

            courses.push(coursesOfUser);

            const userCourse = await UserCourse.findOneAndUpdate(
                { userId },
                {
                    courses,
                },
                { returnOriginal: false }
            ).exec();
        }

        res.status(200).json({
            message: "subscriped successfully",
            data: { course },
        });
    } catch (err) {
        errorHandlerMw(err, req, res);
    }
};

//unsubscripe to course by course id
const unsubscripeToCourseByCourseId = async (req, res) => {
    try {
        const { userId } = jwt.verify(
            req.header("Cookie").split("").slice(13).join(""),
            jwtSCRT
        );

        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: "Invalid id" });
        }

        //remove subscription to course Model
        const { subscripers } = await Course.findById(req.params.id).exec();
        let subscriper = {};
        for (const elm of subscripers) {
            if (elm.subscriperId == userId) {
                subscriper = elm;
            }
        }
        const idxOfSubscriper = subscripers.indexOf(subscriper);
        subscripers.splice(idxOfSubscriper, 1);

        const course = await Course.findByIdAndUpdate(
            req.params.id,
            {
                subscripers,
            },
            { returnOriginal: false }
        ).exec();

        if (!course) {
            return res.status(400).json({ message: "Bad Request" });
        }
        //-----------------------------------------------

        //remove subscription from userCourse model
        const { courses } = await UserCourse.findOne({ userId }).exec();
        let usercourse = {};
        for (const elm of courses) {
            if (elm.courseId == course._id) {
                userCourse = elm;
            }
        }
        const idxOfUserCourse = courses.indexOf(usercourse);
        courses.splice(idxOfUserCourse, 1);

        const userCourse = await UserCourse.findOneAndUpdate(
            { userId },
            {
                courses,
            },
            { returnOriginal: false }
        ).exec();

        //-----------------------------------------------
        res.status(200).json({
            message: "unsubscriped successfully",
            data: { course, userCourse },
        });
    } catch (err) {
        errorHandlerMw(err, req, res);
    }
};

//delete course by course id
const deleteCourseByCourseId = async (req, res) => {
    try {
        const { isAdmin } = jwt.verify(
            req.header("Cookie").split("").slice(13).join(""),
            jwtSCRT
        );
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
        errorHandlerMw(err, req, res);
    }
};

module.exports = {
    getAllCourses,
    getCourseByCourseId,
    addCourse,
    updateCourseByCourseId,
    updateCourseLinksByCourseId,
    subscripeToCourseByCourseId,
    unsubscripeToCourseByCourseId,
    deleteCourseByCourseId,
};
