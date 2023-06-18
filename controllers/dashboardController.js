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
                    numTracks: { $sum: 1 },
                },
            },
        ]);

        res.status(200).json({
            message: "success",
            data: { stats },
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
                    numTracks: { $sum: 1 },
                },
            },
        ]);

        res.status(200).json({
            message: "success",
            data: { stats },
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
                    numTracks: { $sum: 1 },
                },
            },
        ]);

        res.status(200).json({
            message: "success",
            data: { stats },
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
                    numTracks: { $sum: 1 },
                },
            },
        ]);

        res.status(200).json({
            message: "success",
            data: { stats },
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
                    numTracks: { $sum: 1 },
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

        res.status(200).json({
            message: "success",
            data: { stats },
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

        let stats = {};
        stats.trackNums = trackNums.length == 0 ? 0 : trackNums[0].nums;
        stats.courseNums = courseNums.length == 0 ? 0 : courseNums[0].nums;
        stats.complaintNums =
            complaintNums.length == 0 ? 0 : complaintNums[0].nums;
        stats.testmonialNums =
            testmonialNums.length == 0 ? 0 : testmonialNums[0].nums;
        stats.planNums = planNums.length == 0 ? 0 : planNums[0].nums;

        res.status(200).json({
            message: "success",
            data: { stats },
        });
    } catch (err) {
        errorHandlerMw(err, res);
    }
};
