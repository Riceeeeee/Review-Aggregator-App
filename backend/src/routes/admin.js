import express from 'express';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';
import {
  getModerationQueue,
  updateReviewModeration,
  deleteReviewById,
} from '../database/reviews.js';

const router = express.Router();

// GET /api/admin/reviews?status=pending|approved|rejected&flagged=1&productId=...
router.get(
  '/reviews',
  asyncHandler(async (req, res) => {
    const status = req.query.status;
    const flagged = req.query.flagged ? req.query.flagged === '1' || req.query.flagged === 'true' : undefined;
    const productId = req.query.productId || undefined;
    const limit = Math.min(100, parseInt(req.query.limit, 10) || 25);
    const offset = Math.max(0, parseInt(req.query.offset, 10) || 0);

    const { rows, total } = await getModerationQueue({ status, flagged, productId, limit, offset });

    res.json({
      success: true,
      data: rows,
      meta: { total, limit, offset },
    });
  }),
);

// PATCH /api/admin/reviews/:id  { flagged?: boolean, moderationStatus?: 'pending'|'approved'|'rejected' }
router.patch(
  '/reviews/:id',
  asyncHandler(async (req, res) => {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) throw new AppError('Invalid review id', 400);

    const { flagged, moderationStatus } = req.body || {};
    const updates = {};

    if (typeof flagged === 'boolean') updates.flagged = flagged;
    if (moderationStatus) {
      const allowed = ['pending', 'approved', 'rejected'];
      if (!allowed.includes(moderationStatus)) {
        throw new AppError('Invalid moderation status', 400);
      }
      updates.moderationStatus = moderationStatus;
    }

    if (Object.keys(updates).length === 0) {
      throw new AppError('No updates provided', 400);
    }

    const result = await updateReviewModeration(id, updates);
    if (result.affectedRows === 0) throw new AppError('Review not found', 404);

    res.json({ success: true, updated: result.affectedRows });
  }),
);

// DELETE /api/admin/reviews/:id
router.delete(
  '/reviews/:id',
  asyncHandler(async (req, res) => {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) throw new AppError('Invalid review id', 400);

    const result = await deleteReviewById(id);
    if (result.affectedRows === 0) throw new AppError('Review not found', 404);

    res.json({ success: true });
  }),
);

export default router;
