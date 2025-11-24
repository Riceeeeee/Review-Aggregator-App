import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

/** Map source to Tailwind badge color classes */
const sourceBadgeClass = (source) => {
  switch ((source || '').toLowerCase()) {
    case 'amazon':
      return 'bg-orange-100 text-orange-800';
    case 'bestbuy':
      return 'bg-blue-100 text-blue-800';
    case 'walmart':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

/**
 * Determine sentiment based on average rating
 * @param {number} average
 * @returns {{label: string, color: string, icon: string}}
 */
const getSentiment = (average) => {
  if (average >= 4.5) return { label: 'Very Positive', color: 'text-green-600 dark:text-green-400', icon: '😊' };
  if (average >= 3.5) return { label: 'Positive', color: 'text-green-500 dark:text-green-300', icon: '🙂' };
  if (average >= 2.5) return { label: 'Neutral', color: 'text-yellow-500 dark:text-yellow-300', icon: '😐' };
  if (average >= 1.5) return { label: 'Negative', color: 'text-orange-500 dark:text-orange-400', icon: '😕' };
  return { label: 'Very Negative', color: 'text-red-600 dark:text-red-400', icon: '😞' };
};

/**
 * Get trend indicator based on rating distribution
 * @param {Object} histogram
 * @returns {{trend: 'up'|'down'|'stable', percentage: number}}
 */
const getTrendIndicator = (histogram) => {
  if (!histogram) return { trend: 'stable', percentage: 0 };
  const positive = (histogram[5] || 0) + (histogram[4] || 0);
  const negative = (histogram[1] || 0) + (histogram[2] || 0);
  const total = positive + negative;
  if (total === 0) return { trend: 'stable', percentage: 0 };
  const positivePercent = (positive / total) * 100;
  if (positivePercent > 66) return { trend: 'up', percentage: positivePercent };
  if (positivePercent < 34) return { trend: 'down', percentage: positivePercent };
  return { trend: 'stable', percentage: positivePercent };
};

function Skeleton() {
  return (
    <div className="animate-pulse space-y-3">
      <div className="h-12 w-48 bg-gray-200 rounded" />
      <div className="h-6 w-32 bg-gray-200 rounded" />
      <div className="space-y-2">
        <div className="h-4 w-full bg-gray-200 rounded" />
        <div className="h-4 w-5/6 bg-gray-200 rounded" />
        <div className="h-4 w-3/4 bg-gray-200 rounded" />
      </div>
    </div>
  );
}

export default function ReviewStats({ stats, loading }) {
  const { overallAverage = 0, totalReviews = 0, sourceBreakdown = [], ratingHistogram = {} } = stats || {};

  const histogram = useMemo(() => {
    const total = totalReviews || Object.values(ratingHistogram).reduce((a, b) => a + (b || 0), 0);
    const rows = [5, 4, 3, 2, 1].map((rating) => {
      const count = ratingHistogram && ratingHistogram[rating] ? ratingHistogram[rating] : 0;
      const percent = total ? Math.round((count / total) * 100) : 0;
      return { rating, count, percent };
    });
    return { total, rows };
  }, [ratingHistogram, totalReviews]);

  const sentiment = useMemo(() => getSentiment(overallAverage), [overallAverage]);
  const trend = useMemo(() => getTrendIndicator(ratingHistogram), [ratingHistogram]);

  if (loading) {
    return (
      <section aria-live="polite" className="p-4 bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700">
        <Skeleton />
      </section>
    );
  }

  return (
    <section aria-label="Review statistics" className="p-4 bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-baseline gap-3">
          <div className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-gray-100" aria-hidden>
            {overallAverage.toFixed(1)}
          </div>
          <div className="text-lg text-yellow-500 font-semibold" aria-label={`Average rating ${overallAverage.toFixed(1)} out of 5`}>
            ★
          </div>
          {trend.trend !== 'stable' && (
            <div className={`text-lg font-bold ${trend.trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`} title={`${trend.trend === 'up' ? 'Positive' : 'Negative'} sentiment trend`}>
              {trend.trend === 'up' ? '↑' : '↓'}
            </div>
          )}
        </div>

        <div className="flex flex-col items-end gap-2">
          <div className="text-sm text-gray-600 dark:text-gray-300">
            <div className="font-medium">{totalReviews}</div>
            <div className="text-xs">total reviews</div>
          </div>
          <div className={`text-xs font-medium px-2 py-1 rounded ${sentiment.color} bg-opacity-10`} aria-label={`Overall sentiment: ${sentiment.label}`}>
            {sentiment.icon} {sentiment.label}
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-200">By Source</h4>
          <ul className="mt-2 space-y-2">
            {sourceBreakdown && sourceBreakdown.length ? (
              sourceBreakdown.map((s) => {
                const sourceTrend = s.average >= 4 ? '↑' : s.average <= 2.5 ? '↓' : '→';
                return (
                  <li key={s.source} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded ${sourceBadgeClass(s.source)}`}>
                        {s.source}
                      </span>
                      <div className="text-sm text-gray-700 dark:text-gray-200">{s.count} reviews</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-sm text-gray-600 dark:text-gray-300">{s.average.toFixed(1)}★</div>
                      <div className="text-xs font-semibold" title={sourceTrend === '↑' ? 'Above average' : sourceTrend === '↓' ? 'Below average' : 'Average'}>
                        {sourceTrend}
                      </div>
                    </div>
                  </li>
                );
              })
            ) : (
              <li className="text-sm text-gray-500">No source data</li>
            )}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">Rating Distribution</h4>
          <div className="space-y-2">
            {histogram.rows.map((row) => (
              <div key={row.rating} className="flex items-center gap-2">
                <div className="w-6 text-sm text-gray-700 dark:text-gray-200 font-medium">{row.rating}★</div>
                <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      row.rating >= 4 ? 'bg-green-400' :
                      row.rating === 3 ? 'bg-yellow-400' :
                      'bg-red-400'
                    }`}
                    style={{ width: `${row.percent}%` }}
                    role="progressbar"
                    aria-valuenow={row.percent}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`${row.count} reviews (${row.percent}%)`} />
                </div>
                <div className="w-10 text-xs text-gray-600 dark:text-gray-300 text-right font-medium">{row.percent}%</div>
              </div>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {histogram.rows[0].percent >= 50 ? '✓ Most reviews are 5★' : 
               histogram.rows[4].percent >= 40 ? '⚠ Mix of ratings' : 
               '⚠ Lower ratings prevalent'}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

ReviewStats.propTypes = {
  loading: PropTypes.bool,
  stats: PropTypes.shape({
    overallAverage: PropTypes.number,
    totalReviews: PropTypes.number,
    sourceBreakdown: PropTypes.arrayOf(PropTypes.shape({
      source: PropTypes.string.isRequired,
      average: PropTypes.number.isRequired,
      count: PropTypes.number.isRequired,
    })),
    ratingHistogram: PropTypes.objectOf(PropTypes.number),
  }),
};

ReviewStats.defaultProps = {
  loading: false,
  stats: {
    overallAverage: 0,
    totalReviews: 0,
    sourceBreakdown: [],
    ratingHistogram: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  },
};
