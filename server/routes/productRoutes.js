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

// Public Routes (ඕනෑම අයෙකුට බලන්න පුළුවන්)
router.get("/", getProducts);
router.get("/:id", getProductById);

// Protected Admin Routes (Admin ට පමණක් සකස් කළ හැකි)
router.post("/", requireAuth, requireAdmin, createProduct);
router.put("/:id", requireAuth, requireAdmin, updateProduct);
router.delete("/:id", requireAuth, requireAdmin, deleteProduct);

module.exports = router;