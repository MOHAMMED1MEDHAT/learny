const validator = require("./../middlewares/userCertificateMw");
const UserCertificate = require("./../controllers/userCertificateController.js");

const router = require("express").Router();

//get all userTests by userId
router.get("/", UserCertificate.getAllUserCertificatesByUserId);

//get  all userTests by test id
router.get("/:id", UserCertificate.getAllUserCertificateById);

router.post("/", validator, UserCertificate.addUserCertificate);

module.exports = router;
