'use client';

import { AppShell } from '@/components/app-shell/app-shell';
import { ActivityRail } from '@/components/dashboard/activity-rail';
import { ContentGrid } from '@/components/dashboard/content-grid';
import { ContinueCard } from '@/components/dashboard/continue-card';
import { DashboardAccessGate } from '@/components/dashboard/dashboard-access';
import { MembershipOverview } from '@/components/dashboard/membership-overview';
import { SubscriptionCard } from '@/components/dashboard/subscription-card';
import { ExploreCta } from '@/components/ui/explore-cta';
import { Skeleton } from '@/components/ui/skeleton';

/** `/dashboard/library` — the member reading experience: membership snapshot, continue-reading,
 *  the full content grid, and recent activity. Split out from the home dashboard so `/dashboard`
 *  stays a summary and this page owns the full "read stuff" workflow. */
export default function LibraryPage() {
  return (
    <AppShell>
      <main className="shell shell-wide">
        <div className="dash-head">
          <div>
            <h1 className="dash-title">Library</h1>
            <p className="dash-sub">Everything your membership unlocks.</p>
          </div>
          <ExploreCta />
        </div>

        <DashboardAccessGate>
          {(access) =>
            access.isSubscribedLoading ? (
              <section className="card">
                <Skeleton className="h-24 w-full rounded-md" />
              </section>
            ) : !access.isSubscribed ? (
              <>
                <SubscriptionCard />
                {/* Locked preview: every row already renders a LOCKED pill + "Subscribe to
                    open" CTA when there's no active subscription (see ContentRow). */}
                <ContentGrid />
              </>
            ) : (
              <>
                <MembershipOverview />
                <div className="grid-dash">
                  <div className="stack">
                    <ContinueCard />
                    <ContentGrid />
                  </div>
                  <div className="stack">
                    <ActivityRail />
                  </div>
                </div>
              </>
            )
          }
        </DashboardAccessGate>
      </main>
    </AppShell>
  );
}
