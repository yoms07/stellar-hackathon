'use client';

import { useQuery } from '@tanstack/react-query';

import { useWallet } from '@/providers/wallet-provider';

import { ActivityService } from './activity.service';
import { activityKeys } from './activity.queries';

/** See `services/progress/progress.hook.ts` for why gating on `address` is safe here. */
export function useActivityList() {
  const { address } = useWallet();
  return useQuery({
    queryKey: activityKeys.list(address),
    queryFn: () => ActivityService.list(),
    enabled: !!address,
  });
}
