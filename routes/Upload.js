require("dotenv").config();

const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");
const errorHandlerMw = require("../middlewares/errorHandlerMw");

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const router = require("express").Router();

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "E-learnig",
    },
});

const upload = multer({ storage: storage });

router.post("/image", upload.single("image"), async (req, res) => {
    try {
        return res.json({ imageLink: req.file.path });
    } catch (err) {
        errorHandlerMw(err);
    }
});

module.exports = router;
