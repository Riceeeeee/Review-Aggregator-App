import { useState, useCallback, useEffect } from 'react';

const rawBase = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api';
const API_BASE = rawBase.endsWith('/api') ? rawBase : `${rawBase.replace(/\/+$/, '')}/api`;

/**
 * Custom hook for managing product reviews and aggregated statistics
 * Provides methods to fetch reviews, trigger new review scraping, and get stats
 * 
 * @param {string} productId - The product ID to fetch reviews for
 * @returns {Object} Reviews, stats, loading states, and action methods
 */
export function useProductReviews(productId) {
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchingNew, setFetchingNew] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetch persisted reviews from backend
   */
  const fetchReviews = useCallback(async () => {
    if (!productId) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/products/${productId}/reviews`);
      if (!response.ok) throw new Error(`Failed to fetch reviews: ${response.statusText}`);
      const data = await response.json();
      setReviews(Array.isArray(data) ? data : data.reviews || []);
    } catch (err) {
      setError(err?.message || 'Failed to load reviews');
      setReviews([]);
    } finally {
      setLoading(false);
    }
  }, [productId]);

  /**
   * Fetch aggregated review statistics
   */
  const fetchStats = useCallback(async () => {
    if (!productId) return;
    try {
      const response = await fetch(`${API_BASE}/products/${productId}/aggregate`);
      if (!response.ok) throw new Error(`Failed to fetch stats: ${response.statusText}`);
      const data = await response.json();
      setStats(data);
    } catch (err) {
      setError(err?.message || 'Failed to load statistics');
      setStats(null);
    }
  }, [productId]);

  /**
   * Trigger review scraping from external sources
   */
  const triggerFetch = useCallback(async () => {
    if (!productId) return;
    setFetchingNew(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/products/${productId}/fetch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error(`Failed to fetch reviews: ${response.statusText}`);
      const data = await response.json();
      
      // Refresh both reviews and stats after fetching
      await fetchReviews();
      await fetchStats();
      
      return data;
    } catch (err) {
      setError(err?.message || 'Failed to trigger review fetch');
      throw err;
    } finally {
      setFetchingNew(false);
    }
  }, [productId, fetchReviews, fetchStats]);

  /**
   * Load initial data on mount or productId change
   */
  useEffect(() => {
    if (productId) {
      fetchReviews();
      fetchStats();
    }
  }, [productId, fetchReviews, fetchStats]);

  return {
    reviews,
    stats,
    loading,
    fetchingNew,
    error,
    fetchReviews,
    fetchStats,
    triggerFetch,
  };
}

export default useProductReviews;
