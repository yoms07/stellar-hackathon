'use client';

import Link from 'next/link';
import { SAMPLE_PACKAGES } from '@/lib/catalog';

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
          <Link href="/communities" className="hover:text-[var(--color-content-accent)] transition-colors">
            Communities
          </Link>
          <Link href="/dashboard" className="hover:text-[var(--color-content-accent)] transition-colors">
            Dashboard
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default function PackagesPage() {
  return (
    <div className="relative overflow-hidden">
      <Header />

      <main className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 pt-14 md:pt-16 pb-24">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full pl-3 pr-4 py-1.5 bg-[color-mix(in_srgb,var(--color-content-accent)_6%,transparent)] text-[11px] tracking-[0.2em] uppercase text-[var(--color-content-accent)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-content-accent)]" />
            Packages
          </div>
          <h1 className="mt-7 font-serif font-medium tracking-tight leading-[1.05] text-[2.4rem] md:text-[3.2rem] text-[var(--color-content-primary)]">
            One package, many perks.
          </h1>
          <p className="mt-6 max-w-xl mx-auto text-[15px] leading-relaxed text-[var(--color-content-secondary)]">
            Each package bundles perks from several community partners. Pay in USDC on Stellar, split on-chain
            by the pool's distribution scheme.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6">
          {SAMPLE_PACKAGES.map((pkg) => (
            <div key={pkg.name} className="card-standard px-7 py-8 flex flex-col">
              <h3 className="font-serif text-[1.4rem] leading-tight text-[var(--color-content-primary)]">
                {pkg.name}
              </h3>
              <p className="mt-4 font-serif text-[2.4rem] leading-none text-[var(--color-content-primary)]">
                10 USDC <span className="text-[14px] font-sans text-[var(--color-content-secondary)]">/ month</span>
              </p>

              <div className="mt-6 border-t border-[var(--color-border-medium)]" />

              <ul className="mt-6 space-y-4 flex-1">
                {pkg.perks.map((perk) => (
                  <li key={perk.title} className="flex items-start gap-2.5">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[var(--color-content-accent)] shrink-0" />
                    <div>
                      <p className="text-[14px] text-[var(--color-content-primary)]">{perk.title}</p>
                      <p className="mt-0.5 text-[12px] text-[var(--color-content-secondary)]">from {perk.from}</p>
                    </div>
                  </li>
                ))}
              </ul>

              <Link href="/dashboard" className="mt-8 block">
                <button className="group w-full inline-flex items-center justify-center gap-3 bg-gradient-to-br from-[#fce27e] via-[#fad657] to-[#c9a83f] text-[var(--color-content-on-accent)] font-semibold text-[14px] tracking-wide px-7 py-3 rounded-full transition-all hover:shadow-[0_10px_40px_-6px_rgba(250,214,87,0.75)] hover:translate-y-[-1px] shadow-[0_8px_30px_-8px_rgba(250,214,87,0.55)]">
                  Get early access
                  <span className="w-8 h-8 rounded-full bg-black/10 flex items-center justify-center transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:translate-x-1 group-hover:-translate-y-[1px]">
                    →
                  </span>
                </button>
              </Link>
            </div>
          ))}
        </div>

        <p className="mt-14 text-center text-[12px] text-[var(--color-content-secondary)]">
          Illustrative lineup from pilot planning. Partner onboarding in progress; testnet demo pricing.
        </p>
      </main>
    </div>
  );
}
