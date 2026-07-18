'use client';

import { AppShell } from '@/components/app-shell/app-shell';
import { AdminEpochPanel } from '@/components/dashboard/admin-epoch-panel';
import { AccessNotice, DashboardAccessGate } from '@/components/dashboard/dashboard-access';

/** `/dashboard/admin` — the contract-admin's billing-cycle control (D-012). A separate on-chain
 *  role from `is_manager`, so it's a separate page rather than nested in the manager workflow. */
export default function AdminPage() {
  return (
    <AppShell>
      <main className="shell shell-wide">
        <div className="dash-head">
          <div>
            <h1 className="dash-title">Admin</h1>
            <p className="dash-sub">Contract-admin billing controls.</p>
          </div>
        </div>

        <DashboardAccessGate>
          {(access) =>
            !access.isAdmin ? (
              <AccessNotice
                title="Restricted"
                hint="This page is limited to the contract's admin wallet."
              />
            ) : (
              <AdminEpochPanel />
            )
          }
        </DashboardAccessGate>
      </main>
    </AppShell>
  );
}
