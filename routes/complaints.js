const validator = require("../middlewares/complaintsValidatorMw");
const Complaint = require("../controllers/complaintController");

const router = require("express").Router();

router
    .route("/")
    //get all complaints
    .get(Complaint.getAllComplaints)
    //add complaint
    .post(validator, Complaint.addComplaint);

router.get("/user", Complaint.getAllComplaintsByUserId);

router
    .route("/:id")
    //get complaint by complaint id
    .get(Complaint.getComplaintByComplaintId)
    //update complaint by complaint id
    .put(validator, Complaint.updateComplaintByComplaintId)
    //delete complaint by complaint id
    .delete(Complaint.deleteComplaintByComplaintId);

module.exports = router;
