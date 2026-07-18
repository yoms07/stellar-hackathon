'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { useWallet } from '@/providers/wallet-provider';
import { useCurrentEpoch, useForceCloseEpoch } from '@/services/manager';
import { useConfig } from '@/services/subscription';

/**
 * Contract-admin-only demo/ops control (D-012): `force_close_epoch(admin)` ends the current
 * billing cycle for everyone. Gated on `Config.admin === connected wallet` — a separate
 * on-chain role from `is_manager` (a manager whitelist entry), so an admin wallet is not
 * necessarily a manager and shouldn't need to be one to reach this. Lives on its own
 * `/dashboard/admin` page rather than nested in the manager earnings workflow, so it's
 * reachable regardless of the connected wallet's role or subscription state.
 */
export function AdminEpochPanel() {
  const { address } = useWallet();
  const config = useConfig();
  const currentEpoch = useCurrentEpoch();
  const forceClose = useForceCloseEpoch();
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const isAdmin = !!address && config.data?.admin === address;

  async function handleForceClose() {
    setError(null);
    setNotice(null);
    try {
      await forceClose.mutateAsync();
      setNotice(
        `Cycle ${currentEpoch.data ?? ''} closed for everyone. Managers can now move pending balances to active and withdraw.`,
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Couldn’t close the cycle');
    } finally {
      setConfirming(false);
    }
  }

  if (!isAdmin) return null;

  return (
    <section className="card">
      <div className="label" style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
        <Icon name="flag" size={13} /> ADMIN
      </div>
      <h2 style={{ marginTop: 4 }}>Billing cycle {currentEpoch.data ?? ''}</h2>

      {confirming ? (
        <div
          style={{
            background: 'var(--color-bg-warning-tint)',
            border: '1px solid var(--color-content-warning)',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--space-4)',
          }}
        >
          <p
            style={{
              display: 'flex',
              gap: 6,
              alignItems: 'center',
              fontWeight: 700,
              color: 'var(--color-content-warning)',
              marginBottom: 6,
            }}
          >
            <Icon name="flag" size={15} />
            End cycle {currentEpoch.data ?? ''} for every member right now?
          </p>
          <p className="hint" style={{ marginBottom: 12 }}>
            Closes the current billing cycle immediately for all members, including ones who just
            subscribed — a new cycle starts right away. It does <strong>not</strong> send anyone a
            payout by itself: reader earnings just become eligible for managers to move to their
            active balance, then withdraw. This can’t be undone. Admin-only, for demo and
            operational use.
          </p>
          <div style={{ display: 'flex', gap: 8 }}>
            <Button
              type="button"
              variant="destructive"
              onClick={handleForceClose}
              disabled={forceClose.isPending}
            >
              {forceClose.isPending ? 'Closing…' : `Yes, close cycle ${currentEpoch.data ?? ''} now`}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setConfirming(false)}
              disabled={forceClose.isPending}
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <>
          <Button type="button" variant="outline" onClick={() => setConfirming(true)}>
            <Icon name="flag" size={15} />
            {`Close cycle ${currentEpoch.data ?? ''} now`}
          </Button>
          <p className="hint" style={{ marginBottom: 0 }}>
            Admin tool: ends the current billing cycle for everyone, right now.
          </p>
        </>
      )}

      {notice ? (
        <p className="success" style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <Icon name="check" size={14} /> {notice}
        </p>
      ) : null}
      {error ? <p className="error">{error}</p> : null}
    </section>
  );
}
