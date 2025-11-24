/**
 * Database helpers for reviews table operations
 * Handles initialization, inserts, queries, and aggregations
 */

import pool from '../db.js';

/**
 * Initialize reviews table if it doesn't exist
 * Called on backend startup
 */
export async function initializeReviewsTable() {
  try {
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS reviews (
        id INT AUTO_INCREMENT PRIMARY KEY,
        product_id VARCHAR(50) NOT NULL,
        source VARCHAR(50) NOT NULL,
        review_id VARCHAR(100) NOT NULL,
        author VARCHAR(100),
        rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
        title VARCHAR(255),
        body TEXT,
        created_at DATETIME,
        fetched_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        verified_purchase TINYINT(1) NOT NULL DEFAULT 0,
        flagged TINYINT(1) NOT NULL DEFAULT 0,
        moderation_status ENUM('pending','approved','rejected') NOT NULL DEFAULT 'approved',
        UNIQUE KEY unique_review (product_id, source, review_id),
        INDEX idx_product_id (product_id),
        INDEX idx_source (source),
        INDEX idx_created_at (created_at),
        INDEX idx_fetched_at (fetched_at),
        INDEX idx_product_source (product_id, source),
        INDEX idx_flagged (flagged),
        INDEX idx_moderation_status (moderation_status),
        INDEX idx_verified (verified_purchase)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `;

    await pool.execute(createTableSQL);

    // Backfill columns for existing tables; ignore duplicates if already present (MySQL 5.x lacks IF NOT EXISTS for ADD COLUMN)
    const alterStatements = [
      `ALTER TABLE reviews ADD COLUMN flagged TINYINT(1) NOT NULL DEFAULT 0 AFTER fetched_at`,
      `ALTER TABLE reviews ADD COLUMN moderation_status ENUM('pending','approved','rejected') NOT NULL DEFAULT 'approved' AFTER flagged`,
      `ALTER TABLE reviews ADD COLUMN verified_purchase TINYINT(1) NOT NULL DEFAULT 0 AFTER moderation_status`,
      `ALTER TABLE reviews ADD INDEX idx_moderation_status (moderation_status)`,
      `ALTER TABLE reviews ADD INDEX idx_flagged (flagged)`,
      `ALTER TABLE reviews ADD INDEX idx_verified (verified_purchase)`,
    ];

    for (const sql of alterStatements) {
      try {
        await pool.execute(sql);
      } catch (err) {
        // Ignore "already exists" errors so startup remains idempotent across MySQL versions
        const duplicateColumn = err.code === 'ER_DUP_FIELDNAME'; // column exists
        const duplicateKey = err.code === 'ER_DUP_KEYNAME' || err.code === 'ER_DUP_KEY'; // index exists
        const columnExists = err.errno === 1060; // duplicate column name numeric
        const indexExists = err.errno === 1061; // duplicate key name numeric
        if (!duplicateColumn && !duplicateKey && !columnExists && !indexExists) {
          throw err;
        }
      }
    }
    console.log('✅ Reviews table initialized');
    return true;
  } catch (error) {
    console.error('❌ Failed to initialize reviews table:', error);
    throw error;
  }
}

/**
 * Insert or update a review (handles duplicates via UNIQUE constraint)
 * @param {Object} review - Review data
 * @returns {Object} Insert result with insertId
 */
export async function insertReview(review) {
  const {
    productId,
    source,
    reviewId,
    author,
    rating,
    title,
    body,
    createdAt,
    verifiedPurchase = false,
  } = review;

  const sql = `
    INSERT INTO reviews 
    (product_id, source, review_id, author, rating, title, body, created_at, fetched_at, verified_purchase)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?)
    ON DUPLICATE KEY UPDATE
    fetched_at = NOW(),
    author = VALUES(author),
    rating = VALUES(rating),
    title = VALUES(title),
    body = VALUES(body),
    verified_purchase = VALUES(verified_purchase)
  `;

  const [result] = await pool.execute(sql, [
    productId,
    source,
    reviewId,
    author,
    rating,
    title,
    body,
    createdAt,
    verifiedPurchase ? 1 : 0,
  ]);

  return result;
}

/**
 * Insert multiple reviews efficiently
 * @param {Array} reviews - Array of review objects
 * @returns {Object} Batch insert result
 */
export async function insertReviewsBatch(reviews) {
  if (!reviews || reviews.length === 0) {
    return { affectedRows: 0, insertedCount: 0, duplicateCount: 0 };
  }

  let totalAffected = 0;
  let insertedCount = 0;
  let duplicateCount = 0;

  // Insert in smaller batches to avoid packet size issues
  const batchSize = 100;
  for (let i = 0; i < reviews.length; i += batchSize) {
    const batch = reviews.slice(i, i + batchSize);
    
    for (const review of batch) {
      try {
        const result = await insertReview(review);
        if (result.affectedRows > 0) {
          totalAffected += result.affectedRows;
          if (result.insertId) {
            insertedCount++;
          } else {
            duplicateCount++;
          }
        }
      } catch (error) {
        console.error('Error inserting review:', error, review);
      }
    }
  }

  return { affectedRows: totalAffected, insertedCount, duplicateCount };
}

/**
 * Get all reviews for a product
 * @param {string} productId - Product ID
 * @returns {Array} Review rows
 */
export async function getReviewsByProduct(productId) {
  const sql = `
    SELECT id, product_id, source, review_id, author, rating, title, body, created_at, fetched_at, flagged, moderation_status, verified_purchase
    FROM reviews
    WHERE product_id = ?
    ORDER BY created_at DESC
  `;

  const [rows] = await pool.execute(sql, [productId]);
  return rows;
}

/**
 * Get aggregate statistics for a product
 * @param {string} productId - Product ID
 * @returns {Object} Aggregated statistics
 */
export async function getAggregateStats(productId) {
  const sql = `
    SELECT
      COUNT(*) as total,
      AVG(rating) as overallAverage,
      ROUND(AVG(rating), 2) as overallAverageRounded,
      COUNT(DISTINCT source) as sourceCount,
      source,
      rating,
      COUNT(*) as count
    FROM reviews
    WHERE product_id = ?
    GROUP BY source, rating
    WITH ROLLUP
  `;

  const [rows] = await pool.execute(sql, [productId]);

  // Process results into structured format
  const stats = {
    totalReviews: 0,
    overallAverage: 0,
    sourceBreakdown: {},
    ratingHistogram: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  };

  // Find the overall row (where source IS NULL and rating IS NULL)
  let sourceStats = {};

  for (const row of rows) {
    if (row.source === null && row.rating === null) {
      // This is the grand total row
      stats.totalReviews = row.total || 0;
      stats.overallAverage = row.overallAverageRounded || 0;
    } else if (row.rating === null) {
      // This is a source total row
      if (row.source) {
        sourceStats[row.source] = {
          count: row.total,
          sum: 0, // We'll calculate this from individual ratings
        };
      }
    } else if (row.source) {
      // Individual rating for a source
      if (!sourceStats[row.source]) {
        sourceStats[row.source] = { count: 0, sum: 0 };
      }
      sourceStats[row.source].sum += row.rating * row.count;
      stats.ratingHistogram[row.rating] = (stats.ratingHistogram[row.rating] || 0) + row.count;
    }
  }

  // Calculate per-source averages
  for (const [source, data] of Object.entries(sourceStats)) {
    stats.sourceBreakdown[source] = {
      count: data.count,
      averageRating: data.count > 0 ? Math.round((data.sum / data.count) * 100) / 100 : 0,
    };
  }

  // Convert sourceBreakdown object to array format expected by frontend
  stats.sourceBreakdown = Object.entries(stats.sourceBreakdown).map(([source, data]) => ({
    source,
    count: data.count,
    average: data.averageRating,
  }));

  return stats;
}

/**
 * Delete all reviews for a product (admin function)
 * @param {string} productId - Product ID
 * @returns {Object} Delete result
 */
export async function deleteReviewsByProduct(productId) {
  const sql = 'DELETE FROM reviews WHERE product_id = ?';
  const [result] = await pool.execute(sql, [productId]);
  return result;
}

/**
 * Get review count for a product
 * @param {string} productId - Product ID
 * @returns {number} Review count
 */
export async function getReviewCount(productId) {
  const sql = 'SELECT COUNT(*) as count FROM reviews WHERE product_id = ?';
  const [rows] = await pool.execute(sql, [productId]);
  return rows[0]?.count || 0;
}

/**
 * Moderation queue with optional filters
 */
export async function getModerationQueue({ status, flagged, productId, limit = 25, offset = 0 }) {
  const where = [];
  const params = [];

  if (status) {
    where.push('moderation_status = ?');
    params.push(status);
  }

  if (typeof flagged === 'boolean') {
    where.push('flagged = ?');
    params.push(flagged ? 1 : 0);
  }

  if (productId) {
    where.push('product_id = ?');
    params.push(productId);
  }

  const whereClause = where.length ? `WHERE ${where.join(' AND ')}` : '';

  const [rows] = await pool.query(
    `SELECT SQL_CALC_FOUND_ROWS 
        id, product_id, source, review_id, author, rating, title, body, created_at, fetched_at, flagged, moderation_status
      FROM reviews
      ${whereClause}
      ORDER BY fetched_at DESC
      LIMIT ? OFFSET ?`,
    [...params, limit, offset],
  );

  const [[{ total }]] = await pool.query('SELECT FOUND_ROWS() AS total');

  return { rows, total };
}

/**
 * Update moderation status and/or flagged flag
 */
export async function updateReviewModeration(id, { flagged, moderationStatus }) {
  const sets = [];
  const params = [];

  if (typeof flagged === 'boolean') {
    sets.push('flagged = ?');
    params.push(flagged ? 1 : 0);
  }
  if (moderationStatus) {
    sets.push('moderation_status = ?');
    params.push(moderationStatus);
  }

  if (sets.length === 0) {
    return { affectedRows: 0 };
  }

  params.push(id);
  const sql = `UPDATE reviews SET ${sets.join(', ')} WHERE id = ?`;
  const [result] = await pool.execute(sql, params);
  return result;
}

/**
 * Delete a review by id
 */
export async function deleteReviewById(id) {
  const [result] = await pool.execute('DELETE FROM reviews WHERE id = ?', [id]);
  return result;
}
