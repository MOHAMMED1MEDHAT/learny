const mongoose = require("mongoose");
const valid = require("validator");
const jwt = require("jsonwebtoken");
const config = require("config");
const jwtSCRT = config.get("env_var.jwtScreteKey");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            minLength: 3,
            maxLength: 50,
            required: [true, "A user must have a name"],
        },
        email: {
            type: String,
            trim: true,
            validators: {
                validator(val) {
                    return valid.isEmail(val);
                },
            },
            required: [true, "A user must have a email"],
        },
        password: {
            type: String,
            trim: true,
            minLength: 5,
            required: [true, "A user must have a password"],
        },
        phone: {
            type: String,
            trim: true,
            required: [true, "A user must have a phone"],
        },
        imageUrl: {
            type: String,
            trim: true,
            default: "ImageUrl",
            required: [true, "A user must have a imageUrl"],
        },
        address: {
            type: String,
            trim: true,
            required: [true, "A user must have a address"],
        },
        dateOfBirth: {
            type: String,
            trim: true,
            default: "2002-04-24",
            required: [true, "A user must have a dateOfBirth"],
        },
        gender: {
            type: String,
            trim: true,
            required: [true, "A user must have a gender"],
        },
        subscription: {
            type: String,
            trim: true,
            default: "FREE",
            required: [true, "A user must have a subscription"],
        },
        isAdmin: {
            type: Boolean,
            default: false,
        },
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

userSchema.virtual("id").get(function () {
    return this._id.toHexString();
});

userSchema.method("getAuthToken", (id, isAdmin) => {
    const token = jwt.sign(
        {
            userId: id,
            isAdmin: isAdmin,
        },
        jwtSCRT,
        {
            expiresIn: "365d",
        }
    ); //expiration option
    //test--------------------------
    // console.log(id,isAdmin);
    //-------------------------
    return token;
});
module.exports = mongoose.model("user", userSchema);
