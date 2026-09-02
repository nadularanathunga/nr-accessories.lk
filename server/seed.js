// Populates the database with categories & sample products matching the
// frontend's data/catalog.ts naming, so the API returns real, matching data.
// Run with: npm run seed
require("dotenv").config({ path: __dirname + "/.env" });
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
  {
    "title": "AirPods Pro (2nd Gen)",
    "brand": "Apple",
    "categorySlug": "earbuds",
    "price": 75000,
    "discountPrice": 72000,
    "stockQuantity": 15,
    "imageURL": "/images/apple_earbuds.jpg"
  },
  {
    "title": "Apple Watch Ultra 2",
    "brand": "Apple",
    "categorySlug": "smart-watches",
    "price": 250000,
    "discountPrice": 245000,
    "stockQuantity": 5,
    "imageURL": "/images/smart_watch_1788295968200.jpg"
  },
  {
    "title": "20W USB-C Power Adapter",
    "brand": "Apple",
    "categorySlug": "chargers",
    "price": 8500,
    "discountPrice": null,
    "stockQuantity": 50,
    "imageURL": "/images/apple_charger.jpg"
  },
  {
    "title": "Galaxy Watch 6 Classic",
    "brand": "Samsung",
    "categorySlug": "smart-watches",
    "price": 95000,
    "discountPrice": 88000,
    "stockQuantity": 12,
    "imageURL": "/images/smart_watch_1788295968200.jpg"
  },
  {
    "title": "45W Super Fast Wall Charger",
    "brand": "Samsung",
    "categorySlug": "chargers",
    "price": 7200,
    "discountPrice": 6500,
    "stockQuantity": 30,
    "imageURL": "/images/samsung_charger.jpg"
  },
  {
    "title": "Galaxy S24 Ultra Silicone Case",
    "brand": "Samsung",
    "categorySlug": "phone-cases",
    "price": 8500,
    "discountPrice": 7200,
    "stockQuantity": 20,
    "imageURL": "/images/case_s24_1788296520700.jpg"
  },
  {
    "title": "MagSafe Clear Case — iPhone 15 Pro",
    "brand": "Spigen",
    "categorySlug": "phone-cases",
    "price": 6500,
    "discountPrice": 4290,
    "stockQuantity": 40,
    "imageURL": "/images/case_iphone15_1788296502269.jpg"
  },
  {
    "title": "GLAStR EZ Fit Screen Protector",
    "brand": "Spigen",
    "categorySlug": "screen-protectors",
    "price": 4500,
    "discountPrice": null,
    "stockQuantity": 45,
    "imageURL": "/images/sp_iphone15_1788296550758.jpg"
  },
  {
    "title": "OneTap Dashboard Car Mount",
    "brand": "Spigen",
    "categorySlug": "car-accessories",
    "price": 8200,
    "discountPrice": 7500,
    "stockQuantity": 18,
    "imageURL": "/images/car_accessory_1788295978780.jpg"
  },
  {
    "title": "737 Power Bank (PowerCore 24K)",
    "brand": "Anker",
    "categorySlug": "power-banks",
    "price": 45000,
    "discountPrice": 42000,
    "stockQuantity": 10,
    "imageURL": "/images/power_bank_1788295956098.jpg"
  },
  {
    "title": "735 Charger (Nano II 65W)",
    "brand": "Anker",
    "categorySlug": "chargers",
    "price": 14500,
    "discountPrice": 13500,
    "stockQuantity": 25,
    "imageURL": "/images/apple_charger.jpg"
  },
  {
    "title": "PowerLine III USB-C Cable",
    "brand": "Anker",
    "categorySlug": "cables",
    "price": 3500,
    "discountPrice": null,
    "stockQuantity": 60,
    "imageURL": "/images/cable_1788296039568.jpg"
  },
  {
    "title": "Tour Pro 2 True Wireless",
    "brand": "JBL",
    "categorySlug": "earbuds",
    "price": 65000,
    "discountPrice": 58000,
    "stockQuantity": 12,
    "imageURL": "/images/jbl_earbuds.jpg"
  },
  {
    "title": "Endurance Peak 3 Sports",
    "brand": "JBL",
    "categorySlug": "earbuds",
    "price": 35000,
    "discountPrice": 32000,
    "stockQuantity": 20,
    "imageURL": "/images/jbl_earbuds.jpg"
  },
  {
    "title": "Wave Buds In-Ear",
    "brand": "JBL",
    "categorySlug": "earbuds",
    "price": 12500,
    "discountPrice": null,
    "stockQuantity": 40,
    "imageURL": "/images/jbl_earbuds.jpg"
  },
  {
    "title": "100W USB-C to USB-C Braided Cable",
    "brand": "Baseus",
    "categorySlug": "cables",
    "price": 2800,
    "discountPrice": 2200,
    "stockQuantity": 80,
    "imageURL": "/images/cable_1788296039568.jpg"
  },
  {
    "title": "Magnetic Air Vent Mount",
    "brand": "Baseus",
    "categorySlug": "car-accessories",
    "price": 2500,
    "discountPrice": 2200,
    "stockQuantity": 40,
    "imageURL": "/images/car_accessory_1788295978780.jpg"
  },
  {
    "title": "20000mAh 22.5W Power Bank",
    "brand": "Baseus",
    "categorySlug": "power-banks",
    "price": 9750,
    "discountPrice": 8500,
    "stockQuantity": 20,
    "imageURL": "/images/power_bank_1788295956098.jpg"
  },
  {
    "title": "100W Desktop Charging Station",
    "brand": "Ugreen",
    "categorySlug": "chargers",
    "price": 14500,
    "discountPrice": 12000,
    "stockQuantity": 15,
    "imageURL": "/images/charging_station.jpg"
  },
  {
    "title": "30000mAh Laptop Power Bank",
    "brand": "Ugreen",
    "categorySlug": "power-banks",
    "price": 18500,
    "discountPrice": 16000,
    "stockQuantity": 10,
    "imageURL": "/images/power_bank_1788295956098.jpg"
  },
  {
    "title": "USB-C Hub 7-in-1 Adapter",
    "brand": "Ugreen",
    "categorySlug": "cables",
    "price": 8500,
    "discountPrice": null,
    "stockQuantity": 25,
    "imageURL": "/images/cable_1788296039568.jpg"
  },
  {
    "title": "24-in-1 Precision Screwdriver Set",
    "brand": "Xiaomi",
    "categorySlug": "spare-parts",
    "price": 3500,
    "discountPrice": 3000,
    "stockQuantity": 45,
    "imageURL": "/images/spare_parts_1788296025882.jpg"
  },
  {
    "title": "Redmi Buds 5 Pro",
    "brand": "Xiaomi",
    "categorySlug": "earbuds",
    "price": 18500,
    "discountPrice": 16500,
    "stockQuantity": 30,
    "imageURL": "/images/jbl_earbuds.jpg"
  },
  {
    "title": "10000mAh Pocket Power Bank Pro",
    "brand": "Xiaomi",
    "categorySlug": "power-banks",
    "price": 6500,
    "discountPrice": null,
    "stockQuantity": 50,
    "imageURL": "/images/power_bank_1788295956098.jpg"
  },
  {
    "title": "Fenix 7X Sapphire Solar",
    "brand": "Garmin",
    "categorySlug": "smart-watches",
    "price": 295000,
    "discountPrice": 285000,
    "stockQuantity": 3,
    "imageURL": "/images/smart_watch_1788295968200.jpg"
  },
  {
    "title": "Forerunner 265 Music",
    "brand": "Garmin",
    "categorySlug": "smart-watches",
    "price": 155000,
    "discountPrice": 148000,
    "stockQuantity": 8,
    "imageURL": "/images/smart_watch_1788295968200.jpg"
  },
  {
    "title": "Venu 3S AMOLED GPS",
    "brand": "Garmin",
    "categorySlug": "smart-watches",
    "price": 125000,
    "discountPrice": null,
    "stockQuantity": 10,
    "imageURL": "/images/smart_watch_1788295968200.jpg"
  },
  {
    "title": "Finger Sleeves for Mobile Gaming",
    "brand": "Razer",
    "categorySlug": "gaming",
    "price": 2500,
    "discountPrice": null,
    "stockQuantity": 100,
    "imageURL": "/images/gaming_gear_1788295990918.jpg"
  },
  {
    "title": "Phone Cooler Chroma",
    "brand": "Razer",
    "categorySlug": "gaming",
    "price": 18500,
    "discountPrice": 16500,
    "stockQuantity": 15,
    "imageURL": "/images/gaming_gear_1788295990918.jpg"
  },
  {
    "title": "Kishi V2 Mobile Controller",
    "brand": "Razer",
    "categorySlug": "gaming",
    "price": 32000,
    "discountPrice": 29500,
    "stockQuantity": 12,
    "imageURL": "/images/gaming_gear_1788295990918.jpg"
  }
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
    imageURL: p.imageURL,
    image: p.imageURL, // Backup for Frontend to choose either image/imageURL
  }));

  await Product.insertMany(productsToInsert);

  console.log(`Seeded ${createdCategories.length} categories and ${productsToInsert.length} products successfully.`);
  await mongoose.disconnect();
}

seed().catch(err => {
  console.error("Seeding failed:", err);
  process.exit(1);
});