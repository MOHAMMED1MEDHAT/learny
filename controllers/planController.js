const errorHandlerMw = require("../middlewares/errorHandlerMw");
const Plan = require("../models/plansModel");
const User = require("../models/userModel");
const PaymentRequest = require("../models/paymentRequestsModel");
const APIfeatures = require("./../util/queryHandler");
const { getPaymobPaymentLink } = require("./../services/paymobService");

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

        const user = await User.findById(userId);
        //A.2:get plan data
        const plan = await Plan.findById(req.params.id);

        //A.3: calculate the plan cost
        const cost =
            (plan.costOfPlan - plan.costOfPlan * plan.priceDiscount) * 100;

        //A.4: contact with paymob API
        const { iframeLink, orderId } = await getPaymobPaymentLink({
            user,
            cost,
        });

        //A.5: create paymentRequest
        await PaymentRequest.create({
            userId,
            planId: plan._id,
            orderId,
            planSubscriptionType: plan.subscriptionType,
        });

        res.status(200).json({
            iframeLink,
        });
    } catch (err) {
        errorHandlerMw(err, res);
    }
};

exports.postPaymentOps = async (req, res) => {
    try {
        let message = "";

        const { order, success } = req.query;

        const paymentRequest = await PaymentRequest.findOne({ orderId: order });

        if (success === "false") {
            message = `subscription Faild to plan ${paymentRequest.planSubscriptionType}`;
        } else {
            await User.findByIdAndUpdate(paymentRequest.userId, {
                subscription: paymentRequest.planSubscriptionType,
            });

            message = `subscriped successfully to plan ${paymentRequest.planSubscriptionType}`;
        }

        await PaymentRequest.findByIdAndDelete(paymentRequest._id);

        res.status(200).send(`<html>
        <head>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
        .message {
          background-color: #595EF0;
          border: 1px solid #595EF0;
          padding: 10px;
          border-radius: 4px;
        }
        .message p {
          margin: 0;
          text-align:center;
          color:#EFF1FE;
        }
        </style>
        </head>
        <body>
        <div class="message">
          <p>${message}</p>
        </div>
        <div class="message">
          <p>${process.env.CLIENT_URL}</p>
        </div>
        </body>
        </html>`);
    } catch (err) {
        // console.log(err);
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
