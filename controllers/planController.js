const errorHandlerMw = require("../middlewares/errorHandlerMw");
const Plan = require("../models/plansModel");

const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const config = require("config");
const jwtSCRT = config.get("env_var.jwtScreteKey");

//get all plans
const getAllPlans = async (req, res) => {
    try {
        const filter = req.query;
        console.log(filter);
        const plans = await Plan.find(filter).exec();
        if (!plans) {
            return res.status(204).json({ message: "No plans were added yet" });
        }

        res.status(200).json({
            message: "plans found",
            results: plans.length,
            data: { plans },
        });
    } catch (err) {
        errorHandlerMw(err, req, res);
    }
};

const getPlanById = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: "Invalid id" });
        }

        const plan = await Plan.findById(req.params.id).exec();

        if (!plan) {
            return res.status(204).json({ message: "plan not found" });
        }

        res.status(200).json({
            message: "plan found",
            data: { plan },
        });
    } catch (err) {
        errorHandlerMw(err, req, res);
    }
};

const addPlan = async (req, res) => {
    try {
        const { isAdmin } = jwt.verify(
            req.header("Cookie").split("").slice(13).join(""),
            jwtSCRT
        );
        if (!isAdmin) {
            return res.status(401).json({ message: "UNAUTHORIZED ACTION" });
        }

        const { planName, features, costOfPlan, subscriptionType } = req.body;

        let plan = new Plan({
            planName,
            features,
            costOfPlan,
            subscriptionType,
        });
        await plan.save();

        res.status(200).json({
            message: "plan was added successfully",
            data: { plan },
        });
    } catch (err) {
        errorHandlerMw(err, req, res);
    }
};

//update plan by plan id
const updatePlanById = async (req, res) => {
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

        const { planName, features, costOfPlan, subscriptionType } = req.body;

        const plan = await Plan.findByIdAndUpdate(
            req.params.id,
            {
                planName,
                features,
                costOfPlan,
                subscriptionType,
            },
            { returnOriginal: false }
        ).exec();

        if (!plan) {
            return res.status(400).json({ message: "Bad request" });
        }

        res.status(200).json({
            message: "plan was updated successfully",
            data: { plan },
        });
    } catch (err) {
        errorHandlerMw(err, req, res);
    }
};

const deletePlan = async (req, res) => {
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

        const plan = await Plan.findByIdAndDelete(req.params.id).exec();

        if (!plan) {
            return res.status(400).json({ message: "Bad Request" });
        }

        res.status(200).json({
            message: "plan was deleted successfully",
            data: { plan },
        });
    } catch (err) {
        errorHandlerMw(err, req, res);
    }
};

module.exports = {
    getAllPlans,
    getPlanById,
    addPlan,
    updatePlanById,
    deletePlan,
};
