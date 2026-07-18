'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';

import { ContentRow } from '@/components/dashboard/content-grid';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useWallet } from '@/providers/wallet-provider';
import { ContentService } from '@/services/content';
import { contentKeys } from '@/services/content';
import { useCommunity } from '@/services/community';
import { useSubscriptionStatus } from '@/services/subscription';

/**
 * Public per-community page (`/community/<wallet>`, prototype partner.html): a locked
 * "members only" guard for disconnected/non-subscribed wallets, and — for active
 * subscribers — a two-column partner preview (profile card + numbered PACKAGES card)
 * mirroring the prototype's subscribed state. Opening a package reuses the dashboard
 * library's `ContentRow` so the open/read-recording flow has one code path. Only PDFs
 * are listed here: COURSE/VIDEO/LINK have no real progress tracking yet.
 */
export function CommunityView({ address }: { address: string }) {
  const community = useCommunity(address);
  const content = useQuery({
    queryKey: [...contentKeys.all(null), 'byCreator', address],
    queryFn: () => ContentService.list(),
  });
  const { address: wallet, restoring } = useWallet();
  const status = useSubscriptionStatus();

  const items = (content.data?.items ?? []).filter(
    (c) => c.creatorWallet === address && c.contentType === 'PDF',
  );
  const brand = community.data;
  const isActive = status.data?.isActive ?? false;
  const resolvingAccess = restoring || community.isLoading || (!!wallet && status.isLoading);

  return resolvingAccess ? (
    <section className="card">
      <Skeleton className="h-16 w-full rounded-md" />
    </section>
  ) : wallet && isActive ? (
    <div className="grid-detail">
      <div className="stack">
        <section className="card">
          <div className="row tight" style={{ alignItems: 'center', justifyContent: 'space-between' }}>
            <div className="row tight" style={{ alignItems: 'center' }}>
              {brand?.logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={brand.logo}
                  alt=""
                  className="avatar"
                  style={{ width: 40, height: 40, objectFit: 'cover' }}
                />
              ) : (
                <span className="avatar">{(brand?.name ?? address).charAt(0).toUpperCase()}</span>
              )}
              <h2 style={{ margin: 0 }}>{brand?.name ?? 'This community'}</h2>
            </div>
            <span className="content-meta">Unlocked</span>
          </div>
          {brand?.description ? (
            <p className="hint" style={{ margin: 0 }}>
              {brand.description}
            </p>
          ) : null}
          <p className="hint" style={{ margin: 0 }}>
            Included with your Community Bundle. Access is checked against your on-chain entitlement.
          </p>
        </section>

        <div className="stack">
          <Link className="btn ghost" href="/dashboard">
            Access dashboard
          </Link>
          <Link className="btn ghost" href="/dashboard/benefits">
            Back to benefits
          </Link>
        </div>
      </div>

      <section className="card">
        <div className="num-label">PACKAGES</div>
        <p className="hint">
          Packages your subscription unlocks here. Open one to read it.
        </p>
        {content.isLoading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Skeleton className="h-12 w-full rounded-md" />
            <Skeleton className="h-12 w-full rounded-md" />
          </div>
        ) : items.length > 0 ? (
          <div>
            {items.map((item) => (
              <ContentRow key={item.contentId} item={item} />
            ))}
          </div>
        ) : (
          <p className="hint">No published content yet.</p>
        )}
      </section>
    </div>
  ) : (
    <section className="card center">
      <h2>Members only</h2>
      <p className="hint">
        {brand?.name ?? 'This community'}&rsquo;s premium content unlocks with the Community
        Bundle subscription.
      </p>
      <Link href="/dashboard">
        <Button type="button">{wallet ? 'Choose subscription' : 'Connect wallet to subscribe'}</Button>
      </Link>
    </section>
  );
}
