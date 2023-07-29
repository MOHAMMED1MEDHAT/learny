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
            validate: {
                validator: function (val) {
                    return valid.isEmail(val);
                },
                message: "Invalid email",
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
        subscriptionStartDate: {
            type: Date,
        },
        subscriptionPeriod: {
            type: String,
            trim: true,
        },
        isAdmin: {
            type: Boolean,
            default: false,
        },
        sockets: [String],
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

userSchema.virtual("id").get(function () {
    return this._id.toHexString();
});

// userSchema.pre(/^find/,function(next){
//     if(this.IsSubsriptionExpired)
//     next()
// })

userSchema.methods.IsSubsriptionExpired = function () {
    if (this.subscriptionPeriod.toUpperCase() === "MONTH") {
        const subscriptionEndDate = new Date(this.subscriptionStartDate);
        subscriptionEndDate.setMonth(subscriptionEndDate.getMonth() + 1);
        if (subscriptionEndDate < new Date()) {
            return true;
        }
    } else if (this.subscriptionPeriod.toUpperCase() === "YEAR") {
        const subscriptionEndDate = new Date(this.subscriptionStartDate);
        subscriptionEndDate.setFullYear(subscriptionEndDate.getFullYear() + 1);
        if (subscriptionEndDate < new Date()) {
            return true;
        }
    }
    return false;
};

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
