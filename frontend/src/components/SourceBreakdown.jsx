import React from 'react';
import PropTypes from 'prop-types';

/**
 * Get badge color based on source
 */
const getSourceColor = (source) => {
  switch ((source || '').toLowerCase()) {
    case 'amazon':
      return { bg: 'bg-orange-100 dark:bg-orange-900', text: 'text-orange-800 dark:text-orange-200', bar: 'bg-orange-500' };
    case 'bestbuy':
      return { bg: 'bg-blue-100 dark:bg-blue-900', text: 'text-blue-800 dark:text-blue-200', bar: 'bg-blue-500' };
    case 'walmart':
      return { bg: 'bg-green-100 dark:bg-green-900', text: 'text-green-800 dark:text-green-200', bar: 'bg-green-500' };
    default:
      return { bg: 'bg-gray-100 dark:bg-gray-700', text: 'text-gray-800 dark:text-gray-200', bar: 'bg-gray-500' };
  }
};

/**
 * SourceBreakdown Component
 * 
 * Displays a table/chart of average ratings per platform with:
 * - Source name and badge
 * - Number of reviews per source
 * - Average rating per source
 * - Visual bar chart representation
 * - Click to filter by source
 */
export default function SourceBreakdown({
  sourceBreakdown = [],
  selectedSource = null,
  onSourceSelect = () => {},
}) {
  if (!sourceBreakdown || sourceBreakdown.length === 0) {
    return null;
  }

  // Sort by average rating descending
  const sortedSources = [...sourceBreakdown].sort((a, b) => 
    (b.average || 0) - (a.average || 0)
  );

  const maxRating = 5;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Rating by Source
      </h3>

      <div className="space-y-4">
        {sortedSources.map((item) => {
          const colors = getSourceColor(item.source);
          const percentage = (item.average / maxRating) * 100;

          return (
            <div
              key={item.source}
              onClick={() => onSourceSelect(item.source)}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                selectedSource === item.source
                  ? `${colors.bg} border-current`
                  : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
              }`}
            >
              {/* Header: Source name and review count */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${colors.bg} ${colors.text}`}>
                    {item.source}
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {item.count} review{item.count !== 1 ? 's' : ''}
                  </span>
                </div>
                <div className="text-lg font-bold text-gray-900 dark:text-white">
                  {item.average ? item.average.toFixed(1) : 'N/A'}
                </div>
              </div>

              {/* Visual bar chart */}
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${colors.bar} transition-all`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 w-10 text-right">
                  {percentage.toFixed(0)}%
                </div>
              </div>

              {/* Star rating display */}
              <div className="mt-2 flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span
                    key={i}
                    className={`text-sm ${
                      i < Math.round(item.average)
                        ? 'text-yellow-400'
                        : 'text-gray-300 dark:text-gray-600'
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Info text */}
      <p className="mt-4 text-xs text-gray-500 dark:text-gray-400">
        Click on a source to filter reviews by that platform
      </p>
    </div>
  );
}

SourceBreakdown.propTypes = {
  sourceBreakdown: PropTypes.arrayOf(
    PropTypes.shape({
      source: PropTypes.string.isRequired,
      average: PropTypes.number,
      count: PropTypes.number,
    })
  ),
  selectedSource: PropTypes.string,
  onSourceSelect: PropTypes.func,
};
