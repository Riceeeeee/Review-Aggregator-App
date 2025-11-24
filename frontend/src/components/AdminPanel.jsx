import { useEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types'

function ProductForm({ categories, onSave, saving, product }) {
  const emptyForm = { name: '', description: '', price: '', category_id: '', image_url: '' }
  const [form, setForm] = useState(product || emptyForm)
  const [imagePreview, setImagePreview] = useState(product?.image_url || '')

  useEffect(() => {
    setForm(product || emptyForm)
    setImagePreview(product?.image_url || '')
  }, [product])

  const handleChange = e => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleFile = e => {
    const file = e.target.files?.[0]
    if (!file) return
    // Optional lightweight guard to avoid huge base64 strings going into DB
    if (file.size > 1.5 * 1024 * 1024) {
      alert('Image is too large (max ~1.5MB). Please choose a smaller file or use a URL.')
      return
    }
    const reader = new FileReader()
    reader.onload = ev => {
      const dataUrl = ev.target?.result
      if (typeof dataUrl === 'string') {
        setForm(prev => ({ ...prev, image_url: dataUrl }))
        setImagePreview(dataUrl)
      }
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = e => {
    e.preventDefault()
    onSave({
      ...form,
      price: Number(form.price),
      category_id: form.category_id ? Number(form.category_id) : null,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <label className="text-sm text-slate-200">
          <div className="mb-1">Name</div>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-slate-50"
          />
        </label>
        <label className="text-sm text-slate-200">
          <div className="mb-1">Price</div>
          <input
            name="price"
            type="number"
            step="0.01"
            value={form.price}
            onChange={handleChange}
            required
            className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-slate-50"
          />
        </label>
      </div>

      <label className="text-sm text-slate-200 block">
        <div className="mb-1">Category</div>
        <select
          name="category_id"
          value={form.category_id || ''}
          onChange={handleChange}
          className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-slate-50"
        >
          <option value="">Uncategorized</option>
          {categories.map(c => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </label>

      <label className="text-sm text-slate-200 block">
        <div className="mb-1">Description</div>
        <textarea
          name="description"
          value={form.description || ''}
          onChange={handleChange}
          rows={3}
          className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-slate-50"
        />
      </label>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-start">
        <label className="text-sm text-slate-200 block">
          <div className="mb-1">Image URL</div>
          <input
            name="image_url"
            value={form.image_url || ''}
            onChange={e => {
              handleChange(e)
              setImagePreview(e.target.value)
            }}
            placeholder="https://example.com/image.jpg"
            className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-slate-50"
          />
          <div className="flex items-center gap-2 mt-2">
            <label className="px-3 py-1.5 rounded-lg border border-slate-700 text-xs text-slate-100 hover:bg-slate-800 cursor-pointer">
              <input type="file" accept="image/*" className="hidden" onChange={handleFile} />
              Choose image
            </label>
            <span className="text-xs text-slate-400">Paste a URL or pick an image file (base64)</span>
          </div>
        </label>

        <div className="flex items-center justify-center border border-dashed border-slate-700 rounded-lg bg-slate-900/60 h-full min-h-[140px]">
          {imagePreview ? (
            <img
              src={imagePreview}
              alt="Product preview"
              className="max-h-32 max-w-full object-contain"
              onError={() => setImagePreview('')}
            />
          ) : (
            <span className="text-xs text-slate-500">No image selected</span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-sm font-semibold"
        >
          {saving ? 'Saving...' : product ? 'Update product' : 'Create product'}
        </button>
        {product && (
          <span className="text-xs text-slate-400">
            Editing product ID {product.id}. Click any row to edit.
          </span>
        )}
      </div>
    </form>
  )
}

ProductForm.propTypes = {
  categories: PropTypes.arrayOf(PropTypes.shape({ id: PropTypes.number })).isRequired,
  onSave: PropTypes.func.isRequired,
  saving: PropTypes.bool,
  product: PropTypes.object,
}

function ModerationFilters({ status, setStatus, flaggedOnly, setFlaggedOnly, reload }) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <select
        value={status}
        onChange={e => setStatus(e.target.value)}
        className="rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-slate-50"
      >
        <option value="">All statuses</option>
        <option value="pending">Pending</option>
        <option value="approved">Approved</option>
        <option value="rejected">Rejected</option>
      </select>
      <label className="inline-flex items-center gap-2 text-sm text-slate-200">
        <input
          type="checkbox"
          checked={flaggedOnly}
          onChange={e => setFlaggedOnly(e.target.checked)}
          className="accent-indigo-500"
        />
        Flagged only
      </label>
      <button
        type="button"
        onClick={reload}
        className="px-3 py-2 rounded-lg border border-slate-700 text-sm text-slate-100 hover:bg-slate-800"
      >
        Refresh
      </button>
    </div>
  )
}

ModerationFilters.propTypes = {
  status: PropTypes.string.isRequired,
  setStatus: PropTypes.func.isRequired,
  flaggedOnly: PropTypes.bool.isRequired,
  setFlaggedOnly: PropTypes.func.isRequired,
  reload: PropTypes.func.isRequired,
}

export default function AdminPanel({ backend, backendAvailable, categories: categoriesProp = [] }) {
  const [categories, setCategories] = useState(categoriesProp)
  const [products, setProducts] = useState([])
  const [productsMeta, setProductsMeta] = useState({})
  const [loadingProducts, setLoadingProducts] = useState(false)
  const [savingProduct, setSavingProduct] = useState(false)
  const [productError, setProductError] = useState(null)
  const [editingProduct, setEditingProduct] = useState(null)

  const [queue, setQueue] = useState([])
  const [queueMeta, setQueueMeta] = useState({})
  const [loadingQueue, setLoadingQueue] = useState(false)
  const [queueError, setQueueError] = useState(null)
  const [filterStatus, setFilterStatus] = useState('pending')
  const [flaggedOnly, setFlaggedOnly] = useState(true)

  const apiUnavailable = backendAvailable === false

  // keep categories in sync if parent passes them in later
  useEffect(() => {
    if (categoriesProp && categoriesProp.length > 0) {
      setCategories(categoriesProp)
    }
  }, [categoriesProp])

  const loadCategories = async () => {
    if (categoriesProp.length > 0) return
    try {
      const res = await fetch(`${backend}/categories`)
      if (res.ok) {
        const body = await res.json()
        const list = Array.isArray(body) ? body : body.data || []
        setCategories(list)
      }
    } catch (err) {
      console.error('Failed to load categories', err)
    }
  }

  const loadProducts = async () => {
    if (apiUnavailable) return
    setLoadingProducts(true)
    setProductError(null)
    try {
      const res = await fetch(`${backend}/products?per_page=50&page=1`)
      if (!res.ok) throw new Error('Failed to load products')
      const body = await res.json()
      setProducts(body.data || [])
      setProductsMeta(body.meta || {})
    } catch (err) {
      setProductError(err.message)
    } finally {
      setLoadingProducts(false)
    }
  }

  const saveProduct = async payload => {
    setSavingProduct(true)
    setProductError(null)
    try {
      const isUpdate = Boolean(editingProduct?.id)
      const url = isUpdate ? `${backend}/products/${editingProduct.id}` : `${backend}/products`
      const method = isUpdate ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error('Save failed')
      await loadProducts()
      setEditingProduct(null)
    } catch (err) {
      setProductError(err.message)
    } finally {
      setSavingProduct(false)
    }
  }

  const deleteProduct = async id => {
    if (!window.confirm('Delete this product and all its reviews?')) return
    try {
      const res = await fetch(`${backend}/products/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Delete failed')
      await loadProducts()
    } catch (err) {
      setProductError(err.message)
    }
  }

  const loadQueue = async () => {
    if (apiUnavailable) return
    setLoadingQueue(true)
    setQueueError(null)
    try {
      const params = new URLSearchParams()
      params.set('limit', '50')
      if (filterStatus) params.set('status', filterStatus)
      if (flaggedOnly) params.set('flagged', '1')
      const res = await fetch(`${backend}/admin/reviews?${params.toString()}`)
      if (!res.ok) throw new Error('Failed to load moderation queue')
      const body = await res.json()
      setQueue(body.data || [])
      setQueueMeta(body.meta || {})
    } catch (err) {
      setQueueError(err.message)
    } finally {
      setLoadingQueue(false)
    }
  }

  const updateReview = async (id, payload) => {
    const res = await fetch(`${backend}/admin/reviews/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (!res.ok) throw new Error('Update failed')
  }

  const deleteReview = async id => {
    const res = await fetch(`${backend}/admin/reviews/${id}`, { method: 'DELETE' })
    if (!res.ok) throw new Error('Delete failed')
  }

  useEffect(() => {
    loadCategories()
    loadProducts()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    loadQueue()
  }, [filterStatus, flaggedOnly]) // eslint-disable-line react-hooks/exhaustive-deps

  const statusBadge = status => {
    const color =
      status === 'approved' ? 'bg-emerald-500/20 text-emerald-200' :
      status === 'rejected' ? 'bg-rose-500/20 text-rose-200' :
      'bg-amber-500/20 text-amber-200'
    return (
      <span className={`px-2 py-1 rounded-md text-xs font-semibold ${color}`}>
        {status || 'pending'}
      </span>
    )
  }

  const flaggedCount = useMemo(
    () => queue.filter(r => r.flagged).length,
    [queue],
  )

  return (
    <div className="px-6 py-6 sm:px-8 sm:py-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-50">Admin panel</h1>
          <p className="text-sm text-slate-300">
            Moderate reviews and manage products. Actions hit live API routes.
          </p>
        </div>
        {apiUnavailable && (
          <div className="text-xs text-amber-200 bg-amber-500/10 border border-amber-500/40 rounded-lg px-3 py-2">
            Backend unavailable
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <section className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-50">Product management</h2>
              <p className="text-xs text-slate-400">Create, edit, or delete products</p>
            </div>
            <button
              type="button"
              onClick={loadProducts}
              className="px-3 py-1.5 rounded-lg border border-slate-700 text-xs text-slate-100 hover:bg-slate-800"
            >
              Refresh
            </button>
          </div>

          {productError && (
            <div className="mb-3 text-sm text-red-200 bg-red-900/40 border border-red-500/40 rounded-lg px-3 py-2">
              {productError}
            </div>
          )}

          <ProductForm
            categories={categories}
            onSave={saveProduct}
            saving={savingProduct}
            product={editingProduct}
          />

          <div className="mt-5">
            <div className="flex items-center justify-between mb-2 text-xs text-slate-400">
              <span>
                Showing {products.length} of {productsMeta.total || products.length} products
              </span>
            </div>

            {loadingProducts ? (
              <div className="text-slate-300 text-sm">Loading products...</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm text-left text-slate-200">
                  <thead className="text-xs uppercase text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="py-2 pr-3">Name</th>
                      <th className="py-2 pr-3">Price</th>
                      <th className="py-2 pr-3">Category</th>
                      <th className="py-2 pr-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(p => (
                      <tr key={p.id} className="border-b border-slate-800/60">
                        <td className="py-2 pr-3 font-medium text-slate-50">{p.name}</td>
                        <td className="py-2 pr-3">${Number(p.price).toFixed(2)}</td>
                        <td className="py-2 pr-3 text-slate-400">
                          {p.category_name || '-'}
                        </td>
                        <td className="py-2 pr-3 flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setEditingProduct(p)}
                            className="px-2 py-1 rounded-md border border-slate-700 text-xs hover:bg-slate-800"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteProduct(p.id)}
                            className="px-2 py-1 rounded-md border border-rose-600 text-xs text-rose-200 hover:bg-rose-900/30"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                    {products.length === 0 && (
                      <tr>
                        <td className="py-3 text-slate-400" colSpan={4}>
                          No products found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>

        <section className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-50">Review moderation</h2>
              <p className="text-xs text-slate-400">
                Flag, approve, reject, or delete reviews. Showing latest fetched first.
              </p>
            </div>
            <div className="text-xs text-indigo-200 bg-indigo-500/10 border border-indigo-500/30 rounded-lg px-3 py-1">
              Flagged: {flaggedCount}
            </div>
          </div>

          <ModerationFilters
            status={filterStatus}
            setStatus={setFilterStatus}
            flaggedOnly={flaggedOnly}
            setFlaggedOnly={setFlaggedOnly}
            reload={loadQueue}
          />

          {queueError && (
            <div className="mt-3 text-sm text-red-200 bg-red-900/40 border border-red-500/40 rounded-lg px-3 py-2">
              {queueError}
            </div>
          )}

          <div className="mt-4">
            {loadingQueue ? (
              <div className="text-slate-300 text-sm">Loading moderation queue...</div>
            ) : (
              <div className="space-y-3">
                {queue.map(item => (
                  <div
                    key={item.id}
                    className="border border-slate-800 rounded-xl p-3 bg-slate-950/60"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-50">{item.title || '(No title)'}</span>
                          {statusBadge(item.moderation_status)}
                          {item.flagged && (
                            <span className="px-2 py-1 rounded-md text-[11px] font-semibold bg-amber-500/20 text-amber-200">
                              Flagged
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-slate-400 mt-1">
                          {item.source} • {item.author || 'Anonymous'} • Rating {item.rating} • Product {item.product_id}
                        </div>
                      </div>
                      <div className="text-xs text-slate-400">
                        {item.fetched_at ? new Date(item.fetched_at).toLocaleString() : ''}
                      </div>
                    </div>

                    <p className="text-sm text-slate-200 mt-2">{item.body || '(No content)'}</p>

                    <div className="mt-3 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={async () => {
                          try {
                            await updateReview(item.id, { moderationStatus: 'approved', flagged: false })
                            await loadQueue()
                          } catch (err) {
                            setQueueError(err.message)
                          }
                        }}
                        className="px-3 py-1.5 rounded-md bg-emerald-600 text-white text-xs hover:bg-emerald-700"
                      >
                        Approve
                      </button>
                      <button
                        type="button"
                        onClick={async () => {
                          try {
                            await updateReview(item.id, { moderationStatus: 'rejected' })
                            await loadQueue()
                          } catch (err) {
                            setQueueError(err.message)
                          }
                        }}
                        className="px-3 py-1.5 rounded-md bg-rose-600 text-white text-xs hover:bg-rose-700"
                      >
                        Reject
                      </button>
                      <button
                        type="button"
                        onClick={async () => {
                          try {
                            await updateReview(item.id, { moderationStatus: 'pending', flagged: true })
                            await loadQueue()
                          } catch (err) {
                            setQueueError(err.message)
                          }
                        }}
                        className="px-3 py-1.5 rounded-md bg-amber-600 text-white text-xs hover:bg-amber-700"
                      >
                        Flag for review
                      </button>
                      <button
                        type="button"
                        onClick={async () => {
                          try {
                            await updateReview(item.id, { flagged: !item.flagged })
                            await loadQueue()
                          } catch (err) {
                            setQueueError(err.message)
                          }
                        }}
                        className="px-3 py-1.5 rounded-md border border-slate-600 text-xs text-slate-100 hover:bg-slate-800"
                      >
                        {item.flagged ? 'Unflag' : 'Toggle flag'}
                      </button>
                      <button
                        type="button"
                        onClick={async () => {
                          if (!window.confirm('Delete this review permanently?')) return
                          try {
                            await deleteReview(item.id)
                            await loadQueue()
                          } catch (err) {
                            setQueueError(err.message)
                          }
                        }}
                        className="px-3 py-1.5 rounded-md border border-rose-600 text-xs text-rose-200 hover:bg-rose-900/30"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}

                {queue.length === 0 && (
                  <div className="text-slate-400 text-sm border border-dashed border-slate-800 rounded-lg p-4">
                    No reviews match the selected filters.
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}

AdminPanel.propTypes = {
  backend: PropTypes.string.isRequired,
  backendAvailable: PropTypes.bool,
  categories: PropTypes.array,
}
