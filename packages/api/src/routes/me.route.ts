import { Hono } from 'hono';
import { requireAuth } from '../middleware/auth.middleware.js';
import { success } from '../lib/response.js';
import { ProgressService } from '../services/progress.service.js';
import { getWalletActivity } from '../services/activity.service.js';
import type { HonoEnv } from '../types/app.types.js';

const me = new Hono<HonoEnv>();

/** Auth required: all Progress rows for the session wallet. */
me.get('/progress', requireAuth, async (c) => {
  const address = c.get('address');
  const items = await ProgressService.listForWallet(address);
  return success(c, { items });
});

/**
 * Auth required: the session wallet's activity feed. No database table — built from on-chain
 * `kmf` events (same source as `GET /stats`'s `recentEvents`), filtered to this wallet.
 */
me.get('/activity', requireAuth, async (c) => {
  const address = c.get('address');
  const items = await getWalletActivity(address);
  return success(c, { items });
});

export { me };
