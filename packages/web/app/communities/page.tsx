'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { PARTNER_COMMUNITIES } from '@/lib/catalog';

function Logo() {
  return <img src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/logo-mark.png`} alt="Komunify" className="h-8 w-auto shrink-0" />;
}

function Header() {
  return (
    <header className="relative z-20 max-w-7xl mx-auto px-6 md:px-10 pt-6">
      <div className="flex items-center justify-between nav-shell backdrop-blur-md px-5 md:px-6 py-3">
        <Link href="/" className="flex items-center gap-3">
          <div className="text-[var(--color-content-accent)]">
            <Logo />
          </div>
          <span className="font-serif text-lg tracking-[0.15em] text-[var(--color-content-primary)]">KOMUNIFY</span>
        </Link>

        <nav className="hidden md:flex items-center gap-10 text-[13px] tracking-wide text-[var(--color-content-secondary)]">
          <Link href="/packages" className="hover:text-[var(--color-content-accent)] transition-colors">
            Packages
          </Link>
          <Link href="/dashboard" className="hover:text-[var(--color-content-accent)] transition-colors">
            Dashboard
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default function CommunitiesPage() {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return PARTNER_COMMUNITIES;
    return PARTNER_COMMUNITIES.filter(
      (community) =>
        community.name.toLowerCase().includes(q) || community.description.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <div className="relative overflow-hidden">
      <Header />

      <main className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 pt-14 md:pt-16 pb-24">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full pl-3 pr-4 py-1.5 bg-[color-mix(in_srgb,var(--color-content-accent)_6%,transparent)] text-[11px] tracking-[0.2em] uppercase text-[var(--color-content-accent)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-content-accent)]" />
            Community partners
          </div>
          <h1 className="mt-7 font-serif font-medium tracking-tight leading-[1.05] text-[2.4rem] md:text-[3.2rem] text-[var(--color-content-primary)]">
            Every community in one subscription.
          </h1>
          <p className="mt-6 max-w-xl mx-auto text-[15px] leading-relaxed text-[var(--color-content-secondary)]">
            Browse the partners whose perks ship with Komunify. One on-chain subscription unlocks them all.
          </p>
        </div>

        <div className="mt-10 max-w-md mx-auto">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search communities"
            className="w-full bg-transparent border border-[color-mix(in_srgb,var(--color-content-secondary)_25%,transparent)] rounded-md px-4 py-3 text-[14px] text-[var(--color-content-primary)] placeholder:text-[var(--color-content-secondary)] focus:outline-none focus:border-[var(--color-content-accent)] transition-colors"
          />
        </div>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map((community) => (
            <article
              key={community.name}
              className="group card-standard card-hoverable h-full px-6 py-6 md:px-7 md:py-7 shadow-[inset_0_1px_1px_rgba(255,255,255,0.04)] flex flex-col"
            >
              <div className="relative z-[1] flex flex-1 flex-col">
                <div className="w-14 h-14 shrink-0 rounded-full overflow-hidden ring-1 ring-[color-mix(in_srgb,var(--color-content-accent)_25%,transparent)]">
                  <img
                    src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}${community.logo}`}
                    alt={community.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <h3 className="mt-6 font-serif text-[1.35rem] leading-tight text-[var(--color-content-primary)]">
                  {community.name}
                </h3>
                <p className="mt-3 text-[14px] leading-relaxed text-[var(--color-content-secondary)]">
                  {community.description}
                </p>
                <span className="mt-4 self-start inline-flex rounded-full border border-[color-mix(in_srgb,var(--color-content-accent)_20%,transparent)] bg-[var(--color-bg-accent-tint)] px-3 py-1.5 font-mono text-[11px] tracking-wide text-[color-mix(in_srgb,var(--color-content-accent)_80%,transparent)]">
                  {community.badge}
                </span>
              </div>
            </article>
          ))}

          {filtered.length === 0 && (
            <p className="col-span-full text-center text-[14px] text-[var(--color-content-secondary)]">
              No communities match that search.
            </p>
          )}
        </div>

        <p className="mt-14 text-center text-[12px] text-[var(--color-content-secondary)]">
          More partners join through the DAO listing flow.
        </p>
      </main>
    </div>
  );
}
