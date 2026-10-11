const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Product");

exports.createOrder = async (req, res) => {
  try {
    const { deliveryAddress, deliveryMethod, paymentMethod, promoCode, discountAmount = 0 } = req.body;

    const cart = await Cart.findOne({ user: req.userId }).populate("items.product");
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const items = cart.items.map(i => ({
      product: i.product._id,
      quantity: i.quantity,
      unitPrice: i.product.discountPrice || i.product.price,
    }));

    for (const item of cart.items) {
      if (item.product && item.product._id) {
        await Product.findByIdAndUpdate(item.product._id, {
          $inc: { stockQuantity: -item.quantity }
        });
      }
    }

    const subtotal = items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
    const totalAmount = Math.max(subtotal - discountAmount, 0);

    const order = await Order.create({
      user: req.userId,
      items,
      deliveryAddress,
      deliveryMethod,
      paymentMethod,
      promoCode,
      discountAmount,
      totalAmount,
    });

    cart.items = [];
    await cart.save();

    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.userId }).populate("items.product").sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.userId }).populate("items.product");
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email phone")
      .populate("items.product", "title price imageURL")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    order.orderStatus = status;
    await order.save();
    res.json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getAdminStats = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    const lowStockCount = await Product.countDocuments({ stockQuantity: { $lte: 5 } });
    const recentOrders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .limit(5);
    res.json({ totalProducts, totalOrders, lowStockCount, recentOrders });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
