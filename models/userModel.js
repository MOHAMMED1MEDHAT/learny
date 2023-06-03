const mongoose = require("mongoose");
const valid = require("validator");
const jwt = require("jsonwebtoken");
const config = require("config");
const jwtSCRT = config.get("env_var.jwtScreteKey");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        minLength: 3,
        maxLength: 50,
        required: true,
    },
    email: {
        type: String,
        trim: true,
        validators: {
            validator(val) {
                return valid.isEmail(val);
            },
        },
        required: true,
    },
    password: {
        type: String,
        trim: true,
        minLength: 5,
        required: true,
    },
    phone: {
        type: String,
        trim: true,
        required: true,
    },
    imageUrl: {
        type: String,
        trim: true,
        default: "ImageUrl",
        required: true,
    },
    address: {
        type: String,
        trim: true,
        required: true,
    },
    dateOfBirth: {
        type: String,
        trim: true,
        default: "2002-04-24",
        required: true,
    },
    gender: {
        type: String,
        trim: true,
        required: true,
    },
    subscription: {
        type: String,
        trim: true,
        default: "FREE",
        required: true,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
});

userSchema.virtual("id").get(function () {
    return this._id.toHexString();
});

userSchema.set("toJSON", {
    virtuals: true,
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
