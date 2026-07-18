'use client';

import Link from 'next/link';

import { formatTokenAmount } from '@/lib/contracts';
import { useWallet } from '@/providers/wallet-provider';
import { useCommunity } from '@/services/community';
import { useAccrued, useMyContent, usePendingBalance } from '@/services/manager';
import { useSubscriptionStatus } from '@/services/subscription';

function renewsIn(expiresAt: bigint): string {
  const ms = Number(expiresAt) * 1000 - Date.now();
  if (ms <= 0) return 'Expiring soon';
  const d = Math.floor(ms / 86_400_000);
  if (d >= 1) return `Renews in ${d}d`;
  const h = Math.max(1, Math.floor(ms / 3_600_000));
  return `Renews in ${h}h`;
}

/** One `.stat-chip`, linking into the page that owns the full picture. */
function Chip({
  href,
  label,
  value,
  caption,
}: {
  href: string;
  label: string;
  value: React.ReactNode;
  caption: React.ReactNode;
}) {
  return (
    <Link href={href} className="stat-chip stat-chip-link">
      <div className="label">{label}</div>
      <div className="stat-value stat-value-row">{value}</div>
      <div className="stat-cap">{caption}</div>
    </Link>
  );
}

/**
 * Home dashboard's "at a glance" row — one chip per thing the connected wallet already *has*
 * (an active membership, a community, earnings), each linking to the page that owns the full
 * workflow. Chips only appear once there's a real status to summarize: a brand-new, unsubscribed,
 * non-manager wallet has nothing to summarize yet, so this renders nothing and `DashboardShell`
 * leads with the `SubscriptionCard` instead — a chip reading "Not a member" directly above a
 * card that says the same thing in longer form was the exact duplication being fixed here.
 */
export function HomeOverview({ isManager }: { isManager: boolean }) {
  const { address } = useWallet();
  const status = useSubscriptionStatus();
  const community = useCommunity(isManager ? address : null);
  const myContent = useMyContent();
  const accrued = useAccrued();
  const pending = usePendingBalance();

  const isActive = !!status.data?.isActive;
  const hasBrand = !!community.data?.name;
  const publishedCount = isManager ? (myContent.data?.length ?? 0) : 0;
  const pendingAmount = pending.data ? BigInt(pending.data.amount) : undefined;

  if (!isManager && !isActive) return null;

  return (
    <section className="stat-strip overview-strip" aria-label="Overview">
      {isActive ? (
        <Chip
          href="/dashboard/library"
          label="MEMBERSHIP"
          value={
            <>
              <span className="dot-ok" /> Active
            </>
          }
          caption={status.data?.expiresAt ? renewsIn(status.data.expiresAt) : 'Active'}
        />
      ) : null}

      {isManager ? (
        <Chip
          href="/dashboard/community"
          label="COMMUNITY"
          value={
            <>
              <span className={hasBrand ? 'dot-ok' : 'dot-warn'} />
              {hasBrand ? community.data?.name : 'Not set up'}
            </>
          }
          caption={
            hasBrand
              ? `${publishedCount} ${publishedCount === 1 ? 'item' : 'items'} published`
              : 'Finish setup to publish'
          }
        />
      ) : null}

      {isManager ? (
        <Chip
          href="/dashboard/earnings"
          label="EARNINGS"
          value={
            <>
              {accrued.data !== undefined ? formatTokenAmount(accrued.data) : '…'}
              <small>USDC</small>
            </>
          }
          caption={
            pendingAmount !== undefined && pendingAmount > 0n
              ? `${formatTokenAmount(pendingAmount)} USDC pending`
              : 'Withdrawable now'
          }
        />
      ) : null}
    </section>
  );
}
