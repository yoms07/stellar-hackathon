'use client';

import Link from 'next/link';

import { ThemeToggle } from '@/components/theme-toggle';
import { useWallet } from '@/providers/wallet-provider';
import { useMe, useSignOut } from '@/services/auth';

function truncateAddress(address: string) {
  return `${address.slice(0, 4)}…${address.slice(-4)}`;
}

/**
 * Slim topbar for the /start funnel: logo + wallet chip, no sidenav. `/start` is a linear
 * guided flow, not a member area, so it keeps its own topbar rather than the sidenav
 * dashboard shell.
 */
export function StartTopbar() {
  const { isConnected, address, disconnect } = useWallet();
  const me = useMe();
  const signOut = useSignOut();
  const isAuthed = !!me.data;

  async function handleDisconnect() {
    if (isAuthed) await signOut.mutateAsync();
    disconnect();
  }

  return (
    <div className="topbar">
      <Link href="/" className="logo">
        <img
          src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/logo-mark.png`}
          alt=""
          className="logo-mark"
          style={{ height: 26, width: 'auto', display: 'block' }}
        />
        Komunify
      </Link>
      <nav className="topbar-nav">
        <ThemeToggle />
        {isConnected && address ? (
          <>
            <code title={address}>{truncateAddress(address)}</code>
            <button type="button" className="disconnect-link" onClick={handleDisconnect} disabled={signOut.isPending}>
              Disconnect
            </button>
          </>
        ) : null}
      </nav>
    </div>
  );
}
