const errorHandlerMw = require("../middlewares/errorHandlerMw");
const Testmonial = require("../models/testmonialsModel");

const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const config = require("config");
const jwtSCRT = config.get("env_var.jwtScreteKey");

//get all testmonials
const getAllTestmonials = async (req, res) => {
    try {
        const filter = req.query;
        console.log(filter);
        const testmonials = await Testmonial.find(filter).exec();
        if (testmonials.length == 0) {
            return res
                .status(204)
                .json({ message: "No testmonials were added yet" });
        }

        res.status(200).json({
            message: "testmonials found",
            results: testmonials.length,
            data: { testmonials },
        });
    } catch (err) {
        errorHandlerMw(err, req, res);
    }
};

//get testmonial by id
const getTestmonialById = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: "Invalid id" });
        }

        const testmonial = await Testmonial.findById(req.params.id).exec();

        if (!testmonial) {
            return res.status(204).json({ message: "testmonial not found" });
        }

        res.status(200).json({
            message: "testmonial found",
            data: { testmonial },
        });
    } catch (err) {
        errorHandlerMw(err, req, res);
    }
};

const addTestmonials = async (req, res) => {
    try {
        const { userId } = jwt.verify(
            req.header("Cookie").split("").slice(13).join(""),
            jwtSCRT
        );

        const { description, dateOfSubmation } = req.body;

        let testmonial = new Testmonial({
            userId,
            description,
            dateOfSubmation,
        });
        await testmonial.save();

        res.status(200).json({
            message: "testmonial was added successfully",
            data: { testmonial },
        });
    } catch (err) {
        errorHandlerMw(err, req, res);
    }
};

//update testmonial by testmonial id
const updateTestmonialById = async (req, res) => {
    try {
        const { userId } = jwt.verify(
            req.header("Cookie").split("").slice(13).join(""),
            jwtSCRT
        );

        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: "Invalid id" });
        }

        const { description, dateOfSubmation } = req.body;

        const testmonial = await Testmonial.findByIdAndUpdate(
            req.params.id,
            {
                userId,
                description,
                dateOfSubmation,
            },
            { returnOriginal: false }
        ).exec();

        if (!testmonial) {
            return res.status(400).json({ message: "Bad request" });
        }

        res.status(200).json({
            message: "testmonial was updated successfully",
            data: { testmonial },
        });
    } catch (err) {
        errorHandlerMw(err, req, res);
    }
};

const deleteTestmonialById = async (req, res) => {
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

        const testmonial = await Testmonial.findByIdAndDelete(
            req.params.id
        ).exec();

        if (!testmonial) {
            return res.status(400).json({ message: "Bad Request" });
        }

        res.status(200).json({
            message: "testmonial was deleted successfully",
            data: { testmonial },
        });
    } catch (err) {
        errorHandlerMw(err, req, res);
    }
};

module.exports = {
    getAllTestmonials,
    getTestmonialById,
    addTestmonials,
    updateTestmonialById,
    deleteTestmonialById,
};
