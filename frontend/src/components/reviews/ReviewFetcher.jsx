import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';


function Spinner({ size = 20 }) {
  return (
    <svg
      className="animate-spin text-white"
      style={{ width: size, height: size }}
      viewBox="0 0 24 24"
      aria-hidden="true">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
  );
}

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api';

export default function ReviewFetcher({ productId, onReviewsFetched }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const clearMessagesLater = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setMessage(null);
      setError(null);
    }, 3000);
  };

  const handleFetch = async () => {
    setLoading(true);
    setMessage(null);
    setError(null);
    try {
      // Call the real backend API endpoint
      const response = await fetch(`${API_BASE}/products/${productId}/fetch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error(`API error: ${response.statusText}`);
      const data = await response.json();
      const newReviews = data.newReviews || [];
      const count = Array.isArray(newReviews) ? newReviews.length : 0;
      setMessage(`Fetched ${count} new review${count === 1 ? '' : 's'}!`);
      if (typeof onReviewsFetched === 'function') onReviewsFetched(newReviews);
      clearMessagesLater();
    } catch (err) {
      setError(err?.message || 'Failed to fetch reviews');
      clearMessagesLater();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleFetch}
          disabled={loading}
          className={`inline-flex items-center px-4 py-2 rounded-md font-semibold text-white ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500'} focus:outline-none`}>
          {loading ? <Spinner size={18} /> : null}
          <span className="ml-2">{loading ? 'Fetching...' : 'Fetch Reviews'}</span>
        </button>

        <div className="flex-1">
          {loading && (
            <div className="mt-1 h-2 w-full bg-gray-200 dark:bg-gray-700 rounded overflow-hidden">
              <div className="h-2 bg-indigo-500 animate-[pulse_1.5s_infinite]" style={{ width: '40%' }} />
            </div>
          )}

          {!loading && message && (
            <div className="mt-2 text-sm text-green-700 bg-green-100 dark:bg-green-800 dark:text-green-200 px-3 py-1 rounded" role="status">
              {message}
            </div>
          )}

          {!loading && error && (
            <div className="mt-2 text-sm text-red-700 bg-red-100 dark:bg-red-800 dark:text-red-200 px-3 py-1 rounded" role="alert">
              <div className="flex items-center justify-between gap-3">
                <span>{error}</span>
                <button type="button" onClick={handleFetch} className="text-sm font-medium text-red-700 underline">Retry</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

ReviewFetcher.propTypes = {
  productId: PropTypes.string.isRequired,
  onReviewsFetched: PropTypes.func,
};

ReviewFetcher.defaultProps = {
  onReviewsFetched: () => {},
};
