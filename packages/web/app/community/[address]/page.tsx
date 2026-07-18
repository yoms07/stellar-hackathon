import { AppShell } from '@/components/app-shell/app-shell';
import { CommunityView } from '@/components/community/community-view';

/** Public per-community page: /community/<manager wallet>. */
export default async function CommunityPage({ params }: { params: Promise<{ address: string }> }) {
  const { address } = await params;
  return (
    <AppShell>
      <main className="shell shell-wide">
        <CommunityView address={address} />
      </main>
    </AppShell>
  );
}
