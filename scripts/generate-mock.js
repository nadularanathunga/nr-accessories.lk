const fs = require('fs');
const seedContent = fs.readFileSync('server/seed.js', 'utf8');

// Extract the sampleProducts array string
const startIndex = seedContent.indexOf('const sampleProducts = [');
const endIndex = seedContent.indexOf('];', startIndex) + 1;
let sampleProductsStr = seedContent.slice(startIndex, endIndex);

// Replace expiring google image links with valid ones
sampleProductsStr = sampleProductsStr.replace(/"https:\/\/encrypted-tbn1\.gstatic\.com[^"]+"/g, '"https://m.media-amazon.com/images/I/61vD7BqO3ML._AC_SL1500_.jpg"');
sampleProductsStr = sampleProductsStr.replace(/"https:\/\/encrypted-tbn2\.gstatic\.com[^"]+"/g, '"https://m.media-amazon.com/images/I/61KxGvVpL-L._AC_SL1500_.jpg"');

const mockContent = `import type { ApiProduct, ApiCategory } from './api'

export const mockCategories: ApiCategory[] = [
  { _id: 'phone-cases', slug: "phone-cases", name: "Cases & Covers", icon: "Smartphone", count: 3 },
  { _id: 'screen-protectors', slug: "screen-protectors", name: "Screen Protectors", icon: "ShieldCheck", count: 3 },
  { _id: 'chargers', slug: "chargers", name: "Chargers & Adapters", icon: "Plug", count: 3 },
  { _id: 'cables', slug: "cables", name: "Cables & Connectors", icon: "Cable", count: 3 },
  { _id: 'power-banks', slug: "power-banks", name: "Power Banks", icon: "BatteryCharging", count: 2 },
  { _id: 'earbuds', slug: "earbuds", name: "Earbuds & Audio", icon: "Headphones", count: 4 },
  { _id: 'smart-watches', slug: "smart-watches", name: "Watches & Straps", icon: "Watch", count: 2 },
  { _id: 'car-accessories', slug: "car-accessories", name: "Car Accessories", icon: "Car", count: 2 },
  { _id: 'gaming', slug: "gaming", name: "Gaming Gear", icon: "Gamepad2", count: 2 },
  { _id: 'spare-parts', slug: "spare-parts", name: "Parts & Tools", icon: "Wrench", count: 2 },
]

${sampleProductsStr}

export const mockProducts: ApiProduct[] = sampleProducts.map((p, i) => ({
  _id: 'p' + i,
  title: p.title,
  brand: p.brand,
  category: { _id: p.categorySlug, slug: p.categorySlug, name: p.categorySlug },
  price: p.price,
  discountPrice: p.discountPrice,
  stockQuantity: p.stockQuantity,
  imageURL: p.imageURL,
  createdAt: "2024-01-01T00:00:00Z"
}))
`;

fs.writeFileSync('frontend/src/data/mock.ts', mockContent);
