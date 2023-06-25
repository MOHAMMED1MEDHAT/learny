const validator = require("../middlewares/plansValidatorMw");

const Plan = require("../controllers/planController");

const router = require("express").Router();

//get all plans
router.get("/", Plan.getAllPlans);

router.get("/:id", Plan.getPlanById);

router.get("/payment/paymob/:id", Plan.addPlan);

router.get("/payment/paymob/check/", Plan.addPlan);

router.post("/", validator, Plan.addPlan);

//update plan by plan id
router.put("/:id", validator, Plan.updatePlanById);

router.delete("/:id", Plan.deletePlan);

module.exports = router;
