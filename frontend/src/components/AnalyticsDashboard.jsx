import { useCallback, useEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts'

const COLORS = ['#6366f1', '#22c55e', '#fbbf24', '#ef4444', '#8b5cf6', '#0ea5e9']

function MetricCard({ label, value, helper }) {
  return (
    <div className="rounded-xl bg-slate-900 border border-slate-800 p-4 shadow-inner">
      <div className="text-xs uppercase tracking-wide text-slate-400">{label}</div>
      <div className="mt-1 text-2xl font-semibold text-slate-50">{value}</div>
      {helper ? <div className="mt-1 text-xs text-slate-400">{helper}</div> : null}
    </div>
  )
}

MetricCard.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.node.isRequired,
  helper: PropTypes.node,
}

export default function AnalyticsDashboard({ backend, backendAvailable }) {
  const [range, setRange] = useState(90)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [data, setData] = useState(null)

  const fetchAnalytics = useCallback(async () => {
    if (backendAvailable === false) {
      setError('Backend is unavailable')
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${backend}/analytics/overview?days=${range}`)
      if (!res.ok) throw new Error('Failed to load analytics')
      const body = await res.json()
      setData(body.data || body)
    } catch (err) {
      setError(err.message || 'Failed to load analytics')
      setData(null)
    } finally {
      setLoading(false)
    }
  }, [backend, backendAvailable, range])

  useEffect(() => {
    fetchAnalytics()
  }, [fetchAnalytics])

  const histogramData = useMemo(() => {
    if (!data?.ratingHistogram) return []
    return Object.entries(data.ratingHistogram)
      .map(([rating, count]) => ({ rating: Number(rating), count }))
      .sort((a, b) => a.rating - b.rating)
  }, [data?.ratingHistogram])

  const sourceMix = data?.sourceMix || []
  const timeline = data?.timeline || []
  const topProducts = data?.topProducts || []

  const activityBySource = useMemo(() => {
    if (!data?.activityBySource) return []
    const byDate = new Map()
    data.activityBySource.forEach(({ date, source, count }) => {
      if (!byDate.has(date)) byDate.set(date, { date })
      byDate.get(date)[source] = count
    })
    return Array.from(byDate.values()).sort((a, b) => String(a.date).localeCompare(String(b.date)))
  }, [data?.activityBySource])

  const activitySources = useMemo(() => {
    if (!data?.activityBySource) return []
    return Array.from(new Set(data.activityBySource.map(item => item.source)))
  }, [data?.activityBySource])

  const formatNumber = value =>
    typeof value === 'number' ? value.toLocaleString(undefined, { maximumFractionDigits: 1 }) : value

  return (
    <div className="px-6 py-6 sm:px-8 sm:py-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-50">Analytics dashboard</h1>
          <p className="text-slate-300 text-sm max-w-2xl mt-1">
            Monitor review ingestion health, spot source imbalances, and track rating trends across all products.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-400 uppercase tracking-wide">Range</label>
          <select
            value={range}
            onChange={e => setRange(Number(e.target.value))}
            className="rounded-lg border border-slate-700 bg-slate-900 text-slate-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
            <option value={180}>Last 180 days</option>
          </select>
        </div>
      </div>

      {loading && (
        <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-6 text-slate-300">
          Loading analytics...
        </div>
      )}

      {error && !loading && (
        <div className="rounded-xl border border-red-500/60 bg-red-950/40 p-6 text-red-100">
          {error}
        </div>
      )}

      {!loading && !error && data && (
        <div className="space-y-8">
          {/* KPI cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              label="Total reviews"
              value={formatNumber(data.totals?.totalReviews || 0)}
              helper="All time, across every source"
            />
            <MetricCard
              label="Average rating"
              value={data.totals?.averageRating?.toFixed(2) || '0.00'}
              helper="Weighted by review count"
            />
            <MetricCard
              label="Products with reviews"
              value={formatNumber(data.totals?.productsWithReviews || 0)}
              helper="Coverage across catalog"
            />
            <MetricCard
              label="Last ingest"
              value={
                data.totals?.lastIngestedAt
                  ? new Date(data.totals.lastIngestedAt).toLocaleString()
                  : 'N/A'
              }
              helper="Most recent fetched_at"
            />
          </div>

          {/* Timeline + source activity */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 rounded-xl border border-slate-800 bg-slate-900/70 p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h2 className="text-lg font-semibold text-slate-50">Review velocity</h2>
                  <p className="text-xs text-slate-400">Daily ingest counts with average rating overlay</p>
                </div>
              </div>
              {timeline.length === 0 ? (
                <div className="text-slate-400 text-sm">Not enough data to plot.</div>
              ) : (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={timeline}>
                      <defs>
                        <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.6} />
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0.05} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                      <XAxis dataKey="date" tick={{ fill: '#cbd5e1', fontSize: 11 }} tickMargin={8} />
                      <YAxis
                        yAxisId="left"
                        tick={{ fill: '#cbd5e1', fontSize: 11 }}
                        tickMargin={6}
                        allowDecimals={false}
                      />
                      <YAxis
                        yAxisId="right"
                        orientation="right"
                        domain={[0, 5]}
                        tick={{ fill: '#94a3b8', fontSize: 11 }}
                        tickMargin={6}
                      />
                      <Tooltip />
                      <Area
                        yAxisId="left"
                        type="monotone"
                        dataKey="count"
                        stroke="#6366f1"
                        fill="url(#colorCount)"
                        strokeWidth={2}
                        name="Reviews"
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="averageRating"
                        stroke="#22c55e"
                        strokeWidth={2}
                        dot={false}
                        name="Avg rating"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold text-slate-50">Source mix</h2>
                <span className="text-xs text-slate-400">Volume & avg rating</span>
              </div>
              {sourceMix.length === 0 ? (
                <div className="text-slate-400 text-sm">No source data yet.</div>
              ) : (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        dataKey="count"
                        nameKey="source"
                        data={sourceMix}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={2}
                        label
                      >
                        {sourceMix.map((entry, index) => (
                          <Cell key={`cell-${entry.source}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value, name, props) => {
                          const avg = props?.payload?.averageRating
                          return [`${value} reviews`, `${name} (avg ${avg ?? '-'})`]
                        }}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold text-slate-50">Rating distribution</h2>
                <span className="text-xs text-slate-400">All time</span>
              </div>
              {histogramData.length === 0 ? (
                <div className="text-slate-400 text-sm">No ratings captured yet.</div>
              ) : (
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={histogramData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                      <XAxis dataKey="rating" tick={{ fill: '#cbd5e1', fontSize: 11 }} />
                      <YAxis tick={{ fill: '#cbd5e1', fontSize: 11 }} allowDecimals={false} />
                      <Tooltip />
                      <Bar dataKey="count" radius={[6, 6, 0, 0]} fill="#38bdf8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold text-slate-50">Activity by source</h2>
                <span className="text-xs text-slate-400">Last {range} days</span>
              </div>
              {activityBySource.length === 0 ? (
                <div className="text-slate-400 text-sm">No recent activity for the selected window.</div>
              ) : (
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={activityBySource} stackOffset="expand">
                      <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                      <XAxis dataKey="date" tick={{ fill: '#cbd5e1', fontSize: 11 }} tickMargin={8} />
                      <YAxis
                        tick={{ fill: '#cbd5e1', fontSize: 11 }}
                        tickFormatter={val => `${Math.round(val * 100)}%`}
                      />
                      <Tooltip formatter={val => `${Math.round(val * 100)}%`} />
                      <Legend />
                      {activitySources.map((source, idx) => (
                        <Area
                          key={source}
                          type="monotone"
                          dataKey={source}
                          stackId="1"
                          stroke={COLORS[idx % COLORS.length]}
                          fill={COLORS[idx % COLORS.length]}
                          fillOpacity={0.7}
                        />
                      ))}
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </div>

          {/* Top products table */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-50">Top products by review volume</h2>
              <span className="text-xs text-slate-400">Sorted by count, then rating</span>
            </div>
            {topProducts.length === 0 ? (
              <div className="text-slate-400 text-sm">No products have reviews yet.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm text-left text-slate-200">
                  <thead className="text-xs uppercase text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="py-2 pr-3">Product</th>
                      <th className="py-2 pr-3">Reviews</th>
                      <th className="py-2 pr-3">Avg rating</th>
                      <th className="py-2 pr-3">First / last</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topProducts.map(product => (
                      <tr key={product.id} className="border-b border-slate-800/60">
                        <td className="py-2 pr-3 font-medium text-slate-50">{product.name}</td>
                        <td className="py-2 pr-3">{formatNumber(product.reviewCount)}</td>
                        <td className="py-2 pr-3">{product.averageRating?.toFixed(2)}</td>
                        <td className="py-2 pr-3 text-slate-400">
                          <div>
                            {product.firstReviewAt
                              ? new Date(product.firstReviewAt).toLocaleDateString()
                              : 'N/A'}
                          </div>
                          <div>
                            {product.lastReviewAt
                              ? new Date(product.lastReviewAt).toLocaleDateString()
                              : 'N/A'}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

AnalyticsDashboard.propTypes = {
  backend: PropTypes.string.isRequired,
  backendAvailable: PropTypes.bool,
}
