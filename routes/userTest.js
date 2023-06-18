const validator = require("../middlewares/userTestValidatorMw");
const Track = require("../controllers/trackController");

const router = require("express").Router();

//get all userTests by userId
router.get("/", Track.getAllTracks);

//get  all userTests by test id
router.get("/:testId", Track.getTrackById);

//get  userTests by userTest id
router.get("/:id", Track.getTrackById);

//add userTest
router.post("/", validator, Track.addTrack);

//update userTest by userTest id
router.put("/:id", validator, Track.updateTrackById);

//delete userTest by userTest id
router.delete("/:id", Track.deleteTrackByTrackId);

module.exports = router;
