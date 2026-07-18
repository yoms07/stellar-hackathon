'use client';

import Link from 'next/link';

import { Icon } from '@/components/ui/icon';

import { SubscribePrompt } from './subscribe-prompt';

/**
 * Dashboard home's empty state for a signed-in wallet that isn't a member yet. Subscribing
 * lives on `/app/packages` only (moved out of both Dashboard and Library) — this just points
 * there instead of duplicating the price/faucet/Subscribe flow.
 */
export function SubscribeGate() {
  return (
    <>
      <SubscribePrompt />
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
