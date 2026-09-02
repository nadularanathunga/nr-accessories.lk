import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchCategories, fetchProducts } from '../data/api'
import type { Category as CatalogCategory, Product as CatalogProduct } from '../data/catalog'
import * as LucideIcons from 'lucide-react'

function CategoryIcon({ iconName }: { iconName: string }) {
  const IconComponent = (LucideIcons as any)[iconName] || LucideIcons.Smartphone
  return <IconComponent className="w-6 h-6 text-primary" />
}

export function Home() {
  const [categories, setCategories] = useState<CatalogCategory[]>([])
  const [featuredProducts, setFeaturedProducts] = useState<CatalogProduct[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadHomeData() {
      try {
        setLoading(true)
        const [cats, prods] = await Promise.all([
          fetchCategories(),
          fetchProducts()
        ])
        setCategories(cats)
        setFeaturedProducts(prods.slice(0, 8))
      } catch (err) {
        console.error('Home page data loading error:', err)
      } finally {
        setLoading(false)
      }
    }

    loadHomeData()
  }, [])

  return (
    <div className="space-y-12 pb-8">
      {/* Hero Banner Section */}
      <section className="relative rounded-2xl overflow-hidden mx-4 my-6 bg-neutral-900 min-h-[380px] flex items-center">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=1200"
            alt="Hero Banner Tech"
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
        </div>

        <div className="relative z-10 max-w-xl space-y-4 p-8 md:p-12 text-white">
          <span className="inline-block bg-primary/20 text-primary border border-primary/30 px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase">
            New Arrivals
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight">
            Upgrade Your Tech Accessories
          </h1>
          <p className="text-neutral-300 text-sm md:text-base">
            Discover premium cases, fast chargers, audio devices, and protection for all your gadgets.
          </p>
          <div className="pt-2">
            <Link
              to="/shop"
              className="inline-flex items-center justify-center bg-white text-black font-semibold px-6 py-3 rounded-lg hover:bg-neutral-200 transition-colors shadow-lg"
            >
              Shop Collection
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl md:text-2xl font-bold tracking-tight">Shop by Category</h2>
          <Link to="/shop" className="text-sm font-semibold text-primary hover:underline">
            View All
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-24 bg-neutral-100 animate-pulse rounded-xl" />
            ))}
          </div>
        ) : categories.length === 0 ? (
          <p className="text-neutral-500 text-sm">No categories available.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                to={`/shop?c=${cat.slug}`}
                className="flex flex-col items-center justify-center p-4 rounded-xl border border-border bg-card hover:border-primary hover:shadow-md transition-all group"
              >
                <div className="p-3 rounded-full bg-secondary mb-3 group-hover:scale-110 transition-transform">
                  <CategoryIcon iconName={cat.icon} />
                </div>
                <span className="font-medium text-sm text-center">{cat.name}</span>
                {cat.count > 0 && (
                  <span className="text-xs text-neutral-400 mt-1">{cat.count} items</span>
                )}
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Brands Section */}
      <section className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl md:text-2xl font-bold tracking-tight">Shop by Brand</h2>
          <Link to="/shop" className="text-sm font-semibold text-primary hover:underline">
            View All
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {['Apple', 'Samsung', 'Spigen', 'Anker', 'JBL', 'Baseus', 'Ugreen', 'Xiaomi', 'Garmin', 'Razer'].map((brand) => (
            <Link
              key={brand}
              to={`/shop?brand=${brand}`}
              className="flex items-center justify-center p-6 rounded-xl border border-border bg-card hover:border-primary hover:shadow-md transition-all group"
            >
              <span className="font-display font-bold text-lg text-ink-soft group-hover:text-primary transition-colors">{brand}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl md:text-2xl font-bold tracking-tight">Featured Products</h2>
          <Link to="/shop" className="text-sm font-semibold text-primary hover:underline">
            Browse All
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-64 bg-neutral-100 animate-pulse rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <Link
                key={product.id}
                to={`/product/${product.id}`}
                className="group border border-border rounded-xl p-4 bg-card hover:shadow-md transition-all"
              >
                <div className="aspect-square rounded-lg overflow-hidden bg-neutral-100 mb-3">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <p className="text-xs text-neutral-400 font-medium uppercase">{product.brand}</p>
                <h3 className="font-semibold text-sm line-clamp-1 group-hover:text-primary transition-colors">
                  {product.name}
                </h3>
                <div className="flex items-center gap-2 mt-2">
                  <span className="font-bold text-sm">{product.price}</span>
                  {product.oldPrice && (
                    <span className="text-xs text-neutral-400 line-through">
                      {product.oldPrice}
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}