import { z } from 'zod';

/**
 * Per-wallet, per-content progress (prototype parity: course modules, PDF read %). Not
 * entitlement or money — a UX convenience layered on top of chain-verified access. See
 * `GET /me/progress` and `PATCH /content/:contentId/progress` in docs/API_SPEC.md.
 */

export const ProgressSchema = z.object({
  contentId: z.string(), // stringified u64, matches Content.contractId
  pct: z.number().min(0).max(100).optional(),
  doneModules: z.array(z.number().int()).optional(),
  lastViewedAt: z.string().optional(), // ISO datetime
  updatedAt: z.string(), // ISO datetime
});
export type Progress = z.infer<typeof ProgressSchema>;

export const UpdateProgressRequestSchema = z.object({
  pct: z.number().min(0).max(100).optional(),
  doneModules: z.array(z.number().int()).optional(),
});
export type UpdateProgressRequest = z.infer<typeof UpdateProgressRequestSchema>;

export const ProgressListResponseSchema = z.object({
  items: z.array(ProgressSchema),
});
export type ProgressListResponse = z.infer<typeof ProgressListResponseSchema>;
