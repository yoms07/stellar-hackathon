'use client';

import { AppShell } from '@/components/app-shell/app-shell';
import { Icon } from '@/components/ui/icon';
import { Skeleton } from '@/components/ui/skeleton';
import { PARTNER_COMMUNITIES } from '@/lib/catalog';
import { useCommunities } from '@/services/community';

/** In-app communities page: on-chain communities plus the pilot partner catalog. */
export default function AppCommunitiesPage() {
  return (
    <AppShell>
      <main className="shell shell-wide">
        <header>
          <span className="label">Communities</span>
          <p className="tagline" style={{ marginTop: 0 }}>
            Partner communities
          </p>
          <p className="hint">
            Every active community in the bundle. On-chain communities appear here as they join.
          </p>
        </header>

        <OnChainCommunities />
        <PilotPartners />
      </main>
    </AppShell>
  );
}

function OnChainCommunities() {
  const communities = useCommunities();
  const items = communities.data?.communities ?? [];

  return (
    <section className="card">
      <span className="label">On-chain communities</span>

      {communities.isLoading ? (
        <Skeleton className="h-16 w-full rounded-md" style={{ marginTop: 12 }} />
      ) : items.length === 0 ? (
        <p className="hint">No on-chain communities yet.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 12 }}>
          {items.map((c) => (
            <div
              key={c.wallet}
              className="row"
              style={{
                alignItems: 'center',
                paddingBottom: 12,
                borderBottom: '1px solid var(--color-border-medium)',
              }}
            >
              <div className="row tight" style={{ alignItems: 'center' }}>
                {c.logo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={c.logo}
                    alt={`${c.name} logo`}
                    style={{ width: 48, height: 48, objectFit: 'contain', borderRadius: 'var(--radius-md)' }}
                  />
                ) : null}
                <div>
                  <p style={{ margin: 0, fontWeight: 700 }}>{c.name}</p>
                  {c.description ? <span className="hint">{c.description}</span> : null}
                </div>
              </div>
              <span className="pill">
                {c.contentCount} {c.contentCount === 1 ? 'item' : 'items'}
              </span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function PilotPartners() {
  return (
    <section className="card">
      <span className="label">Pilot partners</span>
      <p className="hint">Onboarding through the DAO listing flow.</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 12 }}>
        {PARTNER_COMMUNITIES.map((community) => (
          <div
            key={community.name}
            className="row"
            style={{
              alignItems: 'center',
              paddingBottom: 12,
              borderBottom: '1px solid var(--color-border-medium)',
            }}
          >
            <div className="row tight" style={{ alignItems: 'center' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}${community.logo}`}
                alt={`${community.name} logo`}
                style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 'var(--radius-md)' }}
              />
              <div>
                <p style={{ margin: 0, fontWeight: 700 }}>{community.name}</p>
                <span className="hint">{community.description}</span>
              </div>
            </div>
            <span className="pill">
              <Icon name="users" size={12} /> {community.badge}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
