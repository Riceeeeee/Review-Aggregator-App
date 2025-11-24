import React, { useState, useMemo, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import ReviewCard from './ReviewCard';

function SkeletonCard() {
  return (
    <div className="w-full max-w-2xl mx-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 sm:p-6 shadow-sm my-3 animate-pulse">
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-3" />
      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-2" />
      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-full" />
    </div>
  );
}

/**
 * Highlight matching text in a string
 * @param {string} text - Original text
 * @param {string} query - Search query
 * @returns {JSX.Element|string}
 */
function HighlightText({ text, query }) {
  if (!query || !text) return text;
  const parts = text.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'));
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <mark key={i} className="bg-yellow-200 dark:bg-yellow-700">
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  );
}

const REVIEWS_PER_PAGE = 10;
const SEARCH_DEBOUNCE_MS = 300;

export default function ReviewList({ reviews, loading, onFilterChange }) {
  const [sourceFilter, setSourceFilter] = useState('All');
  const [ratingFilter, setRatingFilter] = useState('All');
  const [sortBy, setSortBy] = useState('date-newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const searchTimeoutRef = useRef(null);

  useEffect(() => {
    // Debounce search input
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(() => {
      setSearchQuery(searchInput);
      setCurrentPage(1); // reset to page 1 when search changes
    }, SEARCH_DEBOUNCE_MS);
    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    };
  }, [searchInput]);

  useEffect(() => {
    if (typeof onFilterChange === 'function') onFilterChange({ source: sourceFilter, rating: ratingFilter });
    setCurrentPage(1); // reset to page 1 when filters change
  }, [sourceFilter, ratingFilter, onFilterChange]);

  const filtered = useMemo(() => {
    let out = Array.isArray(reviews) ? reviews.slice() : [];
    
    // Apply filters
    if (sourceFilter && sourceFilter !== 'All') {
      out = out.filter((r) => (r.source || '').toLowerCase() === sourceFilter.toLowerCase());
    }
    if (ratingFilter && ratingFilter !== 'All') {
      if (ratingFilter === '5') out = out.filter((r) => r.rating === 5);
      else if (ratingFilter.endsWith('+')) {
        const min = parseInt(ratingFilter.replace('+', ''), 10);
        out = out.filter((r) => r.rating >= min);
      }
    }

    // Apply search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      out = out.filter((r) => 
        (r.title && r.title.toLowerCase().includes(q)) ||
        (r.content && r.content.toLowerCase().includes(q))
      );
    }

    // Apply sorting
    if (sortBy === 'date-newest') {
      out.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (sortBy === 'date-oldest') {
      out.sort((a, b) => new Date(a.date) - new Date(b.date));
    } else if (sortBy === 'rating-highest') {
      out.sort((a, b) => b.rating - a.rating || new Date(b.date) - new Date(a.date));
    } else if (sortBy === 'rating-lowest') {
      out.sort((a, b) => a.rating - b.rating || new Date(b.date) - new Date(a.date));
    } else if (sortBy === 'source-az') {
      out.sort((a, b) => (a.source || '').localeCompare(b.source || '') || new Date(b.date) - new Date(a.date));
    }

    return out;
  }, [reviews, sourceFilter, ratingFilter, sortBy, searchQuery]);

  const totalPages = Math.ceil(filtered.length / REVIEWS_PER_PAGE);
  const startIdx = (currentPage - 1) * REVIEWS_PER_PAGE;
  const endIdx = startIdx + REVIEWS_PER_PAGE;
  const paginatedReviews = filtered.slice(startIdx, endIdx);

  return (
    <section aria-label="Product reviews" className="space-y-4">
      <div className="flex flex-col gap-4">
        <div className="w-full">
          <label htmlFor="search-reviews" className="text-sm font-medium text-gray-700 dark:text-gray-200">Search reviews</label>
          <input
            id="search-reviews"
            type="text"
            placeholder="Search by title or content..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full mt-1 px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label="Search reviews by title or content" />
          {searchQuery && (
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Found <span className="font-medium">{filtered.length}</span> result{filtered.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <label htmlFor="source-filter" className="text-sm font-medium text-gray-700 dark:text-gray-200">Source</label>
              <select
                id="source-filter"
                value={sourceFilter}
                onChange={(e) => setSourceFilter(e.target.value)}
                className="rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm p-1"
                aria-label="Filter reviews by source">
                <option>All</option>
                <option>Amazon</option>
                <option>BestBuy</option>
                <option>Walmart</option>
              </select>

              <label htmlFor="rating-filter" className="text-sm font-medium text-gray-700 dark:text-gray-200">Rating</label>
              <select
                id="rating-filter"
                value={ratingFilter}
                onChange={(e) => setRatingFilter(e.target.value)}
                className="rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm p-1"
                aria-label="Filter reviews by rating">
                <option value="All">All</option>
                <option value="5">5★</option>
                <option value="4+">4★+</option>
                <option value="3+">3★+</option>
                <option value="2+">2★+</option>
                <option value="1+">1★</option>
              </select>
            </div>

            <div className="text-sm text-gray-600 dark:text-gray-300">
              Showing <span className="font-medium">{filtered.length}</span> of <span className="font-medium">{(reviews || []).length}</span> reviews
            </div>
          </div>

          <div className="flex items-center gap-3">
            <label htmlFor="sort-by" className="text-sm font-medium text-gray-700 dark:text-gray-200">Sort by</label>
            <select
              id="sort-by"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm p-1"
              aria-label="Sort reviews">
              <option value="date-newest">Newest First</option>
              <option value="date-oldest">Oldest First</option>
              <option value="rating-highest">Highest Rating</option>
              <option value="rating-lowest">Lowest Rating</option>
              <option value="source-az">Source (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      <div>
        {loading ? (
          <div className="space-y-2">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : filtered && filtered.length ? (
          <>
            <div className="space-y-2">
              {paginatedReviews.map((r) => (
                <div key={r.id} className="group">
                  <ReviewCard review={r} />
                  {searchQuery && (
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 ml-1">
                      {(r.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        r.content?.toLowerCase().includes(searchQuery.toLowerCase())) && (
                        <p className="italic">
                          Matched in: {r.title?.toLowerCase().includes(searchQuery.toLowerCase()) ? 'title' : ''}{' '}
                          {r.title?.toLowerCase().includes(searchQuery.toLowerCase()) &&
                          r.content?.toLowerCase().includes(searchQuery.toLowerCase())
                            ? '& content'
                            : r.content?.toLowerCase().includes(searchQuery.toLowerCase())
                              ? 'content'
                              : ''}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  Page <span className="font-medium">{currentPage}</span> of <span className="font-medium">{totalPages}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 rounded-md text-sm bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 dark:hover:bg-gray-600">
                    Previous
                  </button>

                  <div className="flex gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        type="button"
                        onClick={() => setCurrentPage(page)}
                        className={`px-2 py-1 rounded-md text-sm ${
                          currentPage === page
                            ? 'bg-indigo-600 text-white'
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
                        }`}
                        aria-current={currentPage === page ? 'page' : undefined}>
                        {page}
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 rounded-md text-sm bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 dark:hover:bg-gray-600">
                    Next
                  </button>
                </div>

                {currentPage < totalPages && (
                  <button
                    type="button"
                    onClick={() => setCurrentPage(currentPage + 1)}
                    className="px-4 py-2 rounded-md text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700">
                    Load More
                  </button>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="w-full max-w-2xl mx-auto bg-white dark:bg-gray-800 border border-dashed border-gray-300 dark:border-gray-700 rounded-md p-6 text-center text-gray-600 dark:text-gray-300">
            No reviews match your filters.
          </div>
        )}
      </div>
    </section>
  );
}

ReviewList.propTypes = {
  reviews: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    source: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    rating: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
  })),
  loading: PropTypes.bool,
  onFilterChange: PropTypes.func,
};

ReviewList.defaultProps = {
  reviews: [],
  loading: false,
  onFilterChange: () => {},
};
