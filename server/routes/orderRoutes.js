const express = require("express");
const router = express.Router();
const { requireAuth } = require("../middleware/auth");
const { createOrder, getMyOrders, getOrderById } = require("../controllers/orderController");

router.use(requireAuth); // every order route requires a logged-in user

router.post("/", createOrder);
router.get("/", getMyOrders);
router.get("/:id", getOrderById);

module.exports = router;
