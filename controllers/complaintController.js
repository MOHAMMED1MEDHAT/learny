const errorHandlerMw = require("./../middlewares/errorHandlerMw");
const Complaint = require("../models/complaintsModel");
const APIfeatures = require("./../util/queryHandler");

const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const config = require("config");
const jwtSCRT = config.get("env_var.jwtScreteKey");

//get all complaints
exports.getAllComplaints = async (req, res) => {
    try {
        let Query = Complaint.find();

        const APIfeaturesObj = new APIfeatures(Query, req.query)
            .filter()
            .sort()
            .project()
            .pagination();

        const complaints = await APIfeaturesObj.MongooseQuery;
        // const complaints = await Complaint.find();
        if (complaints.length == 0) {
            return res
                .status(204)
                .json({ message: "No complaints were added yet" });
        }

        res.status(200).json({
            message: "complaints found",
            results: complaints.length,
            data: { complaints },
        });
    } catch (err) {
        errorHandlerMw(err, res);
    }
};

//get all complaints by user id
exports.getAllComplaintsByUserId = async (req, res) => {
    try {
        const { userId } = jwt.verify(req.header("x-auth-token"), jwtSCRT);

        const complaints = await Complaint.find({ userId }).exec();
        if (complaints.length == 0) {
            return res
                .status(204)
                .json({ message: "No complaints were added yet" });
        }

        res.status(200).json({
            message: "complaints found",
            results: complaints.length,
            data: { complaints },
        });
    } catch (err) {
        errorHandlerMw(err, res);
    }
};

exports.getComplaintByComplaintId = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: "Invalid id" });
        }

        const complaint = await Complaint.findById(req.params.id).exec();

        if (!complaint) {
            return res.status(204).json({ message: "complaint not found" });
        }

        res.status(200).json({
            message: "complaint found",
            data: { complaint },
        });
    } catch (err) {
        e;

        rrorHandlerMw(err, res);
    }
};

exports.addComplaint = async (req, res) => {
    try {
        const { name, emailToContact, subjectOfComplaint, message } = req.body;

        const complaint = await Complaint.create({
            name,
            emailToContact,
            subjectOfComplaint,
            message,
        });

        res.status(200).json({
            message: "complaint was added successfully",
            data: { complaint },
        });
    } catch (err) {
        errorHandlerMw(err, res);
    }
};

//update complaint by complaint id
exports.updateComplaintByComplaintId = async (req, res) => {
    try {
        const { isAdmin } = jwt.verify(req.header("x-auth-token"), jwtSCRT);
        if (!isAdmin) {
            return res.status(401).json({ message: "UNAUTHORIZED ACTION" });
        }

        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: "Invalid id" });
        }

        const { courseName, links, imageUrl } = req.body;

        const complaint = await Complaint.findByIdAndUpdate(
            req.params.id,
            {
                courseName,
                links,
                imageUrl,
            },
            { runValidators: true, new: true }
        ).exec();

        if (!complaint) {
            return res.status(400).json({ message: "Bad request" });
        }

        res.status(200).json({
            message: "complaint was updated successfully",
            data: { complaint },
        });
    } catch (err) {
        errorHandlerMw(err, res);
    }
};

exports.deleteComplaintByComplaintId = async (req, res) => {
    try {
        const { isAdmin } = jwt.verify(req.header("x-auth-token"), jwtSCRT);
        if (!isAdmin) {
            return res.status(401).json({ message: "UNAUTHORIZED ACTION" });
        }

        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: "Invalid id" });
        }

        const complaint = await Complaint.findByIdAndDelete(
            req.params.id
        ).exec();

        if (!complaint) {
            return res.status(400).json({ message: "Bad Request" });
        }

        res.status(200).json({
            message: "complaint was deleted successfully",
            data: { complaint },
        });
    } catch (err) {
        errorHandlerMw(err, res);
    }
};
