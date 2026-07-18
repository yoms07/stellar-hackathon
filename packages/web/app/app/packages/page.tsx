'use client';

import Link from 'next/link';

import { AppShell } from '@/components/app-shell/app-shell';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { formatTokenAmount } from '@/lib/contracts';
import { SAMPLE_PACKAGES } from '@/lib/catalog';
import { useConfig } from '@/services/subscription';

/** In-app packages page: the live testnet bundle plus the illustrative pilot lineup. */
export default function AppPackagesPage() {
  const config = useConfig();
  const livePrice = config.data ? formatTokenAmount(config.data.price) : '10';

  return (
    <AppShell>
      <main className="shell shell-wide">
        <header className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full pl-3 pr-4 py-1.5 bg-[color-mix(in_srgb,var(--color-content-accent)_6%,transparent)] text-[11px] tracking-[0.2em] uppercase text-[var(--color-content-accent)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-content-accent)]" />
            Packages
          </div>
          <h1 className="mt-5 font-serif font-medium tracking-tight leading-[1.05] text-[2rem] md:text-[2.6rem] text-[var(--color-content-primary)]">
            One subscription, many perks.
          </h1>
          <p className="mt-4 max-w-xl mx-auto text-[15px] leading-relaxed text-[var(--color-content-secondary)]">
            Pay in USDC on Stellar. Every payment splits on-chain, per member, across the content
            you actually read.
          </p>
        </header>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <article className="card-standard px-7 py-8 flex flex-col ring-1 ring-[var(--color-border-accent)]">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-[1.4rem] leading-tight text-[var(--color-content-primary)]">
                Community Bundle
              </h3>
              <span className="pill ok">LIVE</span>
            </div>

            {config.isLoading ? (
              <Skeleton className="mt-4 h-9 w-32 rounded-md" />
            ) : (
              <p className="mt-4 font-serif text-[2.2rem] leading-none text-[var(--color-content-primary)]">
                {livePrice} USDC <span className="text-[14px] font-sans text-[var(--color-content-secondary)]">/ month</span>
              </p>
            )}

            <div className="mt-6 border-t border-[var(--color-border-medium)]" />

            <p className="mt-6 text-[14px] leading-relaxed text-[var(--color-content-secondary)] flex-1">
              The bundle currently live on testnet. One payment unlocks every whitelisted
              community's library.
            </p>

            <Link href="/dashboard" className="mt-8 block">
              <Button type="button" className="w-full">
                Subscribe
              </Button>
            </Link>
          </article>

          {SAMPLE_PACKAGES.map((pkg) => (
            <article key={pkg.name} className="card-standard px-7 py-8 flex flex-col opacity-80">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-[1.4rem] leading-tight text-[var(--color-content-primary)]">
                  {pkg.name}
                </h3>
                <span className="pill">SOON</span>
              </div>

              <p className="mt-4 font-serif text-[2.2rem] leading-none text-[var(--color-content-primary)]">
                10 USDC <span className="text-[14px] font-sans text-[var(--color-content-secondary)]">/ month</span>
              </p>

              <div className="mt-6 border-t border-[var(--color-border-medium)]" />

              <ul className="mt-6 space-y-4 flex-1">
                {pkg.perks.map((perk) => (
                  <li key={perk.title} className="flex items-start gap-2.5">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[var(--color-content-secondary)] shrink-0" />
                    <div>
                      <p className="text-[14px] text-[var(--color-content-primary)]">{perk.title}</p>
                      <p className="mt-0.5 text-[12px] text-[var(--color-content-secondary)]">from {perk.from}</p>
                    </div>
                  </li>
                ))}
              </ul>

              <p className="mt-8 text-center text-[12px] text-[var(--color-content-secondary)]">Coming soon</p>
            </article>
          ))}
        </div>

        <p className="mt-12 text-center text-[12px] text-[var(--color-content-secondary)]">
          Illustrative lineup from pilot planning. Testnet demo pricing.
        </p>
      </main>
    </AppShell>
  );
}
