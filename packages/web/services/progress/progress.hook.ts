'use client';

import { useQuery } from '@tanstack/react-query';

import { useWallet } from '@/providers/wallet-provider';

import { ProgressService } from './progress.service';
import { progressKeys } from './progress.queries';

/** Session requires the `kmf_session` cookie (D-001); the member panel only renders once
 *  `dashboard-shell.tsx` has confirmed the wallet is authenticated, so gating on `address`
 *  matches the convention used by `content`/`subscription` reads. */
export function useProgressList() {
  const { address } = useWallet();
  return useQuery({
    queryKey: progressKeys.list(address),
    queryFn: () => ProgressService.list(),
    enabled: !!address,
  });
}
