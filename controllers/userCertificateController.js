const errorHandlerMw = require("../middlewares/errorHandlerMw");
const UserCertificate = require("./../models/userCertificatesModel");

const { createCertificate } = require("./../services/UserCertificateService");

const jwt = require("jsonwebtoken");
const config = require("config");
const jwtSCRT = config.get("env_var.jwtScreteKey");

//get all user test by user id
exports.getAllUserCertificatesByUserId = async (req, res) => {
    try {
        const { userId } = jwt.verify(req.header("x-auth-token"), jwtSCRT);

        const userCertificate = await UserCertificate.find({ userId }).exec();
        if (userCertificate.length == 0) {
            return res
                .status(204)
                .json({ message: "No userCertificate were added yet" });
        }

        res.status(200).json({
            message: "userCertificate found",
            results: userCertificate.length,
            data: { userCertificate },
        });
    } catch (err) {
        errorHandlerMw(err, res);
    }
};

//get all user test by user id
exports.getAllUserCertificateById = async (req, res) => {
    try {
        const userCertificate = await UserCertificate.findById(
            req.params.id
        ).exec();
        if (userCertificate.length == 0) {
            return res
                .status(204)
                .json({ message: "No userCertificate were added yet" });
        }

        res.status(200).json({
            message: "userCertificate found",
            results: userCertificate.length,
            data: { userCertificate },
        });
    } catch (err) {
        errorHandlerMw(err, res);
    }
};

exports.addUserCertificate = async (req, res) => {
    try {
        const { userId } = jwt.verify(req.header("x-auth-token"), jwtSCRT);
        const { certificateLink, grade } = req.body;

        certificateLink = await createCertificate({ certificateLink });

        const userCertificate = await UserCertificate.create({
            userId,
            certificateLink,
            grade,
        });

        res.status(200).json({
            message: "UserCertificate was added successfully",
            data: { userCertificate },
        });
    } catch (err) {
        errorHandlerMw(err, res);
    }
};
