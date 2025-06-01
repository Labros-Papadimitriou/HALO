import { Router } from 'express';
import {
  getEnchantStatusHandler,
  getRecentReportsHandler,
  syncMemberEnchantsHandler
} from '../controllers/enchant.controller.js';

const router = Router();

// GET  /api/enchant/enchant-status
router.get('/status', getEnchantStatusHandler);

// POST /api/enchant/sync-enchants
router.post('/sync', syncMemberEnchantsHandler);

router.get('/reports', getRecentReportsHandler);

export default router;
