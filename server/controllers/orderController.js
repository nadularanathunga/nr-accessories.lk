const Order = require("../models/Order");
const Cart = require("../models/Cart");

// POST /api/orders  — creates an order from the user's current cart
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

    // Clear the cart after order is placed
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
