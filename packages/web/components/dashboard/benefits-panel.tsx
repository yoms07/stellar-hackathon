'use client';

import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Skeleton } from '@/components/ui/skeleton';
import { useWallet } from '@/providers/wallet-provider';
import { useCommunity } from '@/services/community';
import { useContentList } from '@/services/content';
import { useSubscriptionStatus } from '@/services/subscription';

function shortAddr(address: string): string {
  return `${address.slice(0, 4)}…${address.slice(-4)}`;
}

interface PartnerSummary {
  wallet: string;
  name: string;
  logo: string | null;
}

/** One card per partner community the subscription unlocks: avatar, quiet "Unlocked" status
 *  (no pill — DESIGN.md 2026-07-16 review: status text is plain, only benefit rows get pills),
 *  and that community's benefit rows sourced from its brand (D-010 extension). */
function PartnerBenefitsCard({ partner }: { partner: PartnerSummary }) {
  const community = useCommunity(partner.wallet);
  const benefits = community.data?.benefits ?? [];
  const name = community.data?.name ?? partner.name;
  const logo = community.data?.logo ?? partner.logo;

  return (
    <div className="card">
      <div className="row">
        <div className="row tight" style={{ alignItems: 'center' }}>
          <span className="avatar">
            {logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              name.charAt(0).toUpperCase()
            )}
          </span>
          <h2 style={{ margin: 0 }}>{name}</h2>
          <Link
            href={`/community/${partner.wallet}`}
            title={`Preview ${name} member content`}
            aria-label={`Preview ${name} member content`}
            className="inline-flex items-center text-[var(--color-content-secondary)] transition-colors duration-150 ease-out hover:text-[var(--color-content-accent)]"
          >
            <Icon name="external" size={14} />
          </Link>
        </div>
        <span className="label" style={{ textTransform: 'none' }}>
          Unlocked
        </span>
      </div>

      {community.isLoading ? (
        <Skeleton className="h-12 w-full rounded-md" style={{ marginTop: 12 }} />
      ) : benefits.length > 0 ? (
        <div style={{ marginTop: 4 }}>
          {benefits.map((benefit, i) => (
            <div key={`${partner.wallet}-${i}`} className="benefit-line">
              <div>
                <p style={{ margin: 0, fontWeight: 600, fontSize: 14 }}>{benefit.title}</p>
                <span className="label" style={{ textTransform: 'none', fontSize: 13 }}>
                  {benefit.description}
                </span>
              </div>
              <span className="pill ok">INCLUDED</span>
            </div>
          ))}
        </div>
      ) : (
        <p className="hint">This community hasn&apos;t listed member benefits yet.</p>
      )}
    </div>
  );
}

function BenefitsGuard({ title, hint }: { title: string; hint: string }) {
  return (
    <section className="card center">
      <h2>{title}</h2>
      <p className="hint">{hint}</p>
      <Button asChild>
        <Link href="/dashboard">Choose subscription</Link>
      </Button>
    </section>
  );
}

/** `/dashboard/benefits` — membership summary + one card per partner community, sourced from
 *  each community's own benefits list (prototype benefits.html, SPEC.md Screen 3). */
export function BenefitsPanel() {
  const { isConnected, address } = useWallet();
  const status = useSubscriptionStatus();
  const content = useContentList();

  if (!isConnected) {
    return (
      <BenefitsGuard
        title="Connect your wallet"
        hint="Connect to see the benefits your subscription unlocks."
      />
    );
  }

  if (status.isLoading) {
    return (
      <section className="card">
        <Skeleton className="h-24 w-full rounded-md" />
      </section>
    );
  }

  if (!status.data?.isActive) {
    return (
      <BenefitsGuard
        title="No active subscription yet"
        hint="Subscribe once to unlock member benefits at every partner community in the bundle."
      />
    );
  }

  const partners: PartnerSummary[] = [];
  const seen = new Set<string>();
  for (const item of content.data?.items ?? []) {
    if (!item.communityName || seen.has(item.creatorWallet)) continue;
    seen.add(item.creatorWallet);
    partners.push({ wallet: item.creatorWallet, name: item.communityName, logo: item.communityLogo });
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      <div
        className="card"
        style={{
          border: '1px solid transparent',
          background:
            'linear-gradient(180deg, rgba(250,214,87,0.10), rgba(250,214,87,0.03)) padding-box,' +
            'linear-gradient(135deg, rgba(250,214,87,0.55), rgba(250,214,87,0.12) 50%, rgba(250,214,87,0.45)) border-box',
        }}
      >
        <div className="label" style={{ color: 'color-mix(in srgb, var(--color-content-on-accent) 70%, transparent)' }}>
          MEMBERSHIP
        </div>
        <div className="row">
          <h2>Community Bundle</h2>
          <span className="pill accent">
            <Icon name="check" size={12} /> ACTIVE
          </span>
        </div>
        <p className="hint" style={{ color: 'color-mix(in srgb, var(--color-content-on-accent) 65%, transparent)' }}>
          Entitlement recorded on-chain
        </p>
        {address ? <code title={address}>{shortAddr(address)}</code> : null}
        <div className="row tight" style={{ marginTop: 12 }}>
          <Button asChild variant="outline" size="sm">
            <Link href="/dashboard">Open access dashboard</Link>
          </Button>
        </div>
      </div>

      {content.isLoading ? (
        <div className="grid-2">
          <Skeleton className="h-40 w-full rounded-md" />
          <Skeleton className="h-40 w-full rounded-md" />
        </div>
      ) : partners.length > 0 ? (
        <div className="grid-2">
          {partners.map((partner) => (
            <PartnerBenefitsCard key={partner.wallet} partner={partner} />
          ))}
        </div>
      ) : (
        <section className="card">
          <p className="hint" style={{ display: 'flex', gap: 6, alignItems: 'center', margin: 0 }}>
            <Icon name="sparkle" size={15} />
            No partner communities have published benefits yet.
          </p>
        </section>
      )}
    </div>
  );
}
