'use client';

import { AppShell } from '@/components/app-shell/app-shell';
import { BenefitsPanel } from '@/components/dashboard/benefits-panel';

/** `/dashboard/benefits` — membership card + one card per partner community's benefits
 *  (prototype benefits.html, SPEC.md Screen 3). Gating lives in `BenefitsPanel`. */
export default function BenefitsPage() {
  return (
    <AppShell>
      <main className="shell shell-wide">
        <header>
          <span className="label">Benefits</span>
          <p className="tagline" style={{ marginTop: 0 }}>
            What your subscription unlocks
          </p>
        </header>

        <BenefitsPanel />
      </main>
    </AppShell>
  );
}
