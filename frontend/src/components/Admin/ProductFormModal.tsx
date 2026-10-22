import React, { useState, useEffect } from 'react'
import { XIcon } from 'lucide-react'
import { Button } from '../ui/Button'
import { fetchRawCategories, type ApiCategory } from '../../data/api'

interface ProductFormModalProps {
  isOpen: boolean
  onClose: () => void
  product?: any // null if adding new
  onSave: (data: any) => Promise<void>
}

function cleanImagePath(raw: string): string {
  if (!raw) return ''
  const trimmed = raw.trim()
  if (/^https?:\/\//i.test(trimmed)) return trimmed

  const idx = trimmed.indexOf('images/')
  if (idx !== -1) {
    return '/' + trimmed.substring(idx)
  }
  if (trimmed.startsWith('/')) return trimmed
  if (/\.(jpg|jpeg|png|webp|svg|gif|avif)$/i.test(trimmed)) {
    return `/images/${trimmed}`
  }
  return trimmed
}

export function ProductFormModal({ isOpen, onClose, product, onSave }: ProductFormModalProps) {
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<ApiCategory[]>([])
  
  const [formData, setFormData] = useState({
    title: '',
    brand: '',
    price: '',
    discountPrice: '',
    stockQuantity: '10',
    category: '',
    imageURL: '',
    description: ''
  })

  useEffect(() => {
    fetchRawCategories().then(setCategories)
  }, [])

  useEffect(() => {
    if (product) {
      setFormData({
        title: product.name || '',
        brand: product.brand || '',
        price: product.price ? product.price.replace(/[^0-9]/g, '') : '',
        discountPrice: product.oldPrice ? product.price.replace(/[^0-9]/g, '') : '',
        stockQuantity: '10',
        category: typeof product.category === 'object' ? product.category._id : (product.category || ''),
        imageURL: product.image || '',
        description: product.description || ''
      })
    } else {
      setFormData({ title: '', brand: '', price: '', discountPrice: '', stockQuantity: '10', category: '', imageURL: '', description: '' })
    }
  }, [product, isOpen])

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const cleanedImage = cleanImagePath(formData.imageURL)
      const payload = {
        ...formData,
        imageURL: cleanedImage,
        price: Number(formData.price),
        discountPrice: formData.discountPrice ? Number(formData.discountPrice) : undefined,
        stockQuantity: Number(formData.stockQuantity)
      }
      await onSave(payload)
      onClose()
    } catch (err: any) {
      console.error(err)
      alert('Failed to save product: ' + (err.message || 'Please check your inputs'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 p-4">
       <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden max-h-[90vh] flex flex-col">
          <div className="flex items-center justify-between border-b border-line px-6 py-4">
             <h2 className="text-lg font-bold text-ink">{product ? 'Edit Product' : 'Add New Product'}</h2>
             <button type="button" onClick={onClose} className="p-2 text-ink-soft hover:bg-gray-100 rounded-full transition-colors"><XIcon className="w-5 h-5"/></button>
          </div>
          <form id="productForm" onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
            <div className="p-6 overflow-y-auto space-y-4 flex-1">
               <div className="grid grid-cols-2 gap-4">
                 <div>
                   <label className="mb-1 block text-sm font-semibold text-ink">Title *</label>
                   <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="e.g. Anker 30W Charger" className="w-full rounded-xl border border-line-strong px-4 py-2 text-sm focus:border-brand-600 focus:outline-none" />
                 </div>
                 <div>
                   <label className="mb-1 block text-sm font-semibold text-ink">Brand *</label>
                   <input required type="text" value={formData.brand} onChange={e => setFormData({...formData, brand: e.target.value})} placeholder="e.g. Anker" className="w-full rounded-xl border border-line-strong px-4 py-2 text-sm focus:border-brand-600 focus:outline-none" />
                 </div>
               </div>

               <div className="grid grid-cols-2 gap-4">
                 <div>
                   <label className="mb-1 block text-sm font-semibold text-ink">Price (Rs) *</label>
                   <input required min="1" type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} placeholder="e.g. 6500" className="w-full rounded-xl border border-line-strong px-4 py-2 text-sm focus:border-brand-600 focus:outline-none" />
                 </div>
                 <div>
                   <label className="mb-1 block text-sm font-semibold text-ink">Discount Price (Rs) - Optional</label>
                   <input min="1" type="number" value={formData.discountPrice} onChange={e => setFormData({...formData, discountPrice: e.target.value})} placeholder="e.g. 5800" className="w-full rounded-xl border border-line-strong px-4 py-2 text-sm focus:border-brand-600 focus:outline-none" />
                 </div>
               </div>

               <div className="grid grid-cols-2 gap-4">
                 <div>
                   <label className="mb-1 block text-sm font-semibold text-ink">Stock Quantity *</label>
                   <input required min="0" type="number" value={formData.stockQuantity} onChange={e => setFormData({...formData, stockQuantity: e.target.value})} className="w-full rounded-xl border border-line-strong px-4 py-2 text-sm focus:border-brand-600 focus:outline-none" />
                 </div>
                 <div>
                   <label className="mb-1 block text-sm font-semibold text-ink">Category *</label>
                   <select required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full rounded-xl border border-line-strong px-4 py-2 text-sm focus:border-brand-600 focus:outline-none bg-white">
                     <option value="" disabled>Select category</option>
                     {categories.map(c => (
                       <option key={c._id} value={c._id}>{c.name}</option>
                     ))}
                   </select>
                 </div>
               </div>

               <div>
                 <label className="mb-1 block text-sm font-semibold text-ink">Image Path / URL</label>
                 <div className="flex gap-3 items-center">
                   <input 
                     type="text" 
                     value={formData.imageURL} 
                     onChange={e => setFormData({...formData, imageURL: e.target.value})} 
                     placeholder="/images/example.jpg or https://..." 
                     className="flex-1 rounded-xl border border-line-strong px-4 py-2 text-sm focus:border-brand-600 focus:outline-none" 
                   />
                   {formData.imageURL && (
                     <div className="h-10 w-10 shrink-0 rounded-lg border border-line bg-canvas overflow-hidden flex items-center justify-center p-0.5">
                       <img 
                         src={cleanImagePath(formData.imageURL)} 
                         alt="Preview" 
                         className="h-full w-full object-contain"
                         onError={(e) => { (e.currentTarget as HTMLElement).style.display = 'none'; }}
                       />
                     </div>
                   )}
                 </div>
                 <p className="mt-1 text-xs text-ink-soft">
                   File path or image name (e.g. <code className="bg-gray-100 px-1 py-0.5 rounded text-brand-700">/images/my_photo.jpg</code>) or direct URL
                 </p>
               </div>

               <div>
                 <label className="mb-1 block text-sm font-semibold text-ink">Description</label>
                 <textarea 
                   rows={3} 
                   value={formData.description} 
                   onChange={e => setFormData({...formData, description: e.target.value})} 
                   placeholder="Enter product description, key features, specifications..." 
                   className="w-full rounded-xl border border-line-strong px-4 py-2 text-sm focus:border-brand-600 focus:outline-none resize-none" 
                 />
               </div>
            </div>

            <div className="border-t border-line px-6 py-4 flex justify-end gap-3 bg-gray-50">
              <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-semibold text-ink-soft hover:text-ink">Cancel</button>
              <Button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save Product'}</Button>
            </div>
          </form>
       </div>
    </div>
  )
}
