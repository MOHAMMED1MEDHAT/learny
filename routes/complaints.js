const validator = require("../middlewares/complaintsValidatorMw");
const Complaint = require("../controllers/complaintController");

const router = require("express").Router();

//get all compliants
router.get("/", Complaint.getAllComplaints);

router.get("/user", Complaint.getAllComplaintsByUserId);

router.get("/:id", Complaint.getComplaintByComplaintId);

router.post("/", validator, Complaint.addComplaint);

//update complaint by complaint id
router.put("/:id", validator, Complaint.updateComplaintByComplaintId);

router.delete("/:id", Complaint.deleteComplaintByComplaintId);

module.exports = router;
