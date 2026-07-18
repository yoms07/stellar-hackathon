'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useWallet } from '@/providers/wallet-provider';
import { useMe } from '@/services/auth';
import { useIsManager } from '@/services/manager';
import { useConfig, useSubscriptionStatus } from '@/services/subscription';

import { ConnectGate } from './connect-gate';
import { SignInCard } from './session-card';

function LoadingCard() {
  return (
    <section className="card">
      <Skeleton className="h-24 w-full rounded-md" />
    </section>
  );
}

/**
 * Shared wallet/session/role state for every `/dashboard/*` page. Each page used to re-derive
 * this ladder (connected -> session -> role) on its own; now it's one hook + one gate component,
 * reused across the home dashboard and the dedicated Library/Community/Earnings/Admin pages.
 */
export function useDashboardAccess() {
  const { isConnected, address } = useWallet();
  const me = useMe();
  const isManager = useIsManager();
  const status = useSubscriptionStatus();
  const config = useConfig();

  // See dashboard-shell.tsx history: a connected wallet without a matching kmf_session (e.g.
  // the Freighter account switched after sign-in) must be treated as unauthenticated (D-001).
  const isAuthenticated = !!me.data && me.data.address === address;

  return {
    address,
    isConnected,
    meLoading: me.isLoading,
    isAuthenticated,
    isManagerLoading: isManager.isLoading,
    isManager: !!isManager.data,
    isSubscribedLoading: status.isLoading,
    isSubscribed: !!status.data?.isActive,
    isAdmin: !!address && config.data?.admin === address,
    /** True once connected + signed in + role known — pages can read every field above safely. */
    ready: isConnected && isAuthenticated && !isManager.isLoading,
  };
}

type Access = ReturnType<typeof useDashboardAccess>;

/**
 * Renders the connect/sign-in gate for a `/dashboard/*` page and defers to `children` (a render
 * prop, since the page needs the resolved `Access` to branch further — e.g. manager vs member)
 * once the wallet/session ladder resolves.
 */
export function DashboardAccessGate({ children }: { children: (access: Access) => ReactNode }) {
  const access = useDashboardAccess();

  if (!access.isConnected) return <ConnectGate />;
  if (access.meLoading) return <LoadingCard />;
  if (!access.isAuthenticated) return <SignInCard />;
  if (access.isManagerLoading) return <LoadingCard />;

  return <>{children(access)}</>;
}

/** Restricted-page notice for a role-gated `/dashboard/*` page (e.g. Community/Earnings for a
 *  non-manager, Admin for a non-admin wallet), with an optional way forward. */
export function AccessNotice({
  title,
  hint,
  ctaHref,
  ctaLabel,
}: {
  title: string;
  hint: string;
  ctaHref?: string;
  ctaLabel?: string;
}) {
  return (
    <section className="card center">
      <h2>{title}</h2>
      <p className="hint">{hint}</p>
      {ctaHref && ctaLabel ? (
        <Button asChild>
          <Link href={ctaHref}>{ctaLabel}</Link>
        </Button>
      ) : null}
    </section>
  );
}
