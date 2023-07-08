const errorHandlerMw = require("../middlewares/errorHandlerMw");
const User = require("../models/userModel");
const Track = require("../models/trackModel");
const Course = require("../models/coursesModel");
const Plan = require("../models/plansModel");
const Complaint = require("../models/complaintsModel");
const Testmonials = require("../models/testmonialsModel");

const jwt = require("jsonwebtoken");
const config = require("config");
const jwtSCRT = config.get("env_var.jwtScreteKey");

exports.getNumOfUser = async (req, res) => {
    try {
        const { isAdmin } = jwt.verify(req.header("x-auth-token"), jwtSCRT);
        if (!isAdmin) {
            return res.status(401).json({ message: "UNAUTHORIZED ACTION" });
        }

        const stats = await User.aggregate([
            {
                $group: {
                    _id: null,
                    numOfUsers: { $sum: 1 },
                },
            },
        ]);

        const ResponseObj = { numOfUsers: stats[0].numOfUsers };

        res.status(200).json({
            message: "success",
            data: { ResponseObj },
        });
    } catch (err) {
        errorHandlerMw(err, res);
    }
};

exports.getNumOfUserForEachSubscriptionLevel = async (req, res) => {
    try {
        const { isAdmin } = jwt.verify(req.header("x-auth-token"), jwtSCRT);
        if (!isAdmin) {
            return res.status(401).json({ message: "UNAUTHORIZED ACTION" });
        }

        const stats = await User.aggregate([
            {
                $group: {
                    _id: "$subscription",
                    numOfSubscripers: { $sum: 1 },
                },
            },
        ]);

        const ResponseObj = stats.map((stat) => {
            return {
                subscriptionLevel: stat._id,
                numOfSubscripers: stat.numOfSubscripers,
            };
        });

        res.status(200).json({
            message: "success",
            data: { ResponseObj },
        });
    } catch (err) {
        errorHandlerMw(err, res);
    }
};

exports.getAllTracksSubscripersNum = async (req, res) => {
    try {
        const { isAdmin } = jwt.verify(req.header("x-auth-token"), jwtSCRT);
        if (!isAdmin) {
            return res.status(401).json({ message: "UNAUTHORIZED ACTION" });
        }

        const stats = await Track.aggregate([
            {
                $unwind: "$subscripers",
            },
            {
                $group: {
                    _id: null,
                    numOfSubscripersOfAllTracks: { $sum: 1 },
                },
            },
        ]);

        const ResponseObj = {
            totalSubscripers: stats[0].numOfSubscripersOfAllTracks,
        };

        res.status(200).json({
            message: "success",
            data: { ResponseObj },
        });
    } catch (err) {
        errorHandlerMw(err, res);
    }
};

exports.getEachTrackSubscripersNum = async (req, res) => {
    try {
        const { isAdmin } = jwt.verify(req.header("x-auth-token"), jwtSCRT);
        if (!isAdmin) {
            return res.status(401).json({ message: "UNAUTHORIZED ACTION" });
        }

        const stats = await Track.aggregate([
            {
                $unwind: "$subscripers",
            },
            {
                $group: {
                    _id: "$categoryName",
                    numOfSubscripers: { $sum: 1 },
                },
            },
        ]);

        const ResponseObj = stats.map((stat) => {
            return {
                trackName: stat._id,
                numOfSubscripers: stat.numOfSubscripers,
            };
        });

        res.status(200).json({
            message: "success",
            data: { ResponseObj },
        });
    } catch (err) {
        errorHandlerMw(err, res);
    }
};

exports.getEachMonthUsersSubs = async (req, res) => {
    try {
        const { isAdmin } = jwt.verify(req.header("x-auth-token"), jwtSCRT);
        if (!isAdmin) {
            return res.status(401).json({ message: "UNAUTHORIZED ACTION" });
        }

        const stats = await Track.aggregate([
            {
                $unwind: "$subscripers",
            },
            {
                $group: {
                    _id: { $month: "$subscripers.createdAt" },
                    numOfSubscripers: { $sum: 1 },
                },
            },
            {
                $addFields: { month: "$_id" },
            },
            {
                $project: { _id: 0 },
            },
            {
                $sort: { month: 1 },
            },
        ]);

        const ResponseObj = stats.map((stat) => {
            return {
                month: stat.month,
                numOfSubscripers: stat.numOfSubscripers,
            };
        });

        res.status(200).json({
            message: "success",
            data: { ResponseObj },
        });
    } catch (err) {
        errorHandlerMw(err, res);
    }
};

exports.getTotalEntitiesNums = async (req, res) => {
    try {
        const { isAdmin } = jwt.verify(req.header("x-auth-token"), jwtSCRT);
        if (!isAdmin) {
            return res.status(401).json({ message: "UNAUTHORIZED ACTION !!" });
        }

        const trackNums = await Track.aggregate([
            {
                $group: {
                    _id: null,
                    nums: { $sum: 1 },
                },
            },
            {
                $project: { _id: 0 },
            },
        ]);

        const courseNums = await Course.aggregate([
            {
                $group: {
                    _id: null,
                    nums: { $sum: 1 },
                },
            },
            {
                $project: { _id: 0 },
            },
        ]);

        const testmonialNums = await Testmonials.aggregate([
            {
                $group: {
                    _id: null,
                    nums: { $sum: 1 },
                },
            },
            {
                $project: { _id: 0 },
            },
        ]);

        const complaintNums = await Complaint.aggregate([
            {
                $group: {
                    _id: null,
                    nums: { $sum: 1 },
                },
            },
            {
                $project: { _id: 0 },
            },
        ]);

        const planNums = await Plan.aggregate([
            {
                $group: {
                    _id: null,
                    nums: { $sum: 1 },
                },
            },
            {
                $project: { _id: 0 },
            },
        ]);

        const ResponseObj = {};
        ResponseObj.trackNums = trackNums.length == 0 ? 0 : trackNums[0].nums;
        ResponseObj.courseNums =
            courseNums.length == 0 ? 0 : courseNums[0].nums;
        ResponseObj.complaintNums =
            complaintNums.length == 0 ? 0 : complaintNums[0].nums;
        ResponseObj.testmonialNums =
            testmonialNums.length == 0 ? 0 : testmonialNums[0].nums;
        ResponseObj.planNums = planNums.length == 0 ? 0 : planNums[0].nums;

        res.status(200).json({
            message: "success",
            data: { ResponseObj },
        });
    } catch (err) {
        errorHandlerMw(err, res);
    }
};
