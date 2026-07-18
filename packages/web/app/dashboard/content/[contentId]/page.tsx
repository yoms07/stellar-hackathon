'use client';

import { use } from 'react';

import { AppShell } from '@/components/app-shell/app-shell';
import { ConnectGate } from '@/components/dashboard/connect-gate';
import { SubscribeGate } from '@/components/dashboard/subscribe-gate';
import { ContentDetailView } from '@/components/content/content-detail-view';
import { useWallet } from '@/providers/wallet-provider';
import { useSubscriptionStatus } from '@/services/subscription';

/**
 * `/dashboard/content/<contentId>` — Screen 7 (prototype `content.html?p=&i=`), reimplemented
 * with real routing. Members-only: gated the same way `/dashboard` gates itself (dashboard-shell.tsx)
 * — same AppShell/sidenav chrome throughout, the content area swaps to a gate card instead of a
 * separate page/shell, since a subscribed member reaching this route without a wallet/subscription
 * is exactly the same state the dashboard already handles.
 */
export default function ContentDetailPage({ params }: { params: Promise<{ contentId: string }> }) {
  const { contentId } = use(params);
  const { isConnected } = useWallet();
  const status = useSubscriptionStatus();
  const isSubscribed = !!status.data?.isActive;

  return (
    <AppShell>
      <main className="shell shell-wide">
        {!isConnected ? <ConnectGate /> : !isSubscribed ? <SubscribeGate /> : <ContentDetailView contentId={contentId} />}
      </main>
    </AppShell>
  );
}
