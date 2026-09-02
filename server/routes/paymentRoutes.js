const express = require("express");
const router = express.Router();
const { requireAuth } = require("../middleware/auth");
const { createCheckoutSession, confirmPayment } = require("../controllers/paymentController");

router.use(requireAuth);

router.post("/create-checkout-session", createCheckoutSession);
router.post("/confirm", confirmPayment);

module.exports = router;
