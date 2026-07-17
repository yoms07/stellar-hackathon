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
  return (
    <AppShell>
      <main className="shell shell-wide">
        <header>
          <span className="label">Packages</span>
          <p className="tagline" style={{ marginTop: 0 }}>
            One subscription, many perks
          </p>
          <p className="hint">
            Pay in USDC on Stellar. Every payment splits by the pool&apos;s distribution scheme.
          </p>
        </header>

        <LivePackageCard />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {SAMPLE_PACKAGES.map((pkg) => (
            <section key={pkg.name} className="card">
              <div className="row" style={{ alignItems: 'center' }}>
                <h2 style={{ margin: 0 }}>{pkg.name}</h2>
                <span className="pill">COMING SOON</span>
              </div>
              <p className="balance">
                10 USDC <span className="label" style={{ textTransform: 'none', fontSize: 13 }}>/ month</span>
              </p>

              <ul style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 12, padding: 0, listStyle: 'none' }}>
                {pkg.perks.map((perk) => (
                  <li key={perk.title}>
                    <p style={{ margin: 0 }}>{perk.title}</p>
                    <span className="hint">from {perk.from}</span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <p className="hint" style={{ textAlign: 'center' }}>
          Illustrative lineup from pilot planning. New packages list through the DAO proposal flow.
        </p>
      </main>
    </AppShell>
  );
}

function LivePackageCard() {
  const config = useConfig();

  return (
    <section className="card">
      <div className="row" style={{ alignItems: 'center' }}>
        <h2 style={{ margin: 0 }}>Community Bundle</h2>
        <span className="pill ok">LIVE</span>
      </div>

      {config.isLoading ? (
        <Skeleton className="h-9 w-32 rounded-md" style={{ marginTop: 6 }} />
      ) : (
        <p className="balance">
          {config.data ? formatTokenAmount(config.data.price) : '10'} USDC{' '}
          <span className="label" style={{ textTransform: 'none', fontSize: 13 }}>
            / month
          </span>
        </p>
      )}

      <p className="hint">The bundle currently live on testnet.</p>

      <Link href="/dashboard">
        <Button type="button">Subscribe</Button>
      </Link>
    </section>
  );
}
