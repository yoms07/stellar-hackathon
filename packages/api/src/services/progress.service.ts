import type { Prisma, Progress as ProgressRow } from '@prisma/client';
import type { Progress as ProgressDto, UpdateProgressRequest } from '@komunify/shared';
import { prisma } from '../config/database.js';

/**
 * Per-wallet, per-content progress (prototype parity: course modules, PDF read %). Not
 * entitlement or money — a UX convenience layered on top of chain-verified access.
 */

interface ProgressData {
  pct?: number;
  doneModules?: number[];
  lastViewedAt?: string;
}

export class ProgressService {
  static async listForWallet(wallet: string): Promise<ProgressDto[]> {
    const rows = await prisma.progress.findMany({ where: { wallet } });
    return rows.map(toDto);
  }

  /** Upserts `(wallet, contentId)`, shallow-merging `data` and stamping `lastViewedAt` every call. */
  static async upsert(wallet: string, contentId: string, patch: UpdateProgressRequest): Promise<ProgressDto> {
    const existing = await prisma.progress.findUnique({ where: { wallet_contentId: { wallet, contentId } } });
    const existingData = (existing?.data as ProgressData | null) ?? {};

    const data: ProgressData = {
      ...existingData,
      ...(patch.pct !== undefined ? { pct: patch.pct } : {}),
      ...(patch.doneModules !== undefined ? { doneModules: patch.doneModules } : {}),
      lastViewedAt: new Date().toISOString(),
    };

    const row = await prisma.progress.upsert({
      where: { wallet_contentId: { wallet, contentId } },
      create: { wallet, contentId, data: data as Prisma.InputJsonValue },
      update: { data: data as Prisma.InputJsonValue },
    });
    return toDto(row);
  }
}

function toDto(row: ProgressRow): ProgressDto {
  const data = (row.data as ProgressData | null) ?? {};
  return {
    contentId: row.contentId,
    pct: data.pct,
    doneModules: data.doneModules,
    lastViewedAt: data.lastViewedAt,
    updatedAt: row.updatedAt.toISOString(),
  };
}
