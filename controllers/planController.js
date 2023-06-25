const errorHandlerMw = require("../middlewares/errorHandlerMw");
const Plan = require("../models/plansModel");
const PaymentRequest = require("../models/paymentRequestsModel");
const APIfeatures = require("./../util/queryHandler");
const paymobService = require("./../services/paymobService");

const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const config = require("config");
const jwtSCRT = config.get("env_var.jwtScreteKey");

//get all plans
exports.getAllPlans = async (req, res) => {
    try {
        let Query = Plan.find();

        const APIfeaturesObj = new APIfeatures(Query, req.query)
            .filter()
            .sort()
            .project()
            .pagination();

        const plans = await APIfeaturesObj.MongooseQuery;
        if (plans.length == 0) {
            return res.status(204).json({ message: "No plans were added yet" });
        }

        res.status(200).json({
            message: "plans found",
            results: plans.length,
            data: { plans },
        });
    } catch (err) {
        errorHandlerMw(err, res);
    }
};

exports.getPlanById = async (req, res) => {
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
        errorHandlerMw(err, res);
    }
};

exports.subscripeToPlan = async (req, res) => {
    try {
        //A.1: get the paymet data
        const { userId } = jwt.verify(req.header("x-auth-token"), jwtSCRT);

        const plan = await Plan.findById(req.params.id);
        //A.2: create paymentRequest
        await PaymentRequest.create({
            userId,
            planId: plan._id,
            planName: plan.planName,
        });

        //A.3: calculate the plan cost
        const cost = plan.costOfPlan - plan.costOfPlan * plan.priceDiscount;

        //A.4: contact with paymob API
    } catch (err) {
        errorHandlerMw(err, res);
    }
};

exports.addPlan = async (req, res) => {
    try {
        const { isAdmin } = jwt.verify(req.header("x-auth-token"), jwtSCRT);
        if (!isAdmin) {
            return res.status(401).json({ message: "UNAUTHORIZED ACTION" });
        }

        const { planName, features, costOfPlan, subscriptionType } = req.body;

        const plan = await Plan.create({
            planName,
            features,
            costOfPlan,
            subscriptionType,
        });

        res.status(200).json({
            message: "plan was added successfully",
            data: { plan },
        });
    } catch (err) {
        errorHandlerMw(err, res);
    }
};

//update plan by plan id
exports.updatePlanById = async (req, res) => {
    try {
        const { isAdmin } = jwt.verify(req.header("x-auth-token"), jwtSCRT);
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
            { runValidators: true, new: true }
        ).exec();

        if (!plan) {
            return res.status(400).json({ message: "Bad request" });
        }

        res.status(200).json({
            message: "plan was updated successfully",
            data: { plan },
        });
    } catch (err) {
        errorHandlerMw(err, res);
    }
};

exports.deletePlan = async (req, res) => {
    try {
        const { isAdmin } = jwt.verify(req.header("x-auth-token"), jwtSCRT);
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
        errorHandlerMw(err, res);
    }
};
