const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
  label: { type: String, default: "Home" },
  addressLine1: { type: String, required: true },
  addressLine2: { type: String },
  city: { type: String, required: true },
  district: { type: String, required: true },
  isDefault: { type: Boolean, default: false },
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  passwordHash: { type: String, required: true },
  phone: { type: String },
  addresses: [addressSchema],
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
