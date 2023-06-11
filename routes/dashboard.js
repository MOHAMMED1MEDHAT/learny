const Dashboard = require("../controllers/dashboardController");

const router = require("express").Router();

//get all courses
router.get("/numOfusers", Dashboard.getNumOfUser);

router.get("/levelsOfUsers", Dashboard.getNumOfUserForEachSubscriptionLevel);

router.get("/tracksSubscripers", Dashboard.getAllTracksSubscripersNum);

router.get("/trackEachSubscripers", Dashboard.getEachTrackSubscripersNum);

router.get("/usersSubsForEachMonth", Dashboard.getEachMonthUsersSubs);

router.get("/totalNums", Dashboard.getTotalEntitiesNums);

module.exports = router;
