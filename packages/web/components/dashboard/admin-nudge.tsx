'use client';

import { useWallet } from '@/providers/wallet-provider';
import { useCurrentEpoch } from '@/services/manager';
import { useConfig } from '@/services/subscription';

import { ActionStrip } from './action-strip';

/**
 * Contract-admin billing-cycle nudge. Self-gates on `Config.admin === connected wallet` (same
 * check as `AdminEpochPanel`) so callers can render it unconditionally.
 *
 * Deliberately not a `.stat-chip` alongside Membership/Community/Earnings: those are the
 * wallet's *own* numbers, read often; force-closing a billing cycle is a protocol-operator
 * lever, used rarely and not something to invite an idle click on. Keeping it as its own
 * slim strip (demoted near the bottom, same placement `PartnerStrip` used for "one more
 * thing you could do") signals it's a different category of action, without reaching for
 * warning colors just for wayfinding — DESIGN.md reserves those for genuine status feedback,
 * and this isn't a warning until you're on the confirm step inside `/dashboard/admin` itself.
 */
export function AdminNudge() {
  const { address } = useWallet();
  const config = useConfig();
  const currentEpoch = useCurrentEpoch();

  const isAdmin = !!address && config.data?.admin === address;
  if (!isAdmin) return null;

  return (
    <ActionStrip
      icon="flag"
      title="Contract admin"
      hint={`Billing cycle ${currentEpoch.data ?? '…'} is open.`}
      href="/dashboard/admin"
      cta="Manage cycle"
    />
  );
}
