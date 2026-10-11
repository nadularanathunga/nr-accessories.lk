const express = require("express");
const router = express.Router();
const { requireAuth, requireAdmin } = require("../middleware/auth");
const { 
  createOrder, 
  getMyOrders, 
  getOrderById, 
  getAllOrders, 
  updateOrderStatus, 
  getAdminStats 
} = require("../controllers/orderController");

router.use(requireAuth);

router.post("/", createOrder);
router.get("/my-orders", getMyOrders);
router.get("/detail/:id", getOrderById);

router.get("/admin/all", requireAdmin, getAllOrders);
router.get("/admin/stats", requireAdmin, getAdminStats);
router.put("/admin/:id/status", requireAdmin, updateOrderStatus);

router.get("/", getMyOrders);
router.get("/:id", getOrderById);

module.exports = router;
