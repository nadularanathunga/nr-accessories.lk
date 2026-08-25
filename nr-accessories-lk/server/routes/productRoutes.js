const express = require("express");
const router = express.Router();
const {
  getProducts, getProductById, createProduct, updateProduct, deleteProduct,
} = require("../controllers/productController");

router.get("/", getProducts);
router.get("/:id", getProductById);
router.post("/", createProduct);      // TODO: protect with an admin-only middleware later
router.put("/:id", updateProduct);    // TODO: protect with an admin-only middleware later
router.delete("/:id", deleteProduct); // TODO: protect with an admin-only middleware later

module.exports = router;
