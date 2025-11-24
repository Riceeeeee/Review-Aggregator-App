/**
 * Review Scraper Service
 * Handles fetching reviews from the scraper microservice and storing them in MySQL
 */

import http from 'http';
import https from 'https';
import { createHash } from 'crypto';

const SCRAPER_SERVICE_HOST = process.env.SCRAPER_SERVICE_HOST || 'localhost';
const SCRAPER_SERVICE_PORT = process.env.SCRAPER_SERVICE_PORT || 3001;
const SCRAPER_API_KEY = process.env.SCRAPERAPI_KEY || '4d38e8c86599e64c1a6c02fb14c29a4f';
const SCRAPER_WALMART_PRODUCT_IDS = (process.env.SCRAPERAPI_WALMART_IDS || '14103120248,971375923,13587770398,1462448997,766641944')
  .split(',')
  .map(id => id.trim())
  .filter(Boolean);

/**
 * Fetch reviews from scraper service
 * @param {string} productId - Product ID to fetch reviews for
 * @param {string} source - Specific source to fetch from (optional)
 * @returns {Promise<Array>} Array of reviews
 */
export async function fetchReviewsFromScraper(productId, source = null) {
  return new Promise((resolve, reject) => {
    let path = `/api/scrape/reviews/${productId}`;
    if (source) {
      path += `?source=${encodeURIComponent(source)}`;
    }

    const options = {
      hostname: SCRAPER_SERVICE_HOST,
      port: SCRAPER_SERVICE_PORT,
      path,
      method: 'GET',
      timeout: 30000,
    };

    const req = http.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          if (res.statusCode !== 200) {
            return reject(
              new Error(`Scraper service returned ${res.statusCode}: ${data}`)
            );
          }

          const parsed = JSON.parse(data);

          // 🔧 SỬA Ở ĐÂY:
          const reviews = parsed.data || parsed.reviews || [];

          if (!Array.isArray(reviews)) {
            return reject(
              new Error('Unexpected scraper response format: reviews is not an array')
            );
          }

          resolve(reviews);
        } catch (error) {
          reject(new Error(`Failed to parse scraper response: ${error.message}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(new Error(`Failed to connect to scraper service: ${error.message}`));
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Scraper service request timeout'));
    });

    req.end();
  });
}

/**
 * Transform scraper review format to database format
 * @param {Object} scraperReview - Review from scraper service
 * @param {string} productId - Product ID
 * @param {string} source - Source platform
 * @returns {Object} Transformed review
 */
export function transformScraperReview(scraperReview, productId, source) {
  return {
    productId,
    source,
    reviewId: scraperReview.id || scraperReview.review_id || `${source}-${Date.now()}`,
    author: scraperReview.author,
    rating: parseInt(scraperReview.rating) || 0,
    title: scraperReview.title,
    body: scraperReview.content || scraperReview.body,
    createdAt: scraperReview.date ? new Date(scraperReview.date) : new Date(),
  };
}

/**
 * Fetch and store reviews for a product
 * @param {string} productId - Product ID
 * @param {Array<string>} sources - Array of sources to fetch from (default: all)
 * @param {Function} insertBatch - Function to insert batch of reviews
 * @returns {Promise<Object>} Result object with counts
 */
export async function fetchAndStoreReviews(productId, sources = null, insertBatch) {
  const sourcesToFetch = sources || ['amazon', 'bestbuy', 'walmart'];
  const allReviews = [];
  const errors = [];

  console.log(`📥 Fetching reviews for product ${productId} from sources: ${sourcesToFetch.join(', ')}`);

  // Fetch from each source
  for (const source of sourcesToFetch) {
    try {
      console.log(`  → Fetching from ${source}...`);
      const reviews = await fetchReviewsFromScraper(productId, source);
      
      // Transform reviews to database format
      const transformed = reviews.map((review) =>
        transformScraperReview(review, productId, source)
      );

      allReviews.push(...transformed);
      console.log(`  ✅ Got ${reviews.length} reviews from ${source}`);
    } catch (error) {
      const errorMsg = `Failed to fetch from ${source}: ${error.message}`;
      console.error(`  ❌ ${errorMsg}`);
      errors.push(errorMsg);
      // Continue with other sources even if one fails
    }
  }

  if (allReviews.length === 0) {
    console.warn(`⚠️  No reviews fetched for product ${productId}`);
    return {
      success: false,
      totalFetched: 0,
      inserted: 0,
      duplicates: 0,
      errors,
    };
  }

  // Store in database
  try {
    console.log(`💾 Storing ${allReviews.length} reviews in database...`);
    const result = await insertBatch(allReviews);
    
    console.log(`✅ Successfully stored reviews:`, {
      inserted: result.insertedCount,
      duplicates: result.duplicateCount,
      total: result.affectedRows,
    });

    return {
      success: true,
      totalFetched: allReviews.length,
      inserted: result.insertedCount,
      duplicates: result.duplicateCount,
      errors,
    };
  } catch (error) {
    console.error(`❌ Failed to store reviews: ${error.message}`);
    return {
      success: false,
      totalFetched: allReviews.length,
      inserted: 0,
      duplicates: 0,
      errors: [...errors, `Storage failed: ${error.message}`],
    };
  }
}

// ---------------------------------------------------------------------------
// Walmart Structured API (ScraperAPI) helper
// ---------------------------------------------------------------------------

function pickRandomWalmartProductId() {
  if (!SCRAPER_WALMART_PRODUCT_IDS.length) return null;
  const idx = Math.floor(Math.random() * SCRAPER_WALMART_PRODUCT_IDS.length);
  return SCRAPER_WALMART_PRODUCT_IDS[idx];
}

function parseDate(dateString) {
  if (!dateString) return new Date();
  const parsed = new Date(dateString);
  return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
}

function buildReviewId(review) {
  const base = `${review.author || 'anonymous'}|${review.date_published || ''}|${review.text || review.title || ''}|${review.rating || ''}`;
  const hash = createHash('sha256').update(base).digest('hex').slice(0, 16);
  return `walmart-${hash}`;
}

export async function fetchAndStoreWalmartApiReviews(localProductId, insertBatch) {
  const externalProductId = pickRandomWalmartProductId();
  if (!externalProductId) {
    return {
      success: false,
      totalFetched: 0,
      inserted: 0,
      duplicates: 0,
      errors: ['No Walmart product ids configured'],
      externalProductId: null,
    };
  }
  const url = new URL('https://api.scraperapi.com/structured/walmart/review/v1');
  url.searchParams.set('api_key', SCRAPER_API_KEY);
  url.searchParams.set('product_id', externalProductId);

  return new Promise((resolve) => {
    const req = https.get(url, (res) => {
      let data = '';

      res.on('data', chunk => {
        data += chunk;
      });

      res.on('end', async () => {
        try {
          if (res.statusCode < 200 || res.statusCode >= 300) {
            return resolve({
              success: false,
              totalFetched: 0,
              inserted: 0,
              duplicates: 0,
              errors: [`ScraperAPI returned status ${res.statusCode}`],
              externalProductId,
            });
          }

          const parsed = JSON.parse(data);
          const reviewsArray = Array.isArray(parsed.reviews) ? parsed.reviews : [];

          if (reviewsArray.length === 0) {
            return resolve({
              success: false,
              totalFetched: 0,
              inserted: 0,
              duplicates: 0,
              errors: ['No reviews returned from ScraperAPI'],
              externalProductId,
            });
          }

          const mapped = reviewsArray.map((review) => {
            const rating = Math.min(5, Math.max(1, Number(review.rating) || 1));
            const verified =
              Array.isArray(review.badges) &&
              review.badges.some(badge => String(badge).toLowerCase() === 'verified purchase');

            return {
              productId: localProductId,
              source: 'walmart_api',
              reviewId: buildReviewId(review),
              author: review.author || 'Anonymous',
              rating,
              title: review.title || parsed.product_name || 'Walmart Review',
              body: review.text || review.content || '',
              createdAt: parseDate(review.date_published || review.date || parsed.date_published),
              verifiedPurchase: verified,
            };
          });

          try {
            const result = await insertBatch(mapped);
            return resolve({
              success: true,
              totalFetched: mapped.length,
              inserted: result.insertedCount,
              duplicates: result.duplicateCount,
              errors: [],
              externalProductId,
            });
          } catch (dbErr) {
            return resolve({
              success: false,
              totalFetched: mapped.length,
              inserted: 0,
              duplicates: 0,
              errors: [`Failed to store reviews: ${dbErr.message}`],
              externalProductId,
            });
          }
        } catch (err) {
          return resolve({
            success: false,
            totalFetched: 0,
            inserted: 0,
            duplicates: 0,
            errors: [`Failed to parse ScraperAPI response: ${err.message}`],
            externalProductId,
          });
        }
      });
    });

    req.on('error', (err) => {
      return resolve({
        success: false,
        totalFetched: 0,
        inserted: 0,
        duplicates: 0,
        errors: [`Network error calling ScraperAPI: ${err.message}`],
        externalProductId,
      });
    });
  });
}
