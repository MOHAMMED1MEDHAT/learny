//TODO: DELETE THIS FILE
const errorHandlerMw = require("../middlewares/errorHandlerMw");
const UserTrack = require("../models/userTrackModel");
// const Track = require("../models/trackModel");
// const APIfeatures = require("./../util/queryHandler");

const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const config = require("config");
const jwtSCRT = config.get("env_var.jwtScreteKey");

exports.getUserTracksByUserId = async (req, res) => {
    try {
        const { userId } = jwt.verify(req.header("x-auth-token"), jwtSCRT);

        if (!mongoose.isValidObjectId(userId)) {
            return res.status(400).json({ message: "Invalid id" });
        }

        const userTrack = await UserTrack.findOne({
            userId,
        }).exec();

        if (!userTrack) {
            return res.status(204).json({ message: "user track not found" });
        }

        res.status(200).json({
            message: "userTrack found",
            data: { userTrack },
        });
    } catch (err) {
        errorHandlerMw(err, res);
    }
};
