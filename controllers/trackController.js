const errorHandlerMw = require("../middlewares/errorHandlerMw");
const Track = require("../models/trackModel");
const APIfeatures = require("./../util/queryHandler");

const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const config = require("config");
const jwtSCRT = config.get("env_var.jwtScreteKey");

//get all tracks
exports.getAllTracks = async (req, res) => {
    try {
        let Query = Track.find();

        const APIfeaturesObj = new APIfeatures(Query, req.query)
            .filter()
            .sort()
            .project()
            .pagination();

        const tracks = await APIfeaturesObj.MongooseQuery.populate({
            path: "courses",
            populate: {
                path: "courseId",
                select: "courseName",
            },
        });
        // const tracks = await Track.find();
        if (tracks.length == 0) {
            return res
                .status(204)
                .json({ message: "No tracks were added yet" });
        }

        res.status(200).json({
            message: "tracks found",
            results: tracks.length,
            data: { tracks },
        });
    } catch (err) {
        errorHandlerMw(err, res);
    }
};

//get track by id
exports.getTrackById = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: "Invalid id" });
        }

        const track = await Track.findById(req.params.id)
            .populate({
                path: "courses",
                populate: {
                    path: "courseId",
                    select: "courseName imageUrl",
                },
            })
            .populate({
                path: "subscripers",
                populate: {
                    path: "subscriperId",
                    select: "name",
                },
            })
            .exec();

        if (!track) {
            return res.status(204).json({ message: "track not found" });
        }

        res.status(200).json({ message: "track found", data: { track } });
    } catch (err) {
        errorHandlerMw(err, res);
    }
};

//add track
exports.addTrack = async (req, res) => {
    try {
        const { isAdmin } = jwt.verify(req.header("x-auth-token"), jwtSCRT);
        if (!isAdmin) {
            return res.status(401).json({ message: "UNAUTHORIZED ACTION" });
        }

        const { categoryName, roadmap, subscriptionLevel, imageUrl, courses } =
            req.body;
        const trackAddedBefore = await Track.findOne({
            categoryName,
        }).exec();

        if (trackAddedBefore) {
            return res.status(409).json({ message: "this name is used" });
        }

        const track = await Track.create({
            categoryName,
            roadmap,
            subscriptionLevel,
            imageUrl,
            courses,
        });

        res.status(200).json({
            message: "track was added successfully",
            data: { track },
        });
    } catch (err) {
        errorHandlerMw(err, res);
    }
};

//update track by id
exports.updateTrackById = async (req, res) => {
    try {
        const { isAdmin } = jwt.verify(req.header("x-auth-token"), jwtSCRT);
        if (!isAdmin) {
            return res.status(401).json({ message: "UNAUTHORIZED ACTION" });
        }

        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: "Invalid id" });
        }

        const { categoryName, Roadmap, subscriptionLevel, imageUrl, courses } =
            req.body;

        const track = await Track.findByIdAndUpdate(
            req.params.id,
            {
                categoryName,
                Roadmap,
                subscriptionLevel,
                imageUrl,
                courses,
            },
            { runValidators: true, new: true }
        ).exec();

        if (!track) {
            return res.status(400).json({ message: "Bad request" });
        }

        res.status(200).json({
            message: "track was updated successfully",
            data: { track },
        });
    } catch (err) {
        errorHandlerMw(err, res);
    }
};

//update track courses
//TODO: check if the course exists
exports.addCoursesToTrack = async (req, res) => {
    // try {
    const { isAdmin } = jwt.verify(req.header("x-auth-token"), jwtSCRT);
    if (!isAdmin) {
        return res.status(401).json({ message: "UNAUTHORIZED ACTION" });
    }

    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({ message: "Invalid id" });
    }

    const { courses } = req.body;

    let trackOldCourses = (await Track.findById(req.params.id)).courses;

    if (trackOldCourses.length == 0) {
        courses.map((course) => {
            trackOldCourses.push(course);
        });
    } else {
        trackOldCourses.map((course) => {
            for (courseFromReq of courses) {
                if (courseFromReq.courseId != course.courseId) {
                    trackOldCourses.push(courseFromReq);
                }
            }
        });
    }

    const track = await Track.findByIdAndUpdate(
        req.params.id,
        {
            courses: trackOldCourses,
        },
        { returnOriginal: false }
    ).exec();

    if (!track) {
        return res.status(400).json({ message: "Bad Request" });
    }

    res.status(200).json({
        message: "courses was added successfully to track",
        data: { track },
    });
    // } catch (err) {
    //     errorHandlerMw(err, res);
    // }
};

