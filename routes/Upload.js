require("dotenv").config();

const errorHandlerMw = require("../middlewares/errorHandlerMw");

const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const router = require("express").Router();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

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
        errorHandlerMw(req, res, err);
    }
});

module.exports = router;
