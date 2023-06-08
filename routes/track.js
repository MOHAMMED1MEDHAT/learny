const validator = require("../middlewares/trackValidatorMw");
const Track = require("../controllers/trackController");

const router = require("express").Router();

//get all tracks
router.get("/", Track.getAllTracks);

//get track by id
router.get("/:id", Track.getTrackById);

//add track
router.post("/", validator, Track.addTrack);

//update track by id
router.put("/:id", validator, Track.updateTrackById);

//update track courses
router.patch("/update/addCourses/:id", Track.addCoursesToTrack);

router.patch("/update/removeCourses/:id", Track.deleteCoursesFromTrack);

//subscripe to track by track id
router.patch("/subscripe/:id", Track.subscripeToTrackByTrackId);

//unsubscripe to track by track id
router.patch("/unsubscripe/:id", Track.unsubscripeToTrackById);

//delete track by id
router.delete("/:id", Track.deleteTrackByTrackId);

module.exports = router;
