import React, { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import ProductHeader from './ProductHeader';
import ReviewFetcher from './ReviewFetcher';
import ReviewStats from './ReviewStats';
import ReviewList from './ReviewList';
import { fetchProductReviews, getReviewStats } from '../../services/mockReviewAPI';

export default function ReviewAggregatorPage({ productId }) {
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchingNew, setFetchingNew] = useState(false);
  const [error, setError] = useState(null);

  const loadInitial = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const fetched = await fetchProductReviews(productId);
      setReviews(fetched);
      const s = await getReviewStats(productId);
      // adapt stats shape to ReviewStats props
      const adapted = {
        overallAverage: s.averageRating || 0,
        totalReviews: s.count || 0,
        sourceBreakdown: Object.keys(s.sourceBreakdown || {}).map((src) => ({
          source: src,
          average: s.sourceBreakdown[src].averageRating || 0,
          count: s.sourceBreakdown[src].count || 0,
        })),
        ratingHistogram: s.ratingsCount || {},
      };
      setStats(adapted);
    } catch (err) {
      setError(err?.message || 'Failed to load reviews');
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    loadInitial();
  }, [loadInitial]);

  const handleNewReviews = async (newReviews) => {
    // Called when ReviewFetcher returns new reviews
    if (!Array.isArray(newReviews) || newReviews.length === 0) return;
    setFetchingNew(true);
    setError(null);
    try {
      // merge and keep most recent first by date
      const merged = [...newReviews, ...reviews];
      merged.sort((a, b) => new Date(b.date) - new Date(a.date));
      setReviews(merged);

      // refresh stats from API (simulated)
      const s = await getReviewStats(productId);
      const adapted = {
        overallAverage: s.averageRating || 0,
        totalReviews: s.count || 0,
        sourceBreakdown: Object.keys(s.sourceBreakdown || {}).map((src) => ({
          source: src,
          average: s.sourceBreakdown[src].averageRating || 0,
          count: s.sourceBreakdown[src].count || 0,
        })),
        ratingHistogram: s.ratingsCount || {},
      };
      setStats(adapted);
    } catch (err) {
      setError(err?.message || 'Failed to update stats');
    } finally {
      setFetchingNew(false);
    }
  };

  return (
    <main className="p-4 sm:p-6">
      <ProductHeader />

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Customer Reviews</h2>
            <div className="ml-4">
              <ReviewFetcher productId={productId} onReviewsFetched={handleNewReviews} />
            </div>
          </div>

          {error && (
            <div className="mt-3 text-sm text-red-700 bg-red-100 dark:bg-red-800 dark:text-red-200 px-3 py-2 rounded">
              {error}
            </div>
          )}

          <div className="mt-4">
            <ReviewList reviews={reviews} loading={loading} onFilterChange={() => {}} />
          </div>
        </div>

        <aside className="lg:col-span-1">
          <div className="sticky top-6">
            <ReviewStats stats={stats || {}} loading={loading || fetchingNew} />
          </div>
        </aside>
      </div>
    </main>
  );
}

ReviewAggregatorPage.propTypes = {
  productId: PropTypes.string,
};

ReviewAggregatorPage.defaultProps = {
  productId: '1',
};
