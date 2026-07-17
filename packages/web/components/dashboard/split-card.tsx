'use client';

import { formatTokenAmount } from '@/lib/contracts';
import { getStellarConfig } from '@/lib/stellar';
import { useConfig } from '@/services/subscription';

const SPLIT = [
  { name: 'Community partner', pct: 45 },
  { name: 'Community manager', pct: 45 },
  { name: 'Komunify platform', pct: 10 },
] as const;

function shortHash(id: string): string {
  return id.length > 12 ? `${id.slice(0, 6)}…${id.slice(-6)}` : id;
}

/**
 * "03 DISTRIBUTION SCHEME" card (prototype subscribe.html split-flow pattern). Reuses the
 * existing `useConfig` price query and the contract id already read from
 * `getStellarConfig()` (`NEXT_PUBLIC_KOMUNIFY_CONTRACT_ID`); each pool's split is set by
 * that pool's DAO governance, so the percentages here are illustrative, not fixed.
 */
export function SplitCard() {
  const config = useConfig();
  const { komunifyContractId } = getStellarConfig();
  const price = config.data?.price;

  return (
    <section className="card split-flow">
      <div className="num-label">
        <span className="num">03</span> DISTRIBUTION SCHEME
      </div>
      <p className="hint">
        The Soroban contract splits every payment the moment it settles, by a mix each pool&rsquo;s DAO
        sets — the shares below are illustrative.
      </p>
      <div>
        {SPLIT.map((s) => (
          <div className="alloc-row" key={s.name}>
            <span className="alloc-name">{s.name}</span>
            <span className="alloc-pct">{s.pct}%</span>
            <span className="alloc-amt">
              {price !== undefined ? formatTokenAmount((price * BigInt(s.pct)) / 100n) : '…'} USDC
            </span>
            <div className="alloc-track">
              <div className="alloc-fill" style={{ width: `${s.pct}%` }} />
            </div>
          </div>
        ))}
      </div>
      <p className="hint">
        Split contract{' '}
        <code title={komunifyContractId || undefined}>
          {komunifyContractId ? shortHash(komunifyContractId) : '—'}
        </code>
      </p>
    </section>
  );
}
