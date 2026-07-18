import { z } from 'zod';

/**
 * Per-wallet activity feed for `GET /me/activity`. Built entirely from on-chain `kmf` events
 * (same `getEvents` source as `GET /stats`'s `recentEvents`), filtered to the session wallet —
 * no new database table. See docs/CONTRACT_SPEC.md §2.6 for topics/data shapes.
 */

export const ActivityItemSchema = z.object({
  type: z.enum(['subscribed', 'accessed', 'claimed']),
  contentId: z.string().optional(), // stringified u64, present for 'accessed'
  amount: z.string().optional(), // stringified i128, present for 'subscribed'/'claimed'
  ledger: z.number().int(),
  txHash: z.string(),
  at: z.string(), // ISO datetime, best-effort from ledger close time
});
export type ActivityItem = z.infer<typeof ActivityItemSchema>;

export const ActivityListResponseSchema = z.object({
  items: z.array(ActivityItemSchema),
});
export type ActivityListResponse = z.infer<typeof ActivityListResponseSchema>;
