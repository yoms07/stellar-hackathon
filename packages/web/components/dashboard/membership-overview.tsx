'use client';

import { useMemo, useState } from 'react';

import { Icon } from '@/components/ui/icon';
import { formatTokenAmount } from '@/lib/contracts';
import { useContentList } from '@/services/content';
import {
  useConfig,
  useFaucet,
  useFaucetAvailableAt,
  useSubscriptionStatus,
  useUsdcBalance,
} from '@/services/subscription';

function renewsIn(expiresAt: bigint): string {
  const ms = Number(expiresAt) * 1000 - Date.now();
  if (ms <= 0) return 'Expiring soon';
  const d = Math.floor(ms / 86_400_000);
  if (d >= 1) return `Renews in ${d}d`;
  const h = Math.max(1, Math.floor(ms / 3_600_000));
  return `Renews in ${h}h`;
}

/**
 * At-a-glance overview strip for the member dashboard. By the time this renders the wallet is
 * always an active subscriber — `DashboardPage` routes non-members into the pay funnel — so
 * membership collapses to a status tile with no subscribe CTA. Folds the old SubscriptionCard
 * status and the StatStrip counts into one KPI row (DESIGN.md §4.2 "Dashboard stat chips").
 */
export function MembershipOverview() {
  const status = useSubscriptionStatus();
  const config = useConfig();
  const balance = useUsdcBalance();
  const list = useContentList();
  const faucetAt = useFaucetAvailableAt();
  const faucet = useFaucet();
  const [error, setError] = useState<string | null>(null);

  const items = list.data?.items ?? [];
  const communityCount = useMemo(
    () => new Set(items.map((i) => i.communityName ?? 'Independent creators')).size,
    [items],
  );

  const faucetReady =
    !faucetAt.data || faucetAt.data === 0n || faucetAt.data * 1000n <= BigInt(Date.now());

  async function handleFaucet() {
    setError(null);
    try {
      await faucet.mutateAsync();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Faucet call failed');
    }
  }

  return (
    <section className="stat-strip overview-strip" aria-label="Membership overview">
      <div className="stat-chip">
        <div className="label">MEMBERSHIP</div>
        <div className="stat-value stat-value-row">
          <span className="dot-ok" /> Active
        </div>
        <div className="stat-cap">
          {status.data?.expiresAt ? renewsIn(status.data.expiresAt) : 'Active'}
          {config.data ? ` · ${formatTokenAmount(config.data.price)} USDC/mo` : ''}
        </div>
      </div>

      <div className="stat-chip">
        <div className="label">WALLET</div>
        <div className="stat-value stat-value-row">
          {balance.data !== undefined ? formatTokenAmount(balance.data) : '…'}
          <small>USDC</small>
        </div>
        <div className="stat-cap">
          {faucet.isPending ? (
            'Requesting…'
          ) : faucetReady ? (
            <button type="button" className="stat-link" onClick={handleFaucet}>
              <Icon name="coins" size={12} /> Get test USDC
            </button>
          ) : (
            'Test USDC · mock token'
          )}
        </div>
        {error ? (
          <p className="error" style={{ margin: '4px 0 0' }}>
            {error}
          </p>
        ) : null}
      </div>

      <div className="stat-chip">
        <div className="label">COMMUNITIES</div>
        <div className="stat-value">{list.isLoading ? '…' : communityCount}</div>
        <div className="stat-cap">in your bundle</div>
      </div>

      <div className="stat-chip">
        <div className="label">UNLOCKED</div>
        <div className="stat-value stat-value-row">
          {list.isLoading ? '…' : items.length}
          <small>items</small>
        </div>
        <div className="stat-cap">one membership</div>
      </div>
    </section>
  );
}
