const express = require("express");
const router = express.Router();
const { requireAuth } = require("../middleware/auth");
const { createCheckoutSession, confirmPayment } = require("../controllers/paymentController");

// Require auth for creating payment sessions
router.post("/create-checkout-session", requireAuth, createCheckoutSession);

// Allow confirming payment with orderId (can be called by frontend callback or redirect)
router.post("/confirm", confirmPayment);

module.exports = router;
