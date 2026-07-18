'use client';

import Link from 'next/link';

import { AppShell } from '@/components/app-shell/app-shell';
import { ActivityRail } from '@/components/dashboard/activity-rail';
import { ContentGrid } from '@/components/dashboard/content-grid';
import { ContinueCard } from '@/components/dashboard/continue-card';
import { DashboardAccessGate } from '@/components/dashboard/dashboard-access';
import { MembershipOverview } from '@/components/dashboard/membership-overview';
import { Button } from '@/components/ui/button';
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
        </div>

        <DashboardAccessGate>
          {(access) =>
            access.isSubscribedLoading ? (
              <section className="card">
                <Skeleton className="h-24 w-full rounded-md" />
              </section>
            ) : !access.isSubscribed ? (
              <>
                {/* Subscribing now happens on the Packages page — this just points there. */}
                <section className="card center">
                  <h2>Not a member yet</h2>
                  <p className="hint">Subscribe to a package to unlock this library.</p>
                  <Button asChild>
                    <Link href="/app/packages">Browse packages</Link>
                  </Button>
                </section>
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
