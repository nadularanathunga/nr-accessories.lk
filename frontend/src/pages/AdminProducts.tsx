import React, { useEffect, useState } from 'react'
import { fetchProducts, createProduct, updateProductAPI, deleteProductAPI } from '../data/api'
import type { Product } from '../data/catalog'
import { PlusIcon, EditIcon, TrashIcon } from 'lucide-react'
import { ProductFormModal } from '../components/Admin/ProductFormModal'

export function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  const loadData = () => {
    setLoading(true)
    fetchProducts().then(data => {
      setProducts(data)
      setLoading(false)
    })
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleSave = async (data: any) => {
    if (editingProduct) {
      await updateProductAPI(editingProduct.id, data)
    } else {
      await createProduct(data)
    }
    loadData()
  }

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      await deleteProductAPI(id)
      loadData()
    }
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-ink">Manage Products</h1>
        <button 
          onClick={() => { setEditingProduct(null); setModalOpen(true); }}
          className="flex items-center gap-2 rounded-lg bg-brand-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-800"
        >
          <PlusIcon className="h-4 w-4" />
          Add Product
        </button>
      </div>

      <div className="rounded-xl border border-line bg-white shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-ink-soft border-b border-line">
            <tr>
              <th className="px-6 py-4 font-semibold">Product</th>
              <th className="px-6 py-4 font-semibold">Price</th>
              <th className="px-6 py-4 font-semibold">Brand</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {loading ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-ink-soft">Loading products...</td>
              </tr>
            ) : products.map(product => (
              <tr key={product.id} className="hover:bg-gray-50/50">
                <td className="px-6 py-4 flex items-center gap-4">
                  <div className="h-12 w-12 shrink-0 rounded-lg border border-line bg-canvas p-1">
                    <img src={product.image} alt="" className="h-full w-full object-contain" />
                  </div>
                  <span className="font-medium text-ink">{product.name}</span>
                </td>
                <td className="px-6 py-4 text-ink">{product.price}</td>
                <td className="px-6 py-4 text-ink-soft">{product.brand}</td>
                <td className="px-6 py-4 text-right">
                  <button 
                    onClick={() => { setEditingProduct(product); setModalOpen(true); }}
                    className="inline-flex items-center justify-center p-2 text-ink-soft hover:text-brand-600 transition-colors"
                  >
                    <EditIcon className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(product.id)}
                    className="inline-flex items-center justify-center p-2 text-ink-soft hover:text-red-600 transition-colors"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <ProductFormModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        product={editingProduct} 
        onSave={handleSave} 
      />
    </div>
  )
}
