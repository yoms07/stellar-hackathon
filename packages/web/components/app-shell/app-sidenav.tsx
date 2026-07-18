'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { ThemeToggle } from '@/components/theme-toggle';
import { useWallet } from '@/providers/wallet-provider';
import { useMe, useSignOut } from '@/services/auth';
import { useCommunities } from '@/services/community';
import { useIsManager } from '@/services/manager';
import { useConfig } from '@/services/subscription';

const SIDEBAR_STORAGE_KEY = 'komunify-app-sidebar';

function truncateAddress(address: string) {
  return `${address.slice(0, 4)}…${address.slice(-4)}`;
}

const memberNavItems = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
      </svg>
    ),
  },
  {
    label: 'Library',
    href: '/dashboard/library',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M5 4.5A1.5 1.5 0 0 1 6.5 3H16l3 3v14.5a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 5 20.5v-16Z" />
        <path d="M16 3v3.5A1.5 1.5 0 0 0 17.5 8H21" />
        <path d="M9 13h6M9 17h6" />
      </svg>
    ),
  },
  {
    label: 'Benefits',
    href: '/dashboard/benefits',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="3.5" y="9" width="17" height="11" rx="1.5" />
        <path d="M3.5 13h17" />
        <path d="M12 9v11" />
        <path d="M12 9c-1.4 0-4-.7-4-3a2.3 2.3 0 0 1 4-1.5c.4-.6 1-1.5 2-1.5a2.3 2.3 0 0 1 2 3.5c-.6.9-2.3 2.5-4 2.5Z" />
      </svg>
    ),
  },
  {
    label: 'Communities',
    href: '/app/communities',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="9" cy="8" r="3" />
        <circle cx="17" cy="9" r="2.5" />
        <path d="M3.5 19.5c0-3 2.5-5.5 5.5-5.5s5.5 2.5 5.5 5.5" />
        <path d="M15 15.5c2.4 0 4.5 1.9 4.5 4" />
      </svg>
    ),
  },
  {
    label: 'Packages',
    href: '/app/packages',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="m3.5 8 8.5-4.5L20.5 8 12 12.5 3.5 8Z" />
        <path d="M3.5 8v8L12 20.5 20.5 16V8" />
        <path d="M12 12.5V20.5" />
      </svg>
    ),
  },
] as const;

/** Manager-only workflows (D-006/D-011): shown only once `is_manager(wallet)` is true. */
const managerNavItems = [
  {
    label: 'Community',
    href: '/dashboard/community',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M4 21V9.5L12 4l8 5.5V21" />
        <path d="M9 21v-6h6v6" />
      </svg>
    ),
  },
  {
    label: 'Earnings',
    href: '/dashboard/earnings',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="8.5" />
        <path d="M12 7.5v9M9.5 15c0 1.1 1.1 2 2.5 2s2.5-.7 2.5-1.8-1-1.6-2.5-2-2.5-.9-2.5-2S10.6 9.5 12 9.5s2.2.5 2.4 1.3" />
      </svg>
    ),
  },
] as const;

/** Contract-admin-only tools (D-012): a separate on-chain role from `is_manager`, shown only
 *  when the connected wallet matches `Config.admin`. */
const adminNavItems = [
  {
    label: 'Admin',
    href: '/dashboard/admin',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M5 21V4h11l3 3.5H10V13h9l-9 8Z" />
      </svg>
    ),
  },
] as const;

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

