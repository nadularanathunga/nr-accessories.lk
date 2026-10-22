const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: "" },
  brand: { type: String, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
  price: { type: Number, required: true },
  discountPrice: { type: Number },
  stockQuantity: { type: Number, default: 0 },
  imageURL: { type: String },
  image: { type: String },
  avgRating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
}, { timestamps: true });

productSchema.pre("validate", function(next) {
  if (this.imageURL && !this.image) this.image = this.imageURL;
  if (this.image && !this.imageURL) this.imageURL = this.image;
  next();
});

module.exports = mongoose.model("Product", productSchema);
