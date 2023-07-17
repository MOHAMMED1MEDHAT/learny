const nodemailer = require("nodemailer");
const handlebars = require("handlebars");
const fs = require("fs");
const path = require("path");

const sendEmail = (email, subject, payload, template) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    const source = fs.readFileSync(path.join(__dirname, template), "utf8");
    const compiledTemplate = handlebars.compile(source);

    const mailOptions = {
        from: process.env.EMAIL_USERNAME,
        to: email,
        subject: subject,
        html: compiledTemplate(payload),
    };
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            return res.status(500).json({ message: "Internal server error" });
        } else {
            // console.log("Email sent: " + info.response);
            return res.status(200).json({
                success: true,
            });
        }
    });
};
module.exports = sendEmail;
