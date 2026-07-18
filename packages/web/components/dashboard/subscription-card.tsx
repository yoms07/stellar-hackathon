'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Skeleton } from '@/components/ui/skeleton';
import { Toast, type ToastState } from '@/components/ui/toast';
import { ExplorerLink, TestnetNote } from '@/components/ui/trust';
import { formatTokenAmount } from '@/lib/contracts';
import { getStellarConfig, txExplorerUrl } from '@/lib/stellar';
import {
  useConfig,
  useFaucet,
  useFaucetAvailableAt,
  useSubscribe,
  useSubscriptionStatus,
  useUsdcBalance,
} from '@/services/subscription';

/** Member subscription status card (DESIGN.md §4.2 "Subscription card"): price as `.balance`,
 *  status pill, faucet + subscribe CTAs. */
export function SubscriptionCard({
  title = 'Membership',
  subtitle = 'Single subscription, every partner community',
}: {
  title?: string;
  subtitle?: string;
}) {
  const status = useSubscriptionStatus();
  const config = useConfig();
  const balance = useUsdcBalance();
  const faucetAt = useFaucetAvailableAt();
  const subscribe = useSubscribe();
  const faucet = useFaucet();
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastState | null>(null);

  const faucetReady = !faucetAt.data || faucetAt.data === 0n || faucetAt.data * 1000n <= BigInt(Date.now());
  const insufficientBalance =
    balance.data !== undefined && config.data !== undefined && balance.data < config.data.price;

  async function handleFaucet() {
    setError(null);
    try {
      await faucet.mutateAsync();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Faucet call failed');
    }
  }

  async function handleSubscribe() {
    setError(null);
    setToast({ type: 'info', message: 'Confirming your subscription…' });
    try {
      const sent = await subscribe.mutateAsync();
      const hash = sent.sendTransactionResponse?.hash;
      const { network } = getStellarConfig();
      const href = hash ? (txExplorerUrl(hash, network) ?? undefined) : undefined;
      setToast({ type: 'success', message: "You're in.", href, linkLabel: 'View transaction' });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Subscribe failed');
      setToast({ type: 'error', message: 'Subscribe failed. Try again.' });
    }
  }

  const deficit =
    insufficientBalance && config.data && balance.data !== undefined
      ? config.data.price - balance.data
      : undefined;

  return (
    <section className="card">
      {/* Identity: what this is + current state, together — the pill reads as a status on the
          title, not a fact buried mid-card. */}
      <div className="row" style={{ marginBottom: 0 }}>
        <h2 style={{ margin: 0 }}>{title}</h2>
        {status.isLoading ? (
          <Skeleton className="h-5 w-24 rounded-full" />
        ) : status.data?.isActive ? (
          <span className="pill ok">
            <Icon name="check" size={12} /> ACTIVE
          </span>
        ) : (
          <span className="pill warn">NOT A MEMBER</span>
        )}
      </div>
      <span className="label">{subtitle}</span>

      {/* The number that matters, with the mandatory mock-token caveat attached directly to
          it (D-002) instead of as an unrelated footnote at the bottom of the card. */}
      {config.isLoading ? (
        <Skeleton className="h-9 w-32 rounded-md" style={{ marginTop: 6 }} />
      ) : (
        <p className="balance" style={{ marginBottom: 4 }}>
          {config.data ? formatTokenAmount(config.data.price) : '…'}{' '}
          <ExplorerLink target="usdc" title="View the USDC token contract on Stellar Expert">
            USDC
          </ExplorerLink>
          <span className="label" style={{ textTransform: 'none', fontSize: 13, marginLeft: 6 }}>
            / month
          </span>
        </p>
      )}
      <TestnetNote style={{ marginBottom: 16 }} />

      {/* Your situation, right before the action it affects: balance vs. the faucet that tops
          it up, as one small utility row — not a second button competing with Subscribe. */}
      <div className="row tight" style={{ justifyContent: 'space-between', marginBottom: 10 }}>
        <span className="label" style={{ textTransform: 'none' }}>
          Your wallet: {balance.data !== undefined ? formatTokenAmount(balance.data) : '…'} USDC
        </span>
        {!status.data?.isActive ? (
          <button
            type="button"
            className="stat-link"
            onClick={handleFaucet}
            disabled={faucet.isPending || !faucetReady}
            style={!faucetReady ? { opacity: 0.5, cursor: 'not-allowed' } : undefined}
          >
            <Icon name="coins" size={13} />
            {faucet.isPending
              ? 'Requesting…'
              : faucetReady
                ? 'Get free test USDC'
                : 'Faucet on cooldown'}
          </button>
        ) : null}
      </div>

      {/* The one thing to do. Full width so it reads as the single next step, not one of two
          equal options. */}
      <Button
        type="button"
        onClick={handleSubscribe}
        disabled={subscribe.isPending || !!status.data?.isActive || insufficientBalance}
        style={{
          width: '100%',
          ...(insufficientBalance ? { opacity: 0.5, cursor: 'not-allowed' } : undefined),
        }}
      >
        {subscribe.isPending ? (
          'Subscribing…'
        ) : status.data?.isActive ? (
          <>
            <Icon name="check" size={15} /> You&apos;re in
          </>
        ) : (
          <>
            <Icon name="key" size={15} /> Subscribe
          </>
        )}
      </Button>
      {deficit !== undefined ? (
        <p className="hint" style={{ marginBottom: 0 }}>
          Need {formatTokenAmount(deficit)} more USDC — the faucet above is free.
        </p>
      ) : null}
      {error ? <p className="error">{error}</p> : null}

      {toast ? <Toast toast={toast} onDismiss={() => setToast(null)} /> : null}
    </section>
  );
}
