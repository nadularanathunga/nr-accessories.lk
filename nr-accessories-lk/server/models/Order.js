const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  quantity: { type: Number, required: true },
  unitPrice: { type: Number, required: true },
});

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [orderItemSchema],
  deliveryAddress: {
    addressLine1: String,
    addressLine2: String,
    city: String,
    district: String,
  },
  deliveryMethod: { type: String, enum: ["home_delivery", "store_pickup"], default: "home_delivery" },
  paymentMethod: { type: String, enum: ["card", "koko", "bank_transfer", "cash_on_delivery"], required: true },
  paymentStatus: { type: String, enum: ["pending", "paid", "failed"], default: "pending" },
  promoCode: { type: String },
  discountAmount: { type: Number, default: 0 },
  totalAmount: { type: Number, required: true },
  orderStatus: { type: String, enum: ["pending", "shipped", "delivered", "cancelled"], default: "pending" },
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);
