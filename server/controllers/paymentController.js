const Order = require("../models/Order");
const crypto = require("crypto");

// Using user-provided Merchant credentials for PayHere
const MERCHANT_ID = "1238362";
const MERCHANT_SECRET = "MzEwODg5Mjc0NDI3Mjg2MjU4NDUwMTc4NTI5NDQ2ODg1NTI5OQ==";

async function createCheckoutSession(req, res) {
  try {
    const { orderId } = req.body;
    
    // Find the order
    const order = await Order.findById(orderId).populate("items.product");
    
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    
    if (order.user.toString() !== req.userId) {
      return res.status(403).json({ message: "Not authorized" });
    }
    
    if (order.paymentStatus === 'paid') {
      return res.status(400).json({ message: "Order is already paid" });
    }

    let amount = 0;
    order.items.forEach(item => {
      amount += (item.unitPrice * item.quantity);
    });

    if (order.deliveryMethod === 'cash_on_delivery') {
       amount += 350;
    }

    // Format amount to 2 decimal places as required by PayHere
    const amountFormatted = amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2, useGrouping: false });
    const currency = 'LKR';

    // Generate MD5 Hash
    const hashedSecret = crypto.createHash('md5').update(MERCHANT_SECRET).digest('hex').toUpperCase();
    const hashString = MERCHANT_ID + orderId + amountFormatted + currency + hashedSecret;
    const hash = crypto.createHash('md5').update(hashString).digest('hex').toUpperCase();

    // Frontend needs these details to initiate PayHere
    res.json({ 
      hash, 
      merchant_id: MERCHANT_ID,
      order_id: orderId,
      items: order.items.map(i => i.product.title).join(", "),
      amount: amountFormatted,
      currency: currency,
      first_name: req.user ? req.user.name : "Customer",
      last_name: "",
      email: req.user ? req.user.email : "customer@example.com",
      phone: "0771234567", // Can be dynamic if you have a phone field
      address: order.deliveryAddress ? order.deliveryAddress.addressLine1 : "No Address",
      city: order.deliveryAddress ? order.deliveryAddress.city : "Colombo",
      country: "Sri Lanka"
    });
  } catch (err) {
    res.status(500).json({ message: err.message || "Failed to create checkout session" });
  }
}

async function confirmPayment(req, res) {
  try {
    const { orderId } = req.body;
    
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.paymentStatus = 'paid';
    await order.save();

    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ message: err.message || "Failed to confirm payment" });
  }
}

module.exports = { createCheckoutSession, confirmPayment };
