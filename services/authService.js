const User = require("../models/userModel");
const Token = require("../models/tokenModel");
const sendEmail = require("../util/email/sendMail");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const bcryptSalt = process.env.BCRYPT_SALT;
const clientURL = process.env.CLIENT_URL;

const requestPasswordReset = async (email) => {
    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "User does not exist" });
        }
        let token = await Token.findOne({ userId: user._id });
        if (token) await token.deleteOne();
        let resetToken = crypto.randomBytes(32).toString("hex");
        const hash = await bcrypt.hash(resetToken, Number(bcryptSalt));

        await new Token({
            userId: user._id,
            token: hash,
            createdAt: Date.now(),
        }).save();

        const link = `${clientURL}/passwordReset?token=${resetToken}&id=${user._id}`;
        // console.log(user.email);
        await sendEmail(
            user.email,
            "Password Reset Request",
            { name: user.name, link: link },
            "./templates/requestResetPassword.handlebars"
        );
        return link;
    } catch (err) {
        console.log(err);
    }
};

const resetPassword = async (userId, token, password) => {
    try {
        let passwordResetToken = await Token.findOne({ userId });
        if (!passwordResetToken) {
            return res
                .status(400)
                .json({ message: "Invalid or expired password reset token" });
        }
        const isValid = await bcrypt.compare(token, passwordResetToken.token);
        if (!isValid) {
            throw new Error("Invalid or expired password reset token");
        }
        const hash = await bcrypt.hash(password, Number(bcryptSalt));
        await User.updateOne(
            { _id: userId },
            { $set: { password: hash } },
            { new: true }
        );
        const user = await User.findById({ _id: userId });
        sendEmail(
            user.email,
            "Password Reset Successfully",
            {
                name: user.name,
            },
            "./templates/resetPassword.handlebars"
        );
        await passwordResetToken.deleteOne();
        return true;
    } catch (err) {
        console.log(err);
    }
};

module.exports = {
    resetPassword,
    requestPasswordReset,
};