/** One labeled group of nav links, shared by the Member/Manager/Admin sections below. */
function NavGroup({
  title,
  items,
  collapsed,
  pathname,
  onNavigate,
}: {
  title: string;
  items: readonly NavItem[];
  collapsed: boolean;
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <nav aria-label={`${title} navigation`} className="flex flex-col gap-0.5">
      <p
        className={`mb-1.5 text-[11px] font-medium uppercase tracking-[0.06em] text-[var(--color-content-secondary)] ${
          collapsed ? 'hidden' : 'block'
        }`}
      >
        {title}
      </p>

      {items.map((item) => {
        // Exact match only for '/dashboard': its sub-routes (Library, Community, ...) are
        // sibling nav items, not sub-routes of the Dashboard link itself.
        const isActive =
          pathname === item.href ||
          (item.href !== '/dashboard' && pathname.startsWith(`${item.href}/`));

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            aria-current={isActive ? 'page' : undefined}
            aria-label={item.label}
            title={collapsed ? item.label : undefined}
            className={`flex items-center rounded-[var(--radius-md)] py-2 text-[15px] transition-colors duration-150 ${
              collapsed ? 'justify-center gap-0 px-0' : 'gap-2 px-2.5'
            } ${
              isActive
                ? 'bg-[var(--color-bg-accent-tint)] font-semibold text-[var(--color-content-accent)]'
                : 'text-[var(--color-content-secondary)] hover:bg-[color-mix(in_srgb,var(--color-content-accent)_6%,transparent)] hover:text-[var(--color-content-primary)]'
            } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-content-accent)]`}
          >
            <span className="inline-flex shrink-0 items-center [&>svg]:h-[18px] [&>svg]:w-[18px] [&>svg]:stroke-current [&>svg]:stroke-[1.75]">
              {item.icon}
            </span>
            <span className={collapsed ? 'hidden' : 'inline'}>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

interface SidenavContentProps {
  collapsed: boolean;
  onToggleCollapse?: () => void;
  onNavigate?: () => void;
}

export function SidenavContent({ collapsed, onToggleCollapse, onNavigate }: SidenavContentProps) {
  const pathname = usePathname();
  const { isConnected, address, connecting, connect, disconnect } = useWallet();
  const me = useMe();
  const signOut = useSignOut();
  const isAuthed = !!me.data;
  const communities = useCommunities();
  const partners = (communities.data?.communities ?? []).slice(0, 4);
  const isManager = useIsManager();
  const config = useConfig();
  const isAdmin = !!address && config.data?.admin === address;

  async function handleSignOut() {
    await signOut.mutateAsync();
    disconnect();
  }

  return (
    <>
      <div
        className={`flex items-center justify-between gap-3 ${
          collapsed ? 'flex-col' : 'flex-row'
        }`}
      >
        <Link
          href="/"
          aria-label="Komunify home"
          className={`inline-flex items-center ${collapsed ? 'gap-0' : 'gap-3'}`}
        >
          <img
            src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/logo-mark.png`}
            alt=""
            className="h-8 w-auto shrink-0"
          />
          <span
            className={`whitespace-nowrap font-sans text-lg font-bold tracking-[0.15em] ${
              collapsed ? 'hidden' : 'inline'
            }`}
          >
            <span className="text-[var(--color-content-accent)]">K</span>
            <span className="text-[var(--color-content-primary)]">OMUNIFY</span>
          </span>
        </Link>

        {onToggleCollapse ? (
          <button
            type="button"
            onClick={onToggleCollapse}
            aria-expanded={!collapsed}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-[var(--radius-md)] border border-[var(--color-border-medium)] bg-[var(--color-bg-input)] text-[var(--color-content-secondary)] transition-colors duration-150 hover:border-[var(--color-border-accent)] hover:bg-[var(--color-bg-accent-tint)] hover:text-[var(--color-content-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-content-accent)]"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              aria-hidden="true"
              className="h-4 w-4 shrink-0 stroke-current"
            >
              <path
                d={collapsed ? 'm9 18 6-6-6-6' : 'm15 18-6-6 6-6'}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        ) : null}
      </div>

      <NavGroup title="Member" items={memberNavItems} collapsed={collapsed} pathname={pathname} onNavigate={onNavigate} />

      {isManager.data ? (
        <NavGroup title="Manager" items={managerNavItems} collapsed={collapsed} pathname={pathname} onNavigate={onNavigate} />
      ) : null}

      {isAdmin ? (
        <NavGroup title="Admin" items={adminNavItems} collapsed={collapsed} pathname={pathname} onNavigate={onNavigate} />
      ) : null}

      {partners.length > 0 ? (
        <nav aria-label="Partner communities" className="flex flex-col gap-0.5">
          <p
            className={`mb-1.5 text-[11px] font-medium uppercase tracking-[0.06em] text-[var(--color-content-secondary)] ${
              collapsed ? 'hidden' : 'block'
            }`}
          >
            Partners
          </p>

          {partners.map((c) => (
            <Link
              key={c.wallet}
              href={`/community/${c.wallet}`}
              onClick={onNavigate}
              title={collapsed ? c.name : undefined}
              className={`flex items-center rounded-[var(--radius-md)] py-2 text-[15px] text-[var(--color-content-secondary)] transition-colors duration-150 hover:bg-[color-mix(in_srgb,var(--color-content-accent)_6%,transparent)] hover:text-[var(--color-content-primary)] ${
                collapsed ? 'justify-center gap-0 px-0' : 'gap-2 px-2.5'
              } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-content-accent)]`}
            >
              {c.logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={c.logo}
                  alt=""
                  className="h-6 w-6 shrink-0 rounded-full border border-[var(--color-border-medium)] object-cover"
                />
              ) : (
                <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[var(--color-border-medium)] bg-[var(--color-bg-input)] text-[11px] font-bold">
                  {c.name.charAt(0).toUpperCase()}
                </span>
              )}
              <span className={collapsed ? 'hidden' : 'inline'}>{c.name}</span>
            </Link>
          ))}
        </nav>
      ) : null}

      <div className={`mt-auto flex flex-col items-start gap-2 text-[13px] text-[var(--color-content-secondary)] ${collapsed ? 'hidden' : 'flex'}`}>
        <ThemeToggle />
        {isConnected && address ? (
          <>
            <code
              title={address}
              className={isAuthed ? 'inline-flex items-center gap-1 text-[var(--color-content-success)]' : undefined}
            >
              {truncateAddress(address)}
            </code>
            <button
              type="button"
              onClick={isAuthed ? handleSignOut : disconnect}
              disabled={isAuthed ? signOut.isPending : false}
              className="disconnect-link bg-transparent p-0"
            >
              {isAuthed ? 'Sign out' : 'Disconnect'}
            </button>
          </>
        ) : (
          <button type="button" onClick={connect} disabled={connecting} className="disconnect-link bg-transparent p-0">
            {connecting ? 'Connecting…' : 'Connect'}
          </button>
        )}
        <span className="text-[11px] font-medium uppercase tracking-[0.06em]">TESTNET</span>
      </div>
    </>
  );
}

export function AppSidenav() {
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const storedValue = window.localStorage.getItem(SIDEBAR_STORAGE_KEY);

    if (storedValue !== null) {
      setCollapsed(storedValue === 'true');
    }
  }, []);

  function toggleSidebar() {
    setCollapsed((currentValue) => {
      const nextValue = !currentValue;
      window.localStorage.setItem(SIDEBAR_STORAGE_KEY, String(nextValue));
      return nextValue;
    });
  }

  return (
    <aside
      className={`sticky top-0 hidden h-screen shrink-0 flex-col gap-8 overflow-y-auto border-r border-[var(--color-border-medium)] bg-[var(--color-bg-elevated)] px-4 py-5 transition-[width] duration-200 ease-out min-[901px]:flex ${
        collapsed ? 'w-16' : 'w-[232px]'
      }`}
    >
      <SidenavContent collapsed={collapsed} onToggleCollapse={toggleSidebar} />
    </aside>
  );
}
