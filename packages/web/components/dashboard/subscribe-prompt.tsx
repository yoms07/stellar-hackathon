import Link from 'next/link';

import { Button } from '@/components/ui/button';

/**
 * Shared "not a member yet" card for any page that used to embed the full `SubscriptionCard`
 * inline (Dashboard home, Library). Subscribing now happens on `/app/packages` only — this
 * just points there instead of duplicating the price/faucet/Subscribe flow on every page.
 */
export function SubscribePrompt() {
  return (
    <section className="card center">
      <h2>Not a member yet</h2>
      <p className="hint">Subscribe to a package to unlock this.</p>
      <Button asChild>
        <Link href="/app/packages">Browse packages</Link>
      </Button>
    </section>
  );
}
