'use client';

import { AppShell } from '@/components/app-shell/app-shell';
import { DashboardShell } from '@/components/dashboard/dashboard-shell';
import { PageSpinner } from '@/components/ui/spinner';
import { useWallet } from '@/providers/wallet-provider';

/**
 * One route, one chrome: `AppShell`'s sidenav is always mounted, and `DashboardShell` is
 * the funnel — disconnected, signed-out, unsubscribed, manager, and member are all content
 * states inside it (D-006), not separate pages/shells. `restoring` is the only thing gated
 * here: wallet session restore from Freighter resolves asynchronously after mount, and
 * rendering the disconnected state before it resolves flashed a returning wallet through
 * "connect" on every load.
 */
export default function DashboardPage() {
  const { restoring } = useWallet();

  if (restoring) {
    return <PageSpinner />;
  }

  return (
    <AppShell>
      <main className="shell shell-wide">
        <DashboardShell />
      </main>
    </AppShell>
  );
}
