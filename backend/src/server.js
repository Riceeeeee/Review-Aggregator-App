// src/server.js
import dotenv from 'dotenv';
import app from './index.js';
import { initializeReviewsTable } from './database/reviews.js';

dotenv.config();

const PORT = process.env.PORT || 4000;
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'http://localhost:5173';

app.listen(PORT, async () => {
  console.log(`🚀 Backend server listening on http://localhost:${PORT}`);
  console.log(`📝 Logs: HTTP requests will be logged in 'dev' format`);
  console.log(`🔗 CORS enabled for: ${FRONTEND_ORIGIN}`);
  
  // Initialize reviews table on startup
  try {
    await initializeReviewsTable();
  } catch (error) {
    console.error('⚠️  Failed to initialize reviews table:', error);
  }
});