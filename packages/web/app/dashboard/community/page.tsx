'use client';

import { AppShell } from '@/components/app-shell/app-shell';
import { AccessNotice, DashboardAccessGate } from '@/components/dashboard/dashboard-access';
import { CommunityOnboarding } from '@/components/dashboard/community-onboarding';
import { ManagerContentPanel } from '@/components/dashboard/manager-content-panel';
import { UploadStepper } from '@/components/dashboard/upload-stepper';
import { useWallet } from '@/providers/wallet-provider';
import { useCommunity, useSaveCommunity } from '@/services/community';

/** `/dashboard/community` — a manager's brand setup, publish flow, and content visibility, all
 *  in one page. Split out from the home dashboard: this is a workflow, not a summary. */
export default function CommunityPage() {
  const { address } = useWallet();
  const community = useCommunity(address);
  const saveCommunity = useSaveCommunity(address);
  const brand = community.data ?? null;

  return (
    <AppShell>
      <main className="shell shell-wide">
        <div className="dash-head">
          <div>
            <h1 className="dash-title">Community</h1>
            <p className="dash-sub">Set up your brand, publish content, and manage what&apos;s live.</p>
          </div>
        </div>

        <DashboardAccessGate>
          {(access) =>
            !access.isManager ? (
              <AccessNotice
                title="You're not a manager yet"
                hint="Start a community to publish content and earn from reads — it's free and takes about a minute."
                ctaHref="/start"
                ctaLabel="Start Community"
              />
            ) : (
              <>
                {community.isLoading ? null : (
                  <CommunityOnboarding
                    wallet={address}
                    brand={brand}
                    saving={saveCommunity.isPending}
                    error={saveCommunity.isError ? (saveCommunity.error as Error).message : null}
                    onSave={(data) => saveCommunity.mutate(data)}
                  />
                )}
                {brand ? <UploadStepper /> : null}
                <ManagerContentPanel />
              </>
            )
          }
        </DashboardAccessGate>
      </main>
    </AppShell>
  );
}
