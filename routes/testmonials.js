const validator = require("../middlewares/testmonialsValidatorMw");
const Testmonial = require("../controllers/testmonialController");

const router = require("express").Router();

//get all testmonials
router.get("/", Testmonial.getAllTestmonials);

router.get("/:id", Testmonial.getTestmonialById);

router.post("/", validator, Testmonial.addTestmonials);

//update testmonial by testmonial id
router.put("/:id", validator, Testmonial.updateTestmonialById);

router.delete("/:id", Testmonial.deleteTestmonialById);

module.exports = router;
