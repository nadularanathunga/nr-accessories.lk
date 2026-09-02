export type Product = {
  id: string
  name: string
  brand: string
  price: string
  oldPrice?: string
  discount?: string
  rating: number
  reviews: number
  image: string
}

export type Category = {
  slug: string
  name: string
  count: number
  icon: string
}

export const images = {
  hero: 'https://cdn.magicpatterns.com/patterns/generated-images/dc5de3b6-e979-4627-addb-6288da8efbc7.jpg',
  charger: 'https://cdn.magicpatterns.com/patterns/generated-images/e031cbf2-c78b-493b-9697-90add0f50ada.jpg',
  earbuds: 'https://cdn.magicpatterns.com/patterns/generated-images/d4373572-0672-4285-b71d-8c52941d5571.jpg',
  case: 'https://cdn.magicpatterns.com/patterns/generated-images/8c88a018-88c8-4e70-854a-5eefdb297846.jpg',
  promoAudio: 'https://cdn.magicpatterns.com/patterns/generated-images/e0a60ebd-0cf1-4c67-9925-7885f6d23509.jpg',
}

export const categories: Category[] = [
  { slug: 'phone-cases', name: 'Cases & Covers', count: 412, icon: 'Smartphone' },
  { slug: 'screen-protectors', name: 'Screen Protectors', count: 168, icon: 'ShieldCheck' },
  { slug: 'chargers', name: 'Chargers & Adapters', count: 233, icon: 'Plug' },
  { slug: 'cables', name: 'Cables & Connectors', count: 190, icon: 'Cable' },
  { slug: 'power-banks', name: 'Power Banks', count: 74, icon: 'BatteryCharging' },
  { slug: 'earbuds', name: 'Earbuds & Audio', count: 296, icon: 'Headphones' },
  { slug: 'smart-watches', name: 'Watches & Straps', count: 145, icon: 'Watch' },
  { slug: 'car-accessories', name: 'Car Accessories', count: 88, icon: 'Car' },
  { slug: 'gaming', name: 'Gaming Gear', count: 61, icon: 'Gamepad2' },
  { slug: 'spare-parts', name: 'Parts & Tools', count: 129, icon: 'Wrench' },
]

export const navLinks: { label: string; to: string }[] = [
  { label: 'Deals', to: '/shop' },
  { label: 'Cases', to: '/shop?c=phone-cases' },
  { label: 'Audio', to: '/shop?c=earbuds' },
  { label: 'Charging', to: '/shop?c=chargers' },
  { label: 'Wearables', to: '/shop?c=smart-watches' },
  { label: 'Brands', to: '/shop' },
  { label: 'Support', to: '/shop' },
]

export const flashDeals: Product[] = [
  { id: 'fd-1', name: 'MagSafe Clear Case — iPhone 15 Pro', brand: 'Spigen', price: 'Rs 4,290', oldPrice: 'Rs 6,500', discount: '-34%', rating: 4.7, reviews: 132, image: images.case },
  { id: 'fd-2', name: '65W GaN Dual-Port Fast Charger', brand: 'Anker', price: 'Rs 8,950', oldPrice: 'Rs 11,900', discount: '-25%', rating: 4.6, reviews: 48, image: images.charger },
  { id: 'fd-3', name: 'ANC Wireless Earbuds Pro 4', brand: 'Soundcore', price: 'Rs 12,400', oldPrice: 'Rs 15,900', discount: '-22%', rating: 4.8, reviews: 214, image: images.earbuds },
  { id: 'fd-4', name: '20000mAh Power Bank 22.5W', brand: 'Baseus', price: 'Rs 9,750', oldPrice: 'Rs 12,250', discount: '-20%', rating: 4.5, reviews: 76, image: images.charger },
  { id: 'fd-5', name: 'Braided USB-C to Lightning 2m', brand: 'Ugreen', price: 'Rs 2,650', oldPrice: 'Rs 3,400', discount: '-22%', rating: 4.4, reviews: 91, image: images.charger },
]

export const bestSellers: Product[] = [
  { id: 'bs-1', name: 'Tempered Glass 9H — Galaxy S24', brand: 'Nillkin', price: 'Rs 1,890', rating: 4.6, reviews: 302, image: images.case },
  { id: 'bs-2', name: 'Silicone Case with Camera Guard', brand: 'NR Basics', price: 'Rs 2,150', rating: 4.3, reviews: 118, image: images.case },
  { id: 'bs-3', name: 'True Wireless Earbuds Lite', brand: 'Oraimo', price: 'Rs 5,600', rating: 4.2, reviews: 64, image: images.earbuds },
  { id: 'bs-4', name: '45W USB-C Wall Adapter', brand: 'Samsung', price: 'Rs 7,200', rating: 4.7, reviews: 155, image: images.charger },
  { id: 'bs-5', name: 'Watch Strap 22mm Fluoro', brand: 'Spigen', price: 'Rs 2,980', rating: 4.4, reviews: 39, image: images.case },
  { id: 'bs-6', name: 'Wireless Charging Pad 15W', brand: 'Anker', price: 'Rs 6,100', rating: 4.5, reviews: 87, image: images.charger },
  { id: 'bs-7', name: 'Type-C Earphones Wired', brand: 'Oraimo', price: 'Rs 1,750', rating: 4.1, reviews: 210, image: images.earbuds },
  { id: 'bs-8', name: 'Gaming Trigger L1/R1', brand: 'Memo', price: 'Rs 1,290', rating: 4.0, reviews: 58, image: images.case },
  { id: 'bs-9', name: 'Magnetic Car Vent Mount', brand: 'Baseus', price: 'Rs 3,600', rating: 4.6, reviews: 143, image: images.charger },
  { id: 'bs-10', name: 'ANC Over-Ear Headphones', brand: 'Soundcore', price: 'Rs 18,900', rating: 4.8, reviews: 71, image: images.earbuds },
]

export const brands: string[] = [
  'Anker',
  'Spigen',
  'Baseus',
  'Ugreen',
  'Samsung',
  'Nillkin',
  'Soundcore',
  'Oraimo',
]

export const cartLines: (Product & { qty: number })[] = [
  { ...flashDeals[0], qty: 1 },
  { ...flashDeals[1], qty: 1 },
  { ...flashDeals[4], qty: 2 },
]
