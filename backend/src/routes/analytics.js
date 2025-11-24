import express from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';
import { getAnalyticsOverview } from '../database/analytics.js';

const router = express.Router();

/**
 * GET /api/analytics/overview
 * Returns aggregated review analytics for dashboards
 * Query params:
 *  - days (optional): limit timeline/activity range (default 90, max 365)
 */
router.get(
  '/overview',
  asyncHandler(async (req, res) => {
    const days = req.query.days ? Number(req.query.days) : undefined;
    const data = await getAnalyticsOverview({ days });

    res.json({
      success: true,
      data,
    });
  }),
);

export default router;
