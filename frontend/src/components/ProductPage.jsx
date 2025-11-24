import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useProductReviews } from '../hooks/useProductReviews';
import ReviewList from './reviews/ReviewList';
import ReviewStats from './reviews/ReviewStats';
import SourceBreakdown from './SourceBreakdown';

/**
 * ProductPage Component
 * 
 * Displays:
 * - Product name and basic info
 * - "Fetch Reviews" button to trigger review scraping
 * - Overall average rating and total review count
 * - Review statistics (histogram, source breakdown)
 * - List of individual reviews with filtering/pagination
 */
export default function ProductPage({ productId, productName, productImage }) {
  const { reviews, stats, loading, fetchingNew, error, triggerFetch } = useProductReviews(productId);
  const [selectedSource, setSelectedSource] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter reviews by selected source
  const filteredReviews = selectedSource
    ? reviews.filter(r => r.source === selectedSource)
    : reviews;

  // Paginate filtered reviews
  const totalPages = Math.ceil(filteredReviews.length / itemsPerPage);
  const paginatedReviews = filteredReviews.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleFetchReviews = async () => {
    try {
      await triggerFetch();
      setCurrentPage(1); // Reset to first page after fetching
    } catch (err) {
      console.error('Failed to fetch reviews:', err);
    }
  };

  const handleSourceFilter = (source) => {
    setSelectedSource(selectedSource === source ? null : source);
    setCurrentPage(1); // Reset pagination when filtering
  };

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Product Header Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-6">
            
            {/* Product Image */}
            {productImage && (
              <div className="flex-shrink-0">
                <img
                  src={productImage}
                  alt={productName}
                  className="w-32 h-32 object-cover rounded-lg bg-gray-100 dark:bg-gray-700"
                />
              </div>
            )}

            {/* Product Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {productName || `Product ${productId}`}
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Product ID: {productId}
              </p>

              {/* Quick Stats */}
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="bg-blue-50 dark:bg-blue-900 px-4 py-3 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-300">Average Rating</p>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {stats?.overallAverage ? `${stats.overallAverage.toFixed(1)} ⭐` : 'N/A'}
                  </p>
                </div>
                <div className="bg-green-50 dark:bg-green-900 px-4 py-3 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-300">Total Reviews</p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {stats?.totalReviews || 0}
                  </p>
                </div>
              </div>

              {/* Fetch Reviews Button */}
              <button
                onClick={handleFetchReviews}
                disabled={fetchingNew || loading}
                className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                  fetchingNew || loading
                    ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white'
                }`}
              >
                {fetchingNew ? 'Fetching Reviews...' : 'Fetch Reviews'}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-3 bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-700 dark:text-red-200 text-sm">{error}</p>
            </div>
          )}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Left Column: Reviews List */}
          <div className="lg:col-span-3">
            <div className="space-y-6">
              
              {/* Source Breakdown */}
              {stats?.sourceBreakdown && stats.sourceBreakdown.length > 0 && (
                <SourceBreakdown
                  sourceBreakdown={stats.sourceBreakdown}
                  selectedSource={selectedSource}
                  onSourceSelect={handleSourceFilter}
                />
              )}

              {/* Reviews List Header */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Reviews {selectedSource && `from ${selectedSource}`}
                  </h2>
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {filteredReviews.length} review{filteredReviews.length !== 1 ? 's' : ''}
                  </span>
                </div>

                {/* Reviews List */}
                <ReviewList
                  reviews={paginatedReviews}
                  loading={loading}
                  onFilterChange={() => {}}
                />

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-6 flex items-center justify-center gap-2">
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    >
                      ← Previous
                    </button>
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    >
                      Next →
                    </button>
                  </div>
                )}

                {filteredReviews.length === 0 && !loading && (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    {selectedSource ? 'No reviews found for this source' : 'No reviews yet. Fetch some to get started!'}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Stats Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-6">
              <ReviewStats
                stats={stats || {}}
                loading={loading || fetchingNew}
              />
            </div>
          </aside>

        </div>
      </div>
    </main>
  );
}

ProductPage.propTypes = {
  productId: PropTypes.string.isRequired,
  productName: PropTypes.string,
  productImage: PropTypes.string,
};

ProductPage.defaultProps = {
  productName: 'Wireless Headphones',
  productImage: null,
};
