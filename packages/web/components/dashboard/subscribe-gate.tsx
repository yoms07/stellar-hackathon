'use client';

import Link from 'next/link';

import { Icon } from '@/components/ui/icon';

import { SubscriptionCard } from './subscription-card';

/**
 * Dashboard/Library empty state for a signed-in wallet that isn't a member yet: the existing
 * subscription card (price, faucet, Subscribe CTA, balance gate — all unchanged logic), full
 * width like every other card on the page (not a centered pay column) so it reads as part of
 * the dashboard rather than a separate payment page. The full content library lives on
 * `/dashboard/library` once subscribed — this just points there instead of duplicating it.
 */
export function SubscribeGate() {
  return (
    <>
      <SubscriptionCard />
      <Link
        href="/dashboard/library"
        className="hint"
        style={{ display: 'inline-flex', gap: 5, alignItems: 'center' }}
      >
        <Icon name="lock" size={13} /> See what's in the library first
      </Link>
    </>
  );
}
