// src/components/ProductList.jsx
import { useState, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

// ---------------------------------------------------------------------------
// Product catalog with pagination + category filter (filter UI handled by parent)
// ---------------------------------------------------------------------------

export default function ProductList({
  categories = [],
  backend,
  backendAvailable = null,
  searchTerm = '',
  categoryFilter = '',
}) {
  const [page, setPage] = useState(1)
  const [perPage] = useState(6)
  const [sortBy, setSortBy] = useState('default')
  const [products, setProducts] = useState([])
  const [meta, setMeta] = useState({
    total: 0,
    page: 1,
    per_page: perPage,
    total_pages: 1,
  })
  const [loading, setLoading] = useState(false)

  const fetchPage = useCallback(
    async (p, c, sortOption) => {
      setLoading(true)
      try {
        const params = new globalThis.URLSearchParams({
          page: String(p),
          per_page: String(perPage),
        })
        if (c) params.set('category_id', c)
        if (sortOption && sortOption !== 'default') {
          params.set('sort', sortOption)
        }

        const res = await fetch(`${backend}/products?${params.toString()}`)
        const body = await res.json()

        setProducts(body.data || [])
        setMeta(
          body.meta || {
            total: 0,
            page: p,
            per_page: perPage,
            total_pages: 1,
          },
        )
      } catch (err) {
        console.error('Fetch page failed', err)
      } finally {
        setLoading(false)
      }
    },
    [backend, perPage],
  )

  useEffect(() => {
    setPage(1)
  }, [categoryFilter, sortBy])

  useEffect(() => {
    fetchPage(page, categoryFilter, sortBy)
  }, [page, categoryFilter, sortBy, fetchPage])

  if (loading) {
    return <div className="py-8 text-center text-slate-300">Loading products…</div>
  }

  if (backendAvailable === false) {
    return (
      <div className="py-8 text-center text-red-200 bg-red-950/40 border border-red-500/60 rounded-xl">
        The backend is currently unavailable. Products cannot be loaded. Please
        try again later.
      </div>
    )
  }

  if (!products || products.length === 0) {
    return (
      <div className="py-8 text-center text-slate-300">
        No products yet. Try seeding the database.
      </div>
    )
  }

  // ---- Client-side search on the current page's listing ----
  const normalizedSearch = searchTerm.trim().toLowerCase()
  const visibleProducts = normalizedSearch
    ? products.filter(p => {
        const name = (p.name || '').toLowerCase()
        const desc = (p.description || '').toLowerCase()
        return name.includes(normalizedSearch) || desc.includes(normalizedSearch)
      })
    : products

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
        <div className="text-xs text-slate-400">
          Page {meta.page} of {meta.total_pages} - {meta.total} products
        </div>
        <label className="text-xs text-slate-300 flex items-center gap-2">
          <span className="uppercase tracking-wide text-slate-500">Sort by</span>
          <select
            value={sortBy}
            onChange={event => setSortBy(event.target.value)}
            className="bg-slate-900 text-slate-100 border border-slate-700 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label="Sort products by rating"
          >
            <option value="default">Newest (default)</option>
            <option value="rating_desc">Rating: High to Low</option>
            <option value="rating_asc">Rating: Low to High</option>
          </select>
        </label>
      </div>

      {/* If there are products but none match the search */}
      {visibleProducts.length === 0 && (
        <div className="py-8 text-center text-slate-400 border-2 border-dashed border-slate-700 rounded-xl">
          No products match your search.
        </div>
      )}

      {/* Product grid */}
      {visibleProducts.length > 0 && (
        <ul
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 list-none"
          aria-label="Product catalog"
        >
          {visibleProducts.map(p => (
            <li
              key={p.id}
              className="bg-slate-900 border border-slate-700/80 rounded-2xl shadow-md hover:shadow-xl hover:border-indigo-500/70 overflow-hidden transition-all duration-200"
            >
              <Link
                to={`/products/${p.id}`}
                className="block w-full h-full text-left hover:bg-slate-900/60 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900"
                aria-label={`View details and reviews for ${p.name}`}
              >
                {/* Constrain image to the card with a fixed aspect ratio */}
                <div className="w-full aspect-[3/2] overflow-hidden bg-slate-800">
                  {p.image_url ? (
                    <img
                      src={p.image_url}
                      alt={`${p.name} product image`}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-slate-500 text-3xl font-semibold">
                      <span>600 x 400</span>
                    </div>
                  )}
                </div>

                <div className="p-4 sm:p-5">
                  <div className="flex items-start justify-between gap-2">
                    <h2 className="text-base sm:text-lg font-semibold text-slate-50 line-clamp-2">
                      {p.name}
                    </h2>
                    {p.category_name && (
                      <span className="ml-2 inline-flex items-center rounded-full bg-slate-800 px-2 py-0.5 text-[11px] font-medium text-slate-300">
                        {p.category_name}
                      </span>
                    )}
                  </div>

                  <div className="mt-2 flex items-center justify-between">
                    <div className="text-xl font-bold text-emerald-400">
                      ${Number(p.price).toFixed(2)}
                    </div>

                    {(p.avg_rating || p.review_count) && (
                      <div className="flex flex-col items-end text-xs text-slate-300">
                        <div className="flex items-center gap-1">
                          <span className="text-amber-400 text-sm">★</span>
                          {p.avg_rating && (
                            <span className="font-semibold">
                              {Number(p.avg_rating).toFixed(1)}
                            </span>
                          )}
                        </div>
                        {p.review_count && (
                          <span className="text-slate-400">
                            {p.review_count} reviews
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <p className="mt-3 text-sm text-slate-300/90 line-clamp-3">
                    {p.description ||
                      'Select this product to fetch and view aggregated reviews from multiple platforms.'}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {/* Pagination */}
      <nav
        className="flex items-center justify-center gap-4 mt-8"
        aria-label="Product pagination"
      >
        <button
          className="px-3 py-1.5 border border-slate-600 rounded-lg text-sm text-slate-100 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={meta.page === 1}
          aria-label="Go to previous page"
        >
          Previous
        </button>
        <div className="text-sm text-slate-300" aria-live="polite">
          Page {meta.page} of {meta.total_pages} — {meta.total} total items
        </div>
        <button
          className="px-3 py-1.5 border border-slate-600 rounded-lg text-sm text-slate-100 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          onClick={() => setPage(p => Math.min(meta.total_pages, p + 1))}
          disabled={meta.page === meta.total_pages}
          aria-label="Go to next page"
        >
          Next
        </button>
      </nav>
    </div>
  )
}

ProductList.propTypes = {
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    }),
  ),
  backend: PropTypes.string.isRequired,
  backendAvailable: PropTypes.bool,
  searchTerm: PropTypes.string,
  categoryFilter: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
}
