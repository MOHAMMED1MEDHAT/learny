const validator = require("../middlewares/plansValidatorMw");

const Plan = require("../controllers/planController");

const router = require("express").Router();

//get all plans
//add plan
router.route("/").get(Plan.getAllPlans).post(validator, Plan.addPlan);

//get callback url for paymob
router.get("/payment/paymob/callback", Plan.postPaymentOps);

// subscripe to plan by plan id
router.get("/payment/paymob/:id", Plan.subscripeToPlan);

router
    .route("/")
    //get plan by plan id
    .get(Plan.getPlanById)
    //update plan by plan id
    .put(validator, Plan.updatePlanById)
    //delete plan by plan id
    .delete(Plan.deletePlan);

module.exports = router;
