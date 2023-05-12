const errorHandlerMw = require("../middlewares/errorHandlerMw");
const Complaint = require("../models/complaintsModel");

const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const config = require("config");
const jwtSCRT = config.get("env_var.jwtScreteKey");

//get all complaints
const getAllComplaints = async (req, res) => {
    try {
        const filter = req.query;
        console.log(filter);
        const complaints = await Complaint.find(filter).exec();
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
        errorHandlerMw(err, req, res);
    }
};

//get all complaints by user id
const getAllComplaintsByUserId = async (req, res) => {
    try {
        const { userId } = jwt.verify(
            req.header("Cookie").split("").slice(13).join(""),
            jwtSCRT
        );

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
        errorHandlerMw(err, req, res);
    }
};

const getComplaintByComplaintId = async (req, res) => {
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
        errorHandlerMw(err, req, res);
    }
};

const addComplaint = async (req, res) => {
    try {
        const { name, emailToContact, subjectOfComplaint, message } = req.body;

        let complaint = new Complaint({
            name,
            emailToContact,
            subjectOfComplaint,
            message,
        });
        await complaint.save();

        res.status(200).json({
            message: "complaint was added successfully",
            data: { complaint },
        });
    } catch (err) {
        errorHandlerMw(err, req, res);
    }
};

//update complaint by complaint id
const updateComplaintByComplaintId = async (req, res) => {
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

        const complaint = await Complaint.findByIdAndUpdate(
            req.params.id,
            {
                courseName,
                links,
                imageUrl,
            },
            { returnOriginal: false }
        ).exec();

        if (!complaint) {
            return res.status(400).json({ message: "Bad request" });
        }

        res.status(200).json({
            message: "complaint was updated successfully",
            data: { complaint },
        });
    } catch (err) {
        errorHandlerMw(err, req, res);
    }
};

const deleteComplaintByComplaintId = async (req, res) => {
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
        errorHandlerMw(err, req, res);
    }
};

module.exports = {
    getAllComplaints,
    getAllComplaintsByUserId,
    getComplaintByComplaintId,
    addComplaint,
    updateComplaintByComplaintId,
    deleteComplaintByComplaintId,
};
