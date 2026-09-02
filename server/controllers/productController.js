const Product = require("../models/Product");
const Category = require("../models/Category");

// @desc    Get all products (with optional Category & Brand filtering)
// @route   GET /api/products
const getProducts = async (req, res) => {
  try {
    const { category, brand } = req.query;
    let query = {};

    // 1. If a Category Slug is passed:
    if (category) {
      const categoryDoc = await Category.findOne({ slug: category });
      
      if (categoryDoc) {
        // Filter product by Category ObjectId
        query.category = categoryDoc._id;
      } else {
        // Send empty array if Category is not found
        return res.json({ products: [], total: 0 });
      }
    }

    // 2. If a Brand is passed:
    if (brand) {
      query.brand = { $regex: brand, $options: "i" };
    }

    // Find products and return with Category Details
    const products = await Product.find(query).populate("category", "name slug");
    res.json({ products, total: products.length });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Server Error fetching products" });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("category", "name slug");
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error fetching product" });
  }
};

const createProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(400).json({ message: "Invalid product data", error: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: "Invalid product data", error: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    await Product.deleteOne({ _id: req.params.id });
    res.json({ message: "Product removed" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct };