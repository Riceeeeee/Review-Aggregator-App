/**
 * Review API Routes
 * Handles fetching, storing, and aggregating product reviews
 */

import express from 'express';
import { fetchAndStoreReviews, fetchAndStoreWalmartApiReviews } from '../services/scraperService.js';
import {
  insertReviewsBatch,
  getReviewsByProduct,
  getAggregateStats,
} from '../database/reviews.js';

const router = express.Router();

/**
 * POST /api/products/:id/fetch
 * Trigger review fetching from scraper service and store in MySQL
 * 
 * Query params:
 * - sources: Comma-separated list of sources (default: amazon,bestbuy,walmart)
 * 
 * Response:
 * {
 *   success: boolean,
 *   message: string,
 *   data: {
 *     productId: string,
 *     totalFetched: number,
 *     inserted: number,
 *     duplicates: number,
 *     errors: string[]
 *   }
 * }
 */
router.post('/:id/fetch', async (req, res, next) => {
  try {
    const productId = req.params.id;
    const sourcesParam = req.query.sources;
    const sources = sourcesParam 
      ? sourcesParam.split(',').map(s => s.trim().toLowerCase())
      : ['amazon', 'bestbuy', 'walmart'];

    console.log(`\n🔄 [${new Date().toISOString()}] POST /api/products/${productId}/fetch`);
    console.log(`   Sources: ${sources.join(', ')}`);

    // Fetch from scraper service and store in database
    const result = await fetchAndStoreReviews(productId, sources, insertReviewsBatch);

    if (!result.success && result.totalFetched === 0) {
      return res.status(502).json({
        success: false,
        message: 'Failed to fetch reviews from scraper service',
        data: {
          productId,
          ...result,
        },
      });
    }

    res.json({
      success: true,
      message: `Fetched and stored ${result.inserted} new review(s), ${result.duplicates} duplicate(s)`,
      data: {
        productId,
        ...result,
      },
    });
  } catch (error) {
    console.error('❌ Error in POST /fetch:', error);
    next(error);
  }
});

/**
 * POST /api/products/:id/fetch-walmart
 * Pull reviews from ScraperAPI's structured Walmart endpoint using a random product_id,
 * transform them to our DB schema, and persist them for this product.
 */
router.post('/:id/fetch-walmart', async (req, res, next) => {
  try {
    const productId = req.params.id;

    console.log(`\ndY", [${new Date().toISOString()}] POST /api/products/${productId}/fetch-walmart`);

    const result = await fetchAndStoreWalmartApiReviews(productId, insertReviewsBatch);

    const status = result.success ? 200 : 502;
    const message = result.success
      ? `Fetched ${result.totalFetched} review(s) from Walmart API (inserted ${result.inserted}, duplicates ${result.duplicates})`
      : (result.errors && result.errors[0]) || 'Failed to fetch reviews from Walmart API';

    res.status(status).json({
      success: result.success,
      message,
      data: {
        productId,
        ...result,
      },
    });
  } catch (error) {
    console.error('�?O Error in POST /fetch-walmart:', error);
    next(error);
  }
});

/**
 * GET /api/products/:id/reviews
 * Get all persisted reviews for a product
 * 
 * Query params:
 * - limit: Max number of reviews to return (default: 100)
 * - offset: Number of reviews to skip (default: 0)
 * 
 * Response:
 * {
 *   success: boolean,
 *   data: Review[],
 *   meta: {
 *     total: number,
 *     returned: number
 *   }
 * }
 */
router.get('/:id/reviews', async (req, res, next) => {
  try {
    const productId = req.params.id;
    const limit = Math.min(100, parseInt(req.query.limit) || 100);
    const offset = Math.max(0, parseInt(req.query.offset) || 0);

    console.log(`\n📖 [${new Date().toISOString()}] GET /api/products/${productId}/reviews`);
    console.log(`   Limit: ${limit}, Offset: ${offset}`);

    let reviews = await getReviewsByProduct(productId);

    const total = reviews.length;
    const returned = reviews.slice(offset, offset + limit).length;

    // Apply pagination
    if (offset || limit < reviews.length) {
      reviews = reviews.slice(offset, offset + limit);
    }

    // Transform database format to API format
    const transformedReviews = reviews.map((review) => ({
      id: review.review_id,
      productId: review.product_id,
      source: review.source,
      author: review.author,
      rating: review.rating,
      title: review.title,
      content: review.body,
      date: review.created_at,
      fetchedAt: review.fetched_at,
      flagged: !!review.flagged,
      moderationStatus: review.moderation_status || 'approved',
      verifiedPurchase: !!review.verified_purchase,
    }));

    console.log(`   ✅ Found ${returned} reviews (${total} total)`);

    res.json({
      success: true,
      data: transformedReviews,
      meta: {
        total,
        returned,
        limit,
        offset,
      },
    });
  } catch (error) {
    console.error('❌ Error in GET /reviews:', error);
    next(error);
  }
});

/**
 * GET /api/products/:id/aggregate
 * Get aggregated review statistics for a product
 * 
 * Response:
 * {
 *   success: boolean,
 *   data: {
 *     overallAverage: number,
 *     totalReviews: number,
 *     sourceBreakdown: [
 *       { source: string, average: number, count: number }
 *     ],
 *     ratingHistogram: {
 *       1: number,
 *       2: number,
 *       3: number,
 *       4: number,
 *       5: number
 *     }
 *   }
 * }
 */
router.get('/:id/aggregate', async (req, res, next) => {
  try {
    const productId = req.params.id;

    console.log(`\n📊 [${new Date().toISOString()}] GET /api/products/${productId}/aggregate`);

    const stats = await getAggregateStats(productId);

    console.log(`   ✅ Average: ${stats.overallAverage}, Total: ${stats.totalReviews} reviews`);

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error('❌ Error in GET /aggregate:', error);
    next(error);
  }
});

export default router;
