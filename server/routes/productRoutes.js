const express = require("express");
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const { requireAuth, requireAdmin } = require("../middleware/auth");

// Public Routes (Anyone can view)
router.get("/", getProducts);
router.get("/:id", getProductById);

// Protected Admin Routes (Only admins can modify)
router.post("/", requireAuth, requireAdmin, createProduct);
router.put("/:id", requireAuth, requireAdmin, updateProduct);
router.delete("/:id", requireAuth, requireAdmin, deleteProduct);

module.exports = router;