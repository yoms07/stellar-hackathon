'use client';

import { NetworkGuard } from '@/components/wallet/network-guard';
import { ExploreCta } from '@/components/ui/explore-cta';

import { ActionStrip } from './action-strip';
import { AdminNudge } from './admin-nudge';
import { ContinueCard } from './continue-card';
import { DashboardAccessGate } from './dashboard-access';
import { HomeOverview } from './home-overview';
import { SubscribeGate } from './subscribe-gate';
import { TractionPanel } from './traction-panel';

/**
 * `/dashboard` — home. A summary, not a work surface: one overview chip per thing the wallet
 * already *has* (membership, community, earnings), each linking to the dedicated page that
 * owns that workflow (`/dashboard/library`, `/community`, `/earnings`, `/admin`). Publishing,
 * payouts, and billing-cycle controls used to all live here at once; they're each one click
 * away now instead of stacked on one page.
 */
export function DashboardShell() {
  return (
    <>
      <div className="dash-head">
        <div>
          <h1 className="dash-title">Dashboard</h1>
          <p className="dash-sub">Everything one membership unlocks for you.</p>
        </div>
        <ExploreCta />
      </div>

      <NetworkGuard />

      <DashboardAccessGate>
        {(access) => (
          <>
            <HomeOverview isManager={access.isManager} />

            {!access.isSubscribedLoading && !access.isSubscribed ? (
              <SubscribeGate />
            ) : access.isSubscribed ? (
              <ContinueCard
                fallback={
                  <ActionStrip
                    icon="unlock"
                    title="Nothing opened yet"
                    hint="Your library is unlocked — pick something and start reading."
                    href="/dashboard/library"
                    cta="Browse Library"
                  />
                }
              />
            ) : null}

            {/* Rare, protocol-level control — demoted to its own slim strip near the bottom
                rather than sitting among the wallet's own stats above. */}
            <AdminNudge />
          </>
        )}
      </DashboardAccessGate>

      <TractionPanel />
    </>
  );
}
