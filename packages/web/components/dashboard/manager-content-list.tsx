'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Skeleton } from '@/components/ui/skeleton';
import { OnChainProof } from '@/components/ui/trust';
import { formatTokenAmount } from '@/lib/contracts';
import { accountExplorerUrl, getStellarConfig } from '@/lib/stellar';
import { useWallet } from '@/providers/wallet-provider';
import { useAccrued, useClaim, usePendingBalance, useSettleAll } from '@/services/manager';

/**
 * Manager earnings + content + payout. Money is per-member (D-009): a reader's payment is split
 * across the content they read when their cycle closes, landing in the manager's pending balance.
 * Settle-all moves that pending balance into the active (withdrawable) balance in one call; claim
 * withdraws it. The admin-only `force_close_epoch` control lives on its own `/dashboard/admin`
 * page (`AdminEpochPanel`), not here — it's a contract-admin role, not a manager one.
 */
export function ManagerContentList() {
  const { address } = useWallet();
  const accrued = useAccrued();
  const pending = usePendingBalance();
  const claim = useClaim();
  const settleAll = useSettleAll();

  const pendingAmount = pending.data ? BigInt(pending.data.amount) : undefined;

  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const accountUrl = address ? accountExplorerUrl(address, getStellarConfig().network) : null;

  async function handleClaim() {
    setError(null);
    setNotice(null);
    try {
      await claim.mutateAsync();
      setNotice('Withdrawn to your wallet.');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Withdraw failed');
    }
  }

  async function handleSettleAll() {
    setError(null);
    setNotice(null);
    try {
      const result = await settleAll.mutateAsync();
      if (result.attempted === 0) {
        setNotice('Nothing pending to move.');
      } else {
        const parts = ['Moved to your active balance.'];
        if (result.failed.length) parts.push(`${result.failed.length} failed — try again.`);
        if (result.truncated) parts.push('More remain — run it again.');
        setNotice(parts.join(' '));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Couldn’t move your pending balance');
    }
  }

  return (
    <section className="card">
      <h2>Earnings</h2>

      <span className="label">Distributed Earning</span>
      {accrued.isLoading ? (
        <Skeleton className="h-9 w-32 rounded-md" style={{ marginTop: 6 }} />
      ) : (
        <p className="balance">{accrued.data !== undefined ? formatTokenAmount(accrued.data) : '…'} USDC</p>
      )}
      <Button type="button" onClick={handleClaim} disabled={claim.isPending || !accrued.data}>
        <Icon name="coins" size={15} />
        {claim.isPending ? 'Withdrawing…' : 'Withdraw'}
      </Button>
      <div>
        <p className="hint" style={{ marginBottom: 8 }}>
          Paid straight to your wallet. No middleman.
        </p>
        <p className="hint" style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 0 }}>
          <OnChainProof label="Contract" />
          {accountUrl ? (
            <a
              href={accountUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'inline-flex', gap: 5, alignItems: 'center', color: 'var(--color-content-accent)' }}
            >
              <Icon name="wallet" size={14} /> Your account <Icon name="external" size={13} />
            </a>
          ) : null}
        </p>
      </div>

      {/* Get paid: pending balance -> active balance */}
      <div className="tx">
        <span className="label">Pending balance</span>
        {pending.isLoading ? (
          <Skeleton className="h-9 w-32 rounded-md" style={{ marginTop: 6 }} />
        ) : (
          <p className="balance">{pendingAmount !== undefined ? formatTokenAmount(pendingAmount) : '…'} USDC</p>
        )}
        <p className="hint" style={{ marginTop: 4, marginBottom: 12 }}>
          Earned from reads, not yet in your active balance.
        </p>

        <div style={{ marginBottom: 12 }}>
          <Button
            type="button"
            onClick={handleSettleAll}
            disabled={settleAll.isPending || pendingAmount === 0n}
          >
            <Icon name="coins" size={15} />
            {settleAll.isPending ? 'Moving…' : 'Move to active balance'}
          </Button>
          <p className="hint" style={{ marginBottom: 0 }}>
            No wallet signing needed.
          </p>
        </div>
      </div>

      {notice ? (
        <p className="success" style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <Icon name="check" size={14} /> {notice}
        </p>
      ) : null}
      {error ? <p className="error">{error}</p> : null}
    </section>
  );
}
