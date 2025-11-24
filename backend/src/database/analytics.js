import pool from '../db.js';

// Converts MySQL Date objects into YYYY-MM-DD strings for chart axes
function normalizeDate(value) {
  if (!value) return null;
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10);
  }
  return value;
}

/**
 * Build an analytics overview used by the dashboard.
 * Returns totals, source mix, rating histogram, timeline data, and top products.
 */
export async function getAnalyticsOverview(options = {}) {
  const days = Math.min(Math.max(parseInt(options.days, 10) || 90, 7), 365);
  const histogram = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

  // Overall summary
  const [summaryRows] = await pool.query(
    `
      SELECT 
        COUNT(*) AS totalReviews,
        COUNT(DISTINCT product_id) AS productsWithReviews,
        ROUND(AVG(rating), 2) AS averageRating,
        MAX(fetched_at) AS lastIngestedAt
      FROM reviews
    `,
  );
  const summary = summaryRows?.[0] || {};

  // Source mix (volume + avg rating)
  const [sourceRows] = await pool.query(
    `
      SELECT 
        source, 
        COUNT(*) AS count, 
        ROUND(AVG(rating), 2) AS averageRating
      FROM reviews
      GROUP BY source
      ORDER BY count DESC
    `,
  );

  // Rating histogram (1-5 stars)
  const [histogramRows] = await pool.query(
    `
      SELECT rating, COUNT(*) AS count
      FROM reviews
      GROUP BY rating
    `,
  );
  for (const row of histogramRows) {
    if (histogram[row.rating] !== undefined) {
      histogram[row.rating] = row.count;
    }
  }

  // Timeline (count + avg rating per day)
  const [timelineRows] = await pool.query(
    `
      SELECT 
        DATE(COALESCE(created_at, fetched_at)) AS bucket,
        COUNT(*) AS count,
        ROUND(AVG(rating), 2) AS averageRating
      FROM reviews
      WHERE (created_at IS NOT NULL OR fetched_at IS NOT NULL)
        AND DATE(COALESCE(created_at, fetched_at)) >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
      GROUP BY bucket
      ORDER BY bucket ASC
    `,
    [days],
  );

  // Activity by source (stacked area/columns)
  const [sourceActivityRows] = await pool.query(
    `
      SELECT 
        source,
        DATE(COALESCE(created_at, fetched_at)) AS bucket,
        COUNT(*) AS count
      FROM reviews
      WHERE (created_at IS NOT NULL OR fetched_at IS NOT NULL)
        AND DATE(COALESCE(created_at, fetched_at)) >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
      GROUP BY source, bucket
      ORDER BY bucket ASC
    `,
    [days],
  );

  // Top products by review volume (with average rating)
  const [topProducts] = await pool.query(
    `
      SELECT 
        p.id,
        p.name,
        p.price,
        p.category_id AS categoryId,
        COUNT(r.id) AS reviewCount,
        ROUND(AVG(r.rating), 2) AS averageRating,
        MIN(COALESCE(r.created_at, r.fetched_at)) AS firstReviewAt,
        MAX(COALESCE(r.created_at, r.fetched_at)) AS lastReviewAt
      FROM reviews r
      JOIN products p ON p.id = r.product_id
      GROUP BY p.id
      HAVING reviewCount > 0
      ORDER BY reviewCount DESC, averageRating DESC
      LIMIT 6
    `,
  );

  return {
    totals: {
      totalReviews: summary.totalReviews || 0,
      productsWithReviews: summary.productsWithReviews || 0,
      averageRating: Number(summary.averageRating) || 0,
      lastIngestedAt: summary.lastIngestedAt,
    },
    sourceMix: sourceRows.map(row => ({
      source: row.source,
      count: row.count,
      averageRating: Number(row.averageRating) || 0,
    })),
    ratingHistogram: histogram,
    timeline: timelineRows.map(row => ({
      date: normalizeDate(row.bucket),
      count: row.count,
      averageRating: Number(row.averageRating) || 0,
    })),
    activityBySource: sourceActivityRows.map(row => ({
      source: row.source,
      date: normalizeDate(row.bucket),
      count: row.count,
    })),
    topProducts: topProducts.map(row => ({
      id: row.id,
      name: row.name,
      price: row.price,
      reviewCount: row.reviewCount,
      averageRating: Number(row.averageRating) || 0,
      firstReviewAt: row.firstReviewAt,
      lastReviewAt: row.lastReviewAt,
    })),
  };
}
