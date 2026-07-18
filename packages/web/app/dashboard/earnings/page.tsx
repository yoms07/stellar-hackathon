'use client';

import { AppShell } from '@/components/app-shell/app-shell';
import { AccessNotice, DashboardAccessGate } from '@/components/dashboard/dashboard-access';
import { ManagerContentList } from '@/components/dashboard/manager-content-list';

/** `/dashboard/earnings` — a manager's active/pending balance, withdraw, and settle-all. Split
 *  out from the home dashboard so `/dashboard` doesn't have to carry the full payout workflow. */
export default function EarningsPage() {
  return (
    <AppShell>
      <main className="shell shell-wide">
        <div className="dash-head">
          <div>
            <h1 className="dash-title">Earnings</h1>
            <p className="dash-sub">What your content has earned, and getting paid.</p>
          </div>
        </div>

        <DashboardAccessGate>
          {(access) =>
            !access.isManager ? (
              <AccessNotice
                title="You're not a manager yet"
                hint="Publish content to a community to start earning from reads."
                ctaHref="/start"
                ctaLabel="Start your community"
              />
            ) : (
              <ManagerContentList />
            )
          }
        </DashboardAccessGate>
      </main>
    </AppShell>
  );
}
