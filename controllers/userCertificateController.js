const fs = require("fs");
const errorHandlerMw = require("../middlewares/errorHandlerMw");
const UserCertificate = require("./../models/userCertificatesModel");
const User = require("./../models/userModel");

const {
    createCertificate,
    downloadImageAsPdf,
} = require("./../services/UserCertificateService");

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
        if (!userCertificate) {
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

        const { name } = await User.findById(userId);

        const { userCertificateLink, filePath } = await createCertificate({
            certificateLink,
            name,
        });

        const userCertificate = await UserCertificate.create({
            userId,
            certificateLink: userCertificateLink,
            grade,
        });

        //4-delete all certificate assets from local storage (images,pdfs)
        //delete from images
        fs.unlink(filePath, (err) => {
            if (err) {
                console.error("Error deleting file:", err);
                return;
            }
        });

        //delete from pdfs
        fs.unlink(filePath.replace("images", "pdfs"), (err) => {
            if (err) {
                console.error("Error deleting file:", err);
                return;
            }
        });

        res.status(200).json({
            message: "UserCertificate was added successfully",
            data: { userCertificate },
        });
    } catch (err) {
        errorHandlerMw(err, res);
    }
};

exports.downloadCertificate = async (req, res) => {
    try {
        const { certificateLink } = await UserCertificate.findById(
            req.params.id
        );

        const certificatePath = await downloadImageAsPdf({ certificateLink });

        setTimeout(() => {
            res.status(200).download(certificatePath, (err) => {
                if (err) {
                    throw new Error(err.message);
                } else {
                    //delete from images
                    fs.unlink(
                        certificatePath
                            .replace("pdfs", "images")
                            .replace(".pdf", ".jpg"),
                        (err) => {
                            if (err) {
                                console.error("Error deleting file :", err);
                                return;
                            }
                        }
                    );
                    //delete from pdfs
                    fs.unlink(
                        certificatePath.replace(".jpg", ".pdf"),
                        (err) => {
                            if (err) {
                                console.error("Error deleting file:", err);
                                return;
                            }
                        }
                    );
                }
            });
        }, 100);
    } catch (err) {
        errorHandlerMw(err, res);
    }
};
