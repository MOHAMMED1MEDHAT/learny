const errorHandlerMw = require("../middlewares/errorHandlerMw");
const User = require("../models/userModel");
const Track = require("../models/trackModel");

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
                    numTours: { $sum: 1 },
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
                    numTours: { $sum: 1 },
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
                    numTours: { $sum: 1 },
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
                    numTours: { $sum: 1 },
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
                    numTours: { $sum: 1 },
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
