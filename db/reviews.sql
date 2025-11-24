-- MySQL schema for review aggregation system
-- Creates the reviews table with proper structure and constraints

-- Create reviews table
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
  
  -- Ensure no duplicate reviews from same source for same product
  UNIQUE KEY unique_review (product_id, source, review_id),
  
  -- Indexes for common queries
  INDEX idx_product_id (product_id),
  INDEX idx_source (source),
  INDEX idx_created_at (created_at),
  INDEX idx_fetched_at (fetched_at),
  INDEX idx_product_source (product_id, source)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Add comments for documentation
ALTER TABLE reviews COMMENT = 'Stores aggregated reviews from multiple e-commerce platforms';
ALTER TABLE reviews MODIFY COLUMN product_id VARCHAR(50) COMMENT 'Product identifier (e.g., headphones-001)';
ALTER TABLE reviews MODIFY COLUMN source VARCHAR(50) COMMENT 'Review source (Amazon, BestBuy, Walmart, etc.)';
ALTER TABLE reviews MODIFY COLUMN review_id VARCHAR(100) COMMENT 'Unique review ID from source platform';
ALTER TABLE reviews MODIFY COLUMN author VARCHAR(100) COMMENT 'Reviewer name';
ALTER TABLE reviews MODIFY COLUMN rating INT COMMENT '1-5 star rating';
ALTER TABLE reviews MODIFY COLUMN title VARCHAR(255) COMMENT 'Review headline';
ALTER TABLE reviews MODIFY COLUMN body TEXT COMMENT 'Full review text';
ALTER TABLE reviews MODIFY COLUMN created_at DATETIME COMMENT 'When review was created on source platform';
ALTER TABLE reviews MODIFY COLUMN fetched_at DATETIME COMMENT 'When review was fetched and stored';
