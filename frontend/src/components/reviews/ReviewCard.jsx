import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';

/**
 * Utility: render star string like ★★★★☆ for a rating 1-5
 * @param {number} rating
 * @returns {string}
 */
const renderStars = (rating) => {
  const filled = '★'.repeat(Math.max(0, Math.min(5, Math.round(rating))));
  const empty = '☆'.repeat(5 - filled.length);
  return filled + empty;
};

/**
 * Utility: relative time (very small implementation)
 * @param {string} isoDate
 * @returns {string}
 */
const relativeDate = (isoDate) => {
  try {
    const now = new Date();
    const d = new Date(isoDate);
    const diff = Math.floor((now - d) / 1000); // seconds
    if (diff < 60) return `${diff} second${diff === 1 ? '' : 's'} ago`;
    const mins = Math.floor(diff / 60);
    if (mins < 60) return `${mins} minute${mins === 1 ? '' : 's'} ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days} day${days === 1 ? '' : 's'} ago`;
    const months = Math.floor(days / 30);
    if (months < 12) return `${months} month${months === 1 ? '' : 's'} ago`;
    const years = Math.floor(months / 12);
    return `${years} year${years === 1 ? '' : 's'} ago`;
  } catch (e) {
    return isoDate;
  }
};

/**
 * Map source to Tailwind badge color classes
 */
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
 * ReviewCard
 * @param {{review: {id:string|number, source:string, author:string, rating:number, title:string, content:string, date:string}}} props
 */
export default function ReviewCard({ review }) {
  const [expanded, setExpanded] = useState(false);

  const { id, source, author, rating, title, content, date } = review;

  const shortContent = useMemo(() => {
    if (!content) return '';
    const max = 220; // characters before truncation
    return content.length > max ? content.slice(0, max).trim() + '…' : content;
  }, [content]);

  const needsTruncate = content && content.length > 220;

  return (
    <article
      aria-labelledby={`review-title-${id}`}
      className="w-full max-w-2xl mx-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 sm:p-6 shadow-sm my-3">
      <header className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded ${sourceBadgeClass(
                  source,
                )}`}
                aria-label={`Source: ${source}`}>
                {source}
              </span>
              <div
                className="text-yellow-500 text-sm font-medium"
                aria-hidden="true"
                title={`${rating} out of 5`}>{renderStars(rating)}</div>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-300 mt-1">
              <span className="font-medium text-gray-700 dark:text-gray-200">{author}</span>
              <span className="mx-1">•</span>
              <time dateTime={date}>{relativeDate(date)}</time>
            </div>
          </div>
        </div>
      </header>

      <section className="mt-3">
        <h3 id={`review-title-${id}`} className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100">
          {title}
        </h3>

        <div className="mt-2 text-sm text-gray-700 dark:text-gray-200 leading-relaxed">
          <p aria-label={`Review content for ${author}`}>
            {expanded || !needsTruncate ? content : shortContent}
          </p>

          {needsTruncate && (
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className="mt-2 text-sm text-blue-600 hover:underline focus:outline-none"
              aria-expanded={expanded}
              aria-controls={`review-content-${id}`}>
              {expanded ? 'Read less' : 'Read more'}
            </button>
          )}
        </div>
      </section>
    </article>
  );
}

ReviewCard.propTypes = {
  review: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    source: PropTypes.oneOf(['Amazon', 'BestBuy', 'Walmart']).isRequired,
    author: PropTypes.string.isRequired,
    rating: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
  }).isRequired,
};
