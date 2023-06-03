const mongoose = require("mongoose");

const subscripersSchema = new mongoose.Schema({
    subscriperId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
    },
});

const linksSchema = new mongoose.Schema({
    link: {
        type: String,
        trim: true,
        required: true,
    },
    resource: {
        type: String,
        trim: true,
        default: "youtube",
    },
});

const courseSchema = new mongoose.Schema({
    courseName: {
        type: String,
        trim: true,
        required: true,
    },
    links: [linksSchema],
    imageUrl: {
        type: String,
        trim: true,
        default: "ImageUrl",
        required: true,
    },
    subscripers: [subscripersSchema],
});

courseSchema.virtual("id").get(function () {
    return this._id.toHexString();
});

courseSchema.set("toJSON", {
    virtuals: true,
});

module.exports = mongoose.model("course", courseSchema);

/*TODO:
1-think about population issues
*/