exports.deleteCoursesFromTrack = async (req, res) => {
    try {
        const { isAdmin } = jwt.verify(req.header("x-auth-token"), jwtSCRT);
        if (!isAdmin) {
            return res.status(401).json({ message: "UNAUTHORIZED ACTION" });
        }

        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: "Invalid id" });
        }

        const { courses } = req.body;

        const trackOldCourses = (await Track.findById(req.params.id)).courses;

        trackOldCourses
            .map((course) => {
                for (courseFromReq of courses) {
                    return course.courseId == courseFromReq.courseId;
                }
            })
            .map((courseToRemove, index) => {
                if (courseToRemove) {
                    trackOldCourses.splice(index, 1);
                }
            });

        console.log(trackOldCourses.length);

        const track = await Track.findByIdAndUpdate(
            req.params.id,
            {
                courses: trackOldCourses,
            },
            { returnOriginal: false }
        ).exec();

        if (!track) {
            return res.status(400).json({ message: "Bad Request" });
        }

        res.status(200).json({
            message: "courses was removed successfully from track",
            data: { track },
        });
    } catch (err) {
        errorHandlerMw(err, res);
    }
};

//subscripe to track by track id
exports.subscripeToTrackByTrackId = async (req, res) => {
    try {
        const { userId } = jwt.verify(req.header("x-auth-token"), jwtSCRT);

        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: "Invalid id" });
        }

        const { subscripers } = await Track.findById(req.params.id).exec();
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

        const track = await Track.findByIdAndUpdate(
            req.params.id,
            {
                subscripers,
            },
            { returnOriginal: false }
        ).exec();

        if (!track) {
            return res.status(400).json({ message: "Bad Request" });
        }

        res.status(200).json({
            message: "subscriped successfully",
            data: { track },
        });
    } catch (err) {
        errorHandlerMw(err, res);
    }
};

//unsubscripe to track by track id
exports.unsubscripeToTrackById = async (req, res) => {
    try {
        const { userId } = jwt.verify(req.header("x-auth-token"), jwtSCRT);

        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: "Invalid id" });
        }

        const { subscripers } = await Track.findById(req.params.id).exec();
        let subcriper = {};
        for (const elm of subscripers) {
            if (elm.subscriperId == userId) {
                subcriper = elm;
            }
        }
        const idx = subscripers.indexOf(subcriper);
        subscripers.splice(idx, 1);

        const newSubscripers = subscripers;

        const track = await Track.findByIdAndUpdate(
            req.params.id,
            {
                subscripers: newSubscripers,
            },
            { returnOriginal: false }
        ).exec();

        if (!track) {
            return res.status(400).json({ message: "Bad Request" });
        }

        res.status(200).json({
            message: "unsubscriped successfully",
            data: { track },
        });
    } catch (err) {
        errorHandlerMw(err, res);
    }
};

//delete track by id
exports.deleteTrackByTrackId = async (req, res) => {
    try {
        const { isAdmin } = jwt.verify(req.header("x-auth-token"), jwtSCRT);
        if (!isAdmin) {
            return res.status(401).json({ message: "UNAUTHORIZED ACTION" });
        }

        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: "Invalid id" });
        }

        const track = await Track.findByIdAndDelete(req.params.id).exec();

        if (!track) {
            return res.status(400).json({ message: "Bad Request" });
        }

        res.status(200).json({
            message: "track was deleted successfully",
            data: { track },
        });
    } catch (err) {
        errorHandlerMw(err, res);
    }
};
