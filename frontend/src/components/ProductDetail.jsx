// src/components/ProductDetail.jsx
import { useEffect, useState, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  BarChart,
  Bar,
} from 'recharts'

const REVIEWS_PER_PAGE = 8

export default function ProductDetail({ backend, backendAvailable }) {
  const { id } = useParams()
  const navigate = useNavigate()

  const [product, setProduct] = useState(null)
  const [reviews, setReviews] = useState([])
  const [loadingProduct, setLoadingProduct] = useState(true)
  const [loadingReviews, setLoadingReviews] = useState(true)
  const [fetching, setFetching] = useState(false)
  const [fetchingApi, setFetchingApi] = useState(false)
  const [error, setError] = useState(null)

  const [search, setSearch] = useState('')
  const [sourceFilter, setSourceFilter] = useState('all')
  const [ratingFilter, setRatingFilter] = useState('all')
  const [onlyVerified, setOnlyVerified] = useState(false)
  const [sortBy, setSortBy] = useState('newest')

  // pagination state for review
  const [reviewPage, setReviewPage] = useState(1)

  const formatDateTime = dt => {
    if (!dt) return ''
    const d = new Date(dt)
    if (Number.isNaN(d.getTime())) return dt
    return d.toLocaleString()
  }

  // When changing filter/search/sort → return to page 1
  useEffect(() => {
    setReviewPage(1)
  }, [search, sourceFilter, ratingFilter, sortBy])

  // ----------- LOAD PRODUCT -----------
  useEffect(() => {
    if (backendAvailable === false) {
      setError('Backend is unavailable')
      setLoadingProduct(false)
      return
    }

    setLoadingProduct(true)
    fetch(`${backend}/products/${id}`)
      .then(r => {
        if (!r.ok) throw new Error('Product not found')
        return r.json()
      })
      .then(p => {
        setProduct(p)
        setError(null)
      })
      .catch(err => {
        console.error(err)
        setError(err.message)
      })
      .finally(() => setLoadingProduct(false))
  }, [id, backend, backendAvailable])

  // ----------- LOAD REVIEWS -----------
  const loadReviews = async () => {
    setLoadingReviews(true)
    try {
      const r = await fetch(`${backend}/products/${id}/reviews`)
      if (!r.ok) throw new Error('Failed to load reviews')
      const body = await r.json()
      const list = Array.isArray(body) ? body : body.data || []
      setReviews(list)
    } catch (err) {
      console.error(err)
    } finally {
      setLoadingReviews(false)
    }
  }

  useEffect(() => {
    if (backendAvailable !== false) loadReviews()
  }, [id, backend, backendAvailable])

  // ----------- FETCH REVIEWS -----------
  const handleFetchReviews = async () => {
    setFetching(true)
    try {
      const res = await fetch(`${backend}/products/${id}/fetch`, {
        method: 'POST',
      })
      if (!res.ok) throw new Error('Fetch failed')
      await loadReviews()
    } catch (err) {
      console.error(err)
      alert('Failed to fetch reviews from scraper.')
    } finally {
      setFetching(false)
    }
  }

  const handleFetchReviewsFromApi = async () => {
    setFetchingApi(true)
    try {
      const res = await fetch(`${backend}/products/${id}/fetch-walmart`, {
        method: 'POST',
      })
      if (!res.ok) throw new Error('Fetch failed')
      await loadReviews()
    } catch (err) {
      console.error(err)
      alert('Failed to fetch reviews from Walmart API.')
    } finally {
      setFetchingApi(false)
    }
  }

  // ----------- DERIVED STATS + FILTER + CHART DATA -----------
  const {
    filteredReviews,
    paginatedReviews,
    filteredCount,
    totalReviews,
    ratingStats,
    sourceStats,
    avgRating,
    totalPages,
    timelineData,
    sourceAvgRatings,
    aiSummary,
  } = useMemo(() => {
    const total = reviews.length
    const ratingCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    const sourceCounts = {}
    const sourceAgg = {} // for avg rating per source
    const dateBuckets = {} // for timeline
    let sumRating = 0

    for (const r of reviews) {
      const rating = Number(r.rating) || 0
      if (rating >= 1 && rating <= 5) {
        ratingCounts[rating] += 1
        sumRating += rating

        // group by source
        if (r.source) {
          const key = r.source
          if (!sourceAgg[key]) sourceAgg[key] = { sum: 0, count: 0 }
          sourceAgg[key].sum += rating
          sourceAgg[key].count += 1
        }

        // group by date for timeline
        const rawDate = r.date || r.created_at || r.fetched_at
        if (rawDate) {
          const d = new Date(rawDate)
          if (!Number.isNaN(d.getTime())) {
            const dayKey = d.toISOString().slice(0, 10) // YYYY-MM-DD
            if (!dateBuckets[dayKey]) dateBuckets[dayKey] = { sum: 0, count: 0 }
            dateBuckets[dayKey].sum += rating
            dateBuckets[dayKey].count += 1
          }
        }
      }

      if (r.source) {
        sourceCounts[r.source] = (sourceCounts[r.source] || 0) + 1
      }
    }

    const average = total > 0 ? sumRating / total : 0

    // filter + search + sort
    let result = [...reviews]
    if (sourceFilter !== 'all') {
      result = result.filter(
        r => String(r.source).toLowerCase() === sourceFilter.toLowerCase(),
      )
    }
    if (onlyVerified) {
      result = result.filter(r => r.verifiedPurchase)
    }
    if (ratingFilter !== 'all') {
      const rf = Number(ratingFilter)
      result = result.filter(r => Number(r.rating) === rf)
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase()
      result = result.filter(r => {
        const title = (r.title || '').toLowerCase()
        const body = (r.body || r.content || '').toLowerCase()
        return title.includes(q) || body.includes(q)
      })
    }

    result.sort((a, b) => {
      if (sortBy === 'rating-high') return (b.rating || 0) - (a.rating || 0)
      if (sortBy === 'rating-low') return (a.rating || 0) - (b.rating || 0)
      if (sortBy === 'oldest')
        return new Date(a.date || a.created_at) - new Date(b.date || b.created_at)
      return new Date(b.date || b.created_at) - new Date(a.date || a.created_at) // newest
    })

    const filteredCount = result.length
    const totalPages =
      filteredCount === 0
        ? 1
        : Math.max(1, Math.ceil(filteredCount / REVIEWS_PER_PAGE))
    const currentPage = Math.min(Math.max(1, reviewPage), totalPages)
    const start = (currentPage - 1) * REVIEWS_PER_PAGE
    const paginated = result.slice(start, start + REVIEWS_PER_PAGE)

    // timeline data: [{date, avgRating, count}]
    const timelineData = Object.entries(dateBuckets)
      .sort(([a], [b]) => new Date(a) - new Date(b))
      .map(([date, { sum, count }]) => ({
        date,
        avgRating: sum / count,
        count,
      }))

    // bar chart data: [{source, avgRating, count}]
    const sourceAvgRatings = Object.entries(sourceAgg).map(
      ([source, { sum, count }]) => ({
        source,
        avgRating: sum / count,
        count,
      }),
    )

    // Simple heuristic summary
    const positiveCount = ratingCounts[4] + ratingCounts[5]
    const negativeCount = ratingCounts[1] + ratingCounts[2]
    const neutralCount = ratingCounts[3]
    const topSource = Object.entries(sourceCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([src]) => src)[0]

    const prosText =
      positiveCount > 0
        ? `${positiveCount} reviews at 4-5 stars praise quality and value.`
        : 'Not enough positive feedback to highlight.'

    const consText =
      negativeCount > 0
        ? `${negativeCount} reviews at 1-2 stars call out issues (expectations, durability, or experience).`
        : 'Few clearly negative reviews.'

    const commonText =
      total > 0
        ? `Average ${average.toFixed(1)}/5 across ${total} reviews; top source: ${topSource || 'mixed sources'}.`
        : 'Not enough data for a common opinion.'

    return {
      filteredReviews: result,
      paginatedReviews: paginated,
      filteredCount,
      totalReviews: total,
      ratingStats: ratingCounts,
      sourceStats: sourceCounts,
      avgRating: average,
      totalPages,
      timelineData,
      sourceAvgRatings,
      aiSummary: {
        pros: prosText,
        cons: consText,
        common: commonText,
        neutralCount,
      },
    }
  }, [reviews, search, sourceFilter, ratingFilter, sortBy, reviewPage, onlyVerified])

  let sentimentLabel = 'Very Negative'
  let sentimentColor = 'text-red-500'
  if (avgRating >= 4.5) {
    sentimentLabel = 'Excellent'
    sentimentColor = 'text-emerald-500'
  } else if (avgRating >= 3.5) {
    sentimentLabel = 'Very Positive'
    sentimentColor = 'text-emerald-500'
  } else if (avgRating >= 2.5) {
    sentimentLabel = 'Mixed'
    sentimentColor = 'text-yellow-500'
  } else if (avgRating >= 1.5) {
    sentimentLabel = 'Negative'
    sentimentColor = 'text-orange-500'
  }

  // ----------- RENDER -----------
  if (backendAvailable === false) {
    return (
      <div className="p-4 rounded bg-red-50 border border-red-200 text-red-800">
        Cannot load product: backend is unavailable.
      </div>
    )
  }

  if (loadingProduct) {
    return <div className="py-8 text-center text-slate-300">Loading product…</div>
  }

  if (error || !product) {
    return (
      <div className="p-4 rounded bg-red-50 border border-red-200 text-red-800">
        {error || 'Product not found'}
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header on black background */}
      <button
        className="mb-4 text-sm text-indigo-300 hover:text-indigo-200 hover:underline"
        onClick={() => navigate(-1)}
      >
        ← Back to products
      </button>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-slate-50">
            {product.name}
          </h1>
          <p className="text-sm text-slate-400">
            {product.category_name || 'Uncategorized'}
          </p>
        </div>
        <div className="text-2xl font-bold text-emerald-400">
          ${Number(product.price).toFixed(2)}
        </div>
      </div>

      {/* Product media + description */}
      <section className="mb-8">
        <div className="grid gap-6 md:grid-cols-[minmax(0,320px),1fr] items-start">
          {/* Image */}
          <div className="overflow-hidden rounded-xl bg-slate-900/60 border border-slate-700">
            <img
              src={
                product.image_url ||
                'https://placehold.co/600x400?text=No+Image'
              }
              alt={
                product.image_url
                  ? `${product.name} product image`
                  : 'No image available'
              }
              className="w-full h-64 md:h-80 object-cover"
            />
          </div>

          {/* Description block */}
          <div className="bg-slate-900/40 border border-slate-700/70 rounded-xl p-4 md:p-5">
            <h2 className="text-lg font-semibold text-slate-50 mb-2">
              Description
            </h2>

            <p className="text-sm leading-relaxed text-slate-200">
              {product.description ||
                'No detailed description has been provided for this product yet.'}
            </p>

            {/* Small metadata below */}
            <div className="mt-4 text-xs text-slate-400">
              {product.created_at && (
                <>
                  Created:{' '}
                  <time dateTime={product.created_at}>
                    {formatDateTime(product.created_at)}
                  </time>
                </>
              )}
            </div>
          </div>
        </div>
      </section>


      {/* Customer Reviews card (white background) */}
      <section className="bg-white rounded-xl shadow p-6">
        <div className="flex items-center justify-between mb-6 gap-3 flex-wrap">
          <h2 className="text-xl font-semibold text-slate-900">
            Customer Reviews
          </h2>
          <div className="flex items-center gap-2">
            <button
              className="px-5 py-2 rounded-full bg-indigo-600 text-white font-semibold shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
              onClick={handleFetchReviews}
              disabled={fetching || fetchingApi}
            >
              {fetching ? 'Fetching...' : 'Fetch Reviews'}
            </button>
            <button
              className="px-5 py-2 rounded-full bg-emerald-600 text-white font-semibold shadow hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50"
              onClick={handleFetchReviewsFromApi}
              disabled={fetching || fetchingApi}
            >
              {fetchingApi ? 'Fetching from API...' : 'Fetch Reviews from API'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT: search + filters + list + pagination */}
          <div className="lg:col-span-2">
            {/* Search */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-800 mb-1">
                Search reviews
              </label>
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search by title or content..."
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3 mb-3 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-slate-700">Source</span>
                <select
                  value={sourceFilter}
                  onChange={e => setSourceFilter(e.target.value)}
                  className="border border-slate-300 rounded-md px-2 py-1 bg-white text-slate-800"
                >
                  <option value="all">All</option>
                  {Object.keys(sourceStats).map(src => (
                    <option key={src} value={src}>
                      {src}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-slate-700">Rating</span>
                <select
                  value={ratingFilter}
                  onChange={e => setRatingFilter(e.target.value)}
                  className="border border-slate-300 rounded-md px-2 py-1 bg-white text-slate-800"
                >
                  <option value="all">All</option>
                  <option value="5">5★</option>
                  <option value="4">4★</option>
                  <option value="3">3★</option>
                  <option value="2">2★</option>
                  <option value="1">1★</option>
                </select>
              </div>

              <label className="flex items-center gap-2 text-slate-700">
                <input
                  type="checkbox"
                  checked={onlyVerified}
                  onChange={e => setOnlyVerified(e.target.checked)}
                  className="h-4 w-4 text-indigo-600 border-slate-300 rounded"
                />
                Only verified reviews
              </label>

                  <div className="flex items-center gap-2">
                    <span className="text-slate-700">Sort by</span>
                    <select
                      value={sortBy}
                      onChange={e => setSortBy(e.target.value)}
                      className="border border-slate-300 rounded-md px-2 py-1 bg-white text-slate-800"
                    >
                      <option value="newest">Newest First</option>
                      <option value="oldest">Oldest First</option>
                      <option value="rating-high">Rating: High to Low</option>
                      <option value="rating-low">Rating: Low to High</option>
                    </select>
                  </div>

                  <div className="ml-auto text-slate-500">
                    Showing {filteredCount} of {totalReviews} reviews
                  </div>
            </div>

            {/* AI Summary */}
            <div className="mb-4 p-4 rounded-lg border border-slate-200 bg-slate-50">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className="text-sm font-semibold text-slate-900">AI Summary</div>
                  <div className="text-xs text-slate-500">
                    Quick snapshot: Pros, Cons, Common themes
                  </div>
                </div>
                <div className="text-xs text-slate-500">
                  Total {totalReviews} reviews
                </div>
              </div>
              <dl className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                <div className="bg-white border border-slate-200 rounded-lg p-3">
                  <dt className="font-semibold text-emerald-600 mb-1">Pros</dt>
                  <dd className="text-slate-700">{aiSummary.pros}</dd>
                </div>
                <div className="bg-white border border-slate-200 rounded-lg p-3">
                  <dt className="font-semibold text-rose-600 mb-1">Cons</dt>
                  <dd className="text-slate-700">{aiSummary.cons}</dd>
                </div>
                <div className="bg-white border border-slate-200 rounded-lg p-3">
                  <dt className="font-semibold text-indigo-600 mb-1">Common opinion</dt>
                  <dd className="text-slate-700">{aiSummary.common}</dd>
                </div>
              </dl>
            </div>

            {/* Reviews list */}
            {loadingReviews ? (
              <div className="mt-4 text-sm text-slate-500">
                Loading reviews…
              </div>
            ) : paginatedReviews.length === 0 ? (
              <div className="mt-4 border-2 border-dashed border-slate-200 rounded-lg min-h-[140px] flex items-center justify-center text-sm text-slate-400">
                {totalReviews === 0
                  ? 'No reviews yet. Click “Fetch Reviews” to load them.'
                  : 'No reviews match your filters.'}
              </div>
            ) : (
              <>
                <ul className="mt-4 space-y-4">
                  {paginatedReviews.map(r => {
                    const initials = (r.author || 'Anonymous')
                      .split(' ')
                      .filter(Boolean)
                      .map(part => part[0]?.toUpperCase())
                      .slice(0, 2)
                      .join('');

                    const avatarColors = ['#6366f1', '#22c55e', '#f97316', '#06b6d4', '#eab308'];
                    const color = avatarColors[Math.abs((r.author || 'anon').length) % avatarColors.length];

                    return (
                      <li
                        key={r.id || `${r.source}-${r.review_id}`}
                        className="border border-slate-200 rounded-lg p-4 bg-slate-50"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-3">
                            <div
                              className="h-10 w-10 rounded-full flex items-center justify-center text-sm font-semibold text-white"
                              style={{ backgroundColor: color }}
                              aria-hidden="true"
                            >
                              {initials || 'A'}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-slate-900">
                                  {r.author || 'Anonymous'}
                                </span>
                                {r.verifiedPurchase && (
                                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-200">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-3 w-3"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M9 12l2 2 4-4m5 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                      />
                                    </svg>
                                    Verified
                                  </span>
                                )}
                                {r.source && (
                                  <span className="text-xs px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                                    {r.source}
                                  </span>
                                )}
                              </div>
                              <div className="mt-1 flex items-center gap-2 text-sm text-slate-800">
                                <span className="text-amber-500">
                                  {'★'.repeat(r.rating || 0).padEnd(5, '☆')}
                                </span>
                                {r.rating && (
                                  <span className="font-medium">{r.rating}/5</span>
                                )}
                              </div>
                            </div>
                          </div>

                          {(r.date || r.created_at) && (
                            <time
                              className="text-xs text-slate-400"
                              dateTime={r.date || r.created_at}
                            >
                              {formatDateTime(r.date || r.created_at)}
                            </time>
                          )}
                        </div>

                        {r.title && (
                          <div className="mt-2 font-semibold text-slate-900">
                            {r.title}
                          </div>
                        )}

                        {(r.body || r.content) && (
                          <p className="mt-1 text-sm text-slate-800 whitespace-pre-line">
                            {r.body || r.content}
                          </p>
                        )}
                      </li>
                    );
                  })}
                </ul>

                {/* Pagination controls for reviews */}
                {totalPages > 1 && (
                  <nav
                    className="flex items-center justify-center gap-4 mt-6"
                    aria-label="Review pagination"
                  >
                    <button
                    className="px-3 py-1 rounded bg-indigo-600 text-white 
                              disabled:opacity-40 
                              hover:bg-indigo-700 
                              focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    onClick={() => setReviewPage(p => Math.max(1, p - 1))}
                    disabled={reviewPage === 1}
                  >
                    Previous
                  </button>
                    <div className="text-xs text-slate-500">
                      Page {reviewPage} of {totalPages}
                    </div>
                    <button
                    className="px-3 py-1 rounded bg-indigo-600 text-white 
                              disabled:opacity-40 
                              hover:bg-indigo-700 
                              focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    onClick={() => setReviewPage(p => Math.min(totalPages, p + 1))}
                    disabled={reviewPage === totalPages}
                  >
                    Next
                  </button>
                  </nav>
                )}
              </>
            )}
          </div>

          {/* RIGHT: stats + charts */}
          <aside className="bg-slate-50 border border-slate-200 rounded-xl p-4 lg:p-5 space-y-6">
            {/* Summary */}
            <div>
              <div className="flex items-baseline justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-4xl font-bold text-slate-900">
                    {avgRating.toFixed(1)}
                  </span>
                  <span className="text-xl text-amber-400">★</span>
                </div>
                <div className="text-sm text-slate-500">
                  <div className="text-right">
                    {totalReviews}{' '}
                    <span className="text-slate-400">total reviews</span>
                  </div>
                  <div className={`text-xs font-medium ${sentimentColor}`}>
                    {sentimentLabel}
                  </div>
                </div>
              </div>

              <div className="mt-4 text-sm">
                <div className="font-semibold text-slate-800 mb-2">
                  By Source
                </div>
                {Object.keys(sourceStats).length === 0 ? (
                  <div className="text-xs text-slate-400">No source data</div>
                ) : (
                  <ul className="space-y-1">
                    {Object.entries(sourceStats).map(([src, count]) => (
                      <li
                        key={src}
                        className="flex items-center justify-between text-xs text-slate-700"
                      >
                        <span>{src}</span>
                        <span>
                          {count} (
                          {totalReviews > 0
                            ? Math.round((count / totalReviews) * 100)
                            : 0}
                          %)
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              {/* Rating Distribution */}
              <div className="mt-6 text-sm">
                <div className="font-semibold text-slate-800 mb-2">
                  Rating Distribution
                </div>

                <div className="space-y-1">
                  {[5, 4, 3, 2, 1].map(star => {
                    const count = ratingStats[star] || 0
                    const percent =
                      totalReviews > 0 ? (count / totalReviews) * 100 : 0

                    return (
                      <div
                        key={star}
                        className="flex items-center gap-2 text-xs text-slate-700"
                      >
                        <span className="w-6 font-medium">{star}★</span>
                        <div className="flex-1 h-2 rounded-full bg-slate-200 overflow-hidden">
                          <div
                            className="h-full bg-indigo-500 transition-all"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                        <span className="w-12 text-right">
                          {count} ({Math.round(percent)}%)
                        </span>
                      </div>
                    )
                  })}
                </div>

                {totalReviews > 0 && (
                  <div className="mt-3 text-xs text-slate-400">
                    ⭐ Highest ratings appear on top, lowest at bottom
                  </div>
                )}
              </div>

            </div>

            {/* Timeline chart */}
            <div className="border-t border-slate-200 pt-4">
              <div className="text-sm font-semibold text-slate-800 mb-2">
                Rating trend over time
              </div>
              {timelineData.length === 0 ? (
                <div className="text-xs text-slate-400">
                  Not enough data for timeline.
                </div>
              ) : (
                <div className="h-40">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={timelineData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="date"
                        tick={{ fontSize: 10 }}
                        tickMargin={4}
                      />
                      <YAxis
                        domain={[0, 5]}
                        tick={{ fontSize: 10 }}
                        tickMargin={4}
                      />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="avgRating"
                        stroke="#6366f1"
                        strokeWidth={2}
                        dot={{ r: 3 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            {/* Bar chart per source */}
            <div className="border-t border-slate-200 pt-4">
              <div className="text-sm font-semibold text-slate-800 mb-2">
                Average rating by source
              </div>
              {sourceAvgRatings.length === 0 ? (
                <div className="text-xs text-slate-400">
                  No source rating data.
                </div>
              ) : (
                <div className="h-40">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={sourceAvgRatings}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="source"
                        tick={{ fontSize: 10 }}
                        tickMargin={4}
                      />
                      <YAxis domain={[0, 5]} tick={{ fontSize: 10 }} />
                      <Tooltip />
                      <Bar dataKey="avgRating" fill="#22c55e" radius={4} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            {totalReviews > 0 && (
              <div className="pt-1 text-xs text-slate-400">
                ⚠ Lower ratings prevalent
              </div>
            )}
          </aside>
        </div>
      </section>
    </div>
  )
}

ProductDetail.propTypes = {
  backend: PropTypes.string.isRequired,
  backendAvailable: PropTypes.bool,
}
