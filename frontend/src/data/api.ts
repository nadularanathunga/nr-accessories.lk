// data/api.ts
// Talks to the nr-accessories.lk backend (server/) and adapts the responses
// into the same shapes the existing components already expect
// (see data/catalog.ts — Product, Category).
import { images, type Product as CatalogProduct, type Category as CatalogCategory } from './catalog'

// Change this if your backend runs on a different port/host.
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5001/api'

// ---------- Shapes returned by the backend ----------
export type ApiCategory = {
  _id: string
  name: string
  slug: string
  icon?: string
  count?: number
}

export type ApiProduct = {
  _id: string
  title: string
  brand: string
  description?: string   
  price: number
  discountPrice?: number
  stockQuantity: number
  imageURL?: string
  avgRating?: number
  reviewCount?: number
  category?: { _id: string; name: string; slug: string } | string
  createdAt?: string
}

// ---------- Small helpers ----------
function formatRs(amount: number): string {
  return `Rs ${amount.toLocaleString('en-LK')}`
}

// The seed data doesn't have real product photos yet — fall back to one of the
// existing placeholder images so ProductCard still renders something sensible.
function fallbackImage(): string {
  return images.case
}

async function handle<T>(res: Response): Promise<T> {
  let data: any = null
  try {
    data = await res.json()
  } catch {
    // no JSON body (e.g. 204) — leave data as null
  }
  if (!res.ok) {
    throw new Error(data?.message || `Request failed with status ${res.status}`)
  }
  return data as T
}

function authHeaders(): Record<string, string> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('sg_token') : null
  return token ? { Authorization: `Bearer ${token}` } : {}
}

// ---------- Adapters: backend shape -> existing component shape ----------
export function toCatalogProduct(p: ApiProduct): CatalogProduct {
  const hasDiscount = typeof p.discountPrice === 'number' && p.discountPrice < p.price
  const discountPct = hasDiscount
    ? Math.round(((p.price - (p.discountPrice as number)) / p.price) * 100)
    : undefined

  return {
    id: p._id,
    name: p.title,
    brand: p.brand,
    price: formatRs(hasDiscount ? (p.discountPrice as number) : p.price),
    oldPrice: hasDiscount ? formatRs(p.price) : undefined,
    discount: discountPct ? `-${discountPct}%` : undefined,
    rating: p.avgRating ?? 0,
    reviews: p.reviewCount ?? 0,
    image: p.imageURL || fallbackImage(),
  }
}

export function toCatalogCategory(c: ApiCategory): CatalogCategory {
  return {
    slug: c.slug,
    name: c.name,
    count: c.count ?? 0,
    icon: c.icon || 'Smartphone',
  }
}

// ---------- Products (raw, before adapting to catalog shape — used for filtering) ----------
export async function fetchRawProducts(params: Record<string, string> = {}): Promise<ApiProduct[]> {
  const qs = new URLSearchParams(params).toString()
  const res = await fetch(`${API_BASE}/products${qs ? '?' + qs : ''}`)
  const data = await handle<{ data: ApiProduct[] }>(res)
  return data.data || []
}

export async function fetchProducts(params: Record<string, string> = {}): Promise<CatalogProduct[]> {
  const raw = await fetchRawProducts(params)
  return raw.map(toCatalogProduct)
}

export async function fetchProductById(id: string): Promise<CatalogProduct> {
  const raw = await fetchRawProductById(id)
  return toCatalogProduct(raw)
}

// ---------- Categories ----------
export async function fetchRawCategories(): Promise<ApiCategory[]> {
  const res = await fetch(`${API_BASE}/categories`)
  const data = await handle<{ data: ApiCategory[] }>(res)
  return data.data || []
}

export async function fetchCategories(): Promise<CatalogCategory[]> {
  const raw = await fetchRawCategories()
  return raw.map(toCatalogCategory)
}

// ---------- Auth ----------
export type AuthUser = { id: string; name: string; email: string; role?: string }

export async function login(email: string, password: string): Promise<AuthUser> {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  const data = await handle<{ token: string; user: AuthUser }>(res)
  localStorage.setItem('sg_token', data.token)
  return data.user
}

export async function register(name: string, email: string, password: string, phone?: string): Promise<AuthUser> {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password, phone }),
  })
  const data = await handle<{ token: string; user: AuthUser }>(res)
  localStorage.setItem('sg_token', data.token)
  return data.user
}

export function logout() {
  localStorage.removeItem('sg_token')
}

export function isLoggedIn(): boolean {
  return typeof window !== 'undefined' && !!localStorage.getItem('sg_token')
}

// ---------- Cart (requires login) ----------
export type ApiCart = { 
  _id: string; 
  items: { 
    _id?: string;          
    product: ApiProduct; 
    quantity: number 
  }[] 
}

export async function fetchCart(): Promise<ApiCart> {
  const res = await fetch(`${API_BASE}/cart`, { headers: { ...authHeaders() } })
  return handle<ApiCart>(res)
}

export async function addToCart(productId: string, quantity = 1): Promise<ApiCart> {
  const res = await fetch(`${API_BASE}/cart/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify({ productId, quantity }),
  })
  return handle<ApiCart>(res)
}

export async function updateCartItem(productId: string, quantity: number): Promise<ApiCart> {
  const res = await fetch(`${API_BASE}/cart/update`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify({ productId, quantity }),
  })
  return handle<ApiCart>(res)
}

export async function removeCartItem(productId: string): Promise<ApiCart> {
  const res = await fetch(`${API_BASE}/cart/remove/${productId}`, {
    method: 'DELETE',
    headers: { ...authHeaders() },
  })
  return handle<ApiCart>(res)
}

// ---------- Orders (requires login) ----------
export async function placeOrder(payload: {
  deliveryAddress: { addressLine1: string; addressLine2?: string; city: string; district: string }
  deliveryMethod: 'home_delivery' | 'store_pickup'
  paymentMethod: 'card' | 'koko' | 'bank_transfer' | 'cash_on_delivery'
  promoCode?: string
  discountAmount?: number
}) {
  const res = await fetch(`${API_BASE}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(payload),
  })
  return handle<{ _id: string, [key: string]: any }>(res)
}

// ---------- Payments ----------
export async function createCheckoutSession(orderId: string): Promise<{ url: string; sessionId: string }> {
  const res = await fetch(`${API_BASE}/payment/create-checkout-session`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify({ orderId }),
  })
  return handle(res)
}

export async function confirmPayment(orderId: string, sessionId: string): Promise<{ success: boolean }> {
  const res = await fetch(`${API_BASE}/payment/confirm`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify({ orderId, sessionId }),
  })
  return handle(res)
}
export async function fetchRawProductById(id: string): Promise<ApiProduct> {
  const res = await fetch(`${API_BASE}/products/${id}`)
  const data = await handle<{ data: ApiProduct }>(res)
  return data.data
}

// ---------- Admin Product Operations ----------
export async function createProduct(payload: any) {
  const res = await fetch(`${API_BASE}/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(payload)
  })
  return handle(res)
}

export async function updateProductAPI(id: string, payload: any) {
  const res = await fetch(`${API_BASE}/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(payload)
  })
  return handle(res)
}

export async function deleteProductAPI(id: string) {
  const res = await fetch(`${API_BASE}/products/${id}`, {
    method: 'DELETE',
    headers: { ...authHeaders() }
  })
  return handle(res)
}
