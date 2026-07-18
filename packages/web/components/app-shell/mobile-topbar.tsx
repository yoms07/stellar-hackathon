'use client';

import Link from 'next/link';

interface MobileTopbarProps {
  open: boolean;
  onOpenNav: () => void;
}

export function MobileTopbar({ open, onOpenNav }: MobileTopbarProps) {
  return (
    <div className="sticky top-0 z-30 flex items-center gap-3 border-b border-[var(--color-border-medium)] bg-[var(--color-bg-primary)] px-4 py-3 min-[901px]:hidden">
      <button
        type="button"
        onClick={onOpenNav}
        aria-label="Open menu"
        aria-expanded={open}
        aria-controls="mobile-nav-drawer"
        className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-[var(--radius-md)] border border-[var(--color-border-medium)] bg-transparent text-[var(--color-content-primary)] transition-colors duration-150 hover:border-[var(--color-border-accent)] hover:text-[var(--color-content-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-content-accent)]"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

      <Link href="/" aria-label="Komunify home" className="inline-flex items-center gap-2.5">
        <img
          src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/logo-mark.png`}
          alt=""
          className="h-6 w-auto shrink-0"
        />
        <span className="whitespace-nowrap font-sans text-base font-bold tracking-[0.15em]">
          <span className="text-[var(--color-content-accent)]">K</span>
          <span className="text-[var(--color-content-primary)]">OMUNIFY</span>
        </span>
      </Link>
    </div>
  );
}
