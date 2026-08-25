// Populates the database with the same categories & sample products used
// in the frontend's data/catalog.ts, so the API returns real, matching data.
// Run with: npm run seed
require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const Category = require("./models/Category");
const Product = require("./models/Product");

const categories = [
  { slug: "phone-cases", name: "Cases & Covers", icon: "Smartphone" },
  { slug: "screen-protectors", name: "Screen Protectors", icon: "ShieldCheck" },
  { slug: "chargers", name: "Chargers & Adapters", icon: "Plug" },
  { slug: "cables", name: "Cables & Connectors", icon: "Cable" },
  { slug: "power-banks", name: "Power Banks", icon: "BatteryCharging" },
  { slug: "earbuds", name: "Earbuds & Audio", icon: "Headphones" },
  { slug: "smart-watches", name: "Watches & Straps", icon: "Watch" },
  { slug: "car-accessories", name: "Car Accessories", icon: "Car" },
  { slug: "gaming", name: "Gaming Gear", icon: "Gamepad2" },
  { slug: "spare-parts", name: "Parts & Tools", icon: "Wrench" },
];

const sampleProducts = [
  { title: "MagSafe Clear Case — iPhone 15 Pro", brand: "Spigen", categorySlug: "phone-cases", price: 6500, discountPrice: 4290, stockQuantity: 40 },
  { title: "65W GaN Dual-Port Fast Charger", brand: "Anker", categorySlug: "chargers", price: 11900, discountPrice: 8950, stockQuantity: 12 },
  { title: "ANC Wireless Earbuds Pro 4", brand: "Soundcore", categorySlug: "earbuds", price: 15900, discountPrice: 12400, stockQuantity: 20 },
  { title: "20000mAh Power Bank 22.5W", brand: "Baseus", categorySlug: "power-banks", price: 12250, discountPrice: 9750, stockQuantity: 30 },
  { title: "Braided USB-C to Lightning 2m", brand: "Ugreen", categorySlug: "cables", price: 3400, discountPrice: 2650, stockQuantity: 60 },
  { title: "Tempered Glass 9H — Galaxy S24", brand: "Nillkin", categorySlug: "screen-protectors", price: 1890, stockQuantity: 100 },
  { title: "Magnetic Car Vent Mount", brand: "Baseus", categorySlug: "car-accessories", price: 3600, stockQuantity: 25 },
  { title: "45W USB-C Wall Adapter", brand: "Samsung", categorySlug: "chargers", price: 7200, stockQuantity: 18 },
];

async function seed() {
  await connectDB();

  await Category.deleteMany({});
  await Product.deleteMany({});

  const createdCategories = await Category.insertMany(categories);
  const categoryMap = Object.fromEntries(createdCategories.map(c => [c.slug, c._id]));

  const productsToInsert = sampleProducts.map(p => ({
    title: p.title,
    brand: p.brand,
    category: categoryMap[p.categorySlug],
    price: p.price,
    discountPrice: p.discountPrice,
    stockQuantity: p.stockQuantity,
  }));

  await Product.insertMany(productsToInsert);

  console.log(`Seeded ${createdCategories.length} categories and ${productsToInsert.length} products.`);
  await mongoose.disconnect();
}

seed().catch(err => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
