const validator = require("../middlewares/complaintsValidatorMw");
const Complaint = require("../controllers/complaintController");

const router = require("express").Router();

//get all compliants
router
    .route("/")
    .get(Complaint.getAllComplaints)
    .post(validator, Complaint.addComplaint);

router
    .route("/:id")
    .get(Complaint.getComplaintByComplaintId)
    .put(validator, Complaint.updateComplaintByComplaintId)
    .delete(Complaint.deleteComplaintByComplaintId);

router.get("/user", Complaint.getAllComplaintsByUserId);

// router.get("/:id", Complaint.getComplaintByComplaintId);

// //update complaint by complaint id
// router.put("/:id", validator, Complaint.updateComplaintByComplaintId);

// router.delete("/:id", Complaint.deleteComplaintByComplaintId);

module.exports = router;
