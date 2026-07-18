'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Skeleton } from '@/components/ui/skeleton';
import { useWallet } from '@/providers/wallet-provider';
import { useMyContent, useSetContentActive } from '@/services/manager';
import type { ManagerContent } from '@/services/manager';

/**
 * One published item, with its live/hidden status and a visibility toggle. `set_content_active`
 * requires the content's creator to sign (contract: `NotContentCreator` otherwise), so the toggle
 * only appears when the connected wallet created the item; co-managed content shows a note instead.
 */
function ContentRow({ item }: { item: ManagerContent }) {
  const { address } = useWallet();
  const setActive = useSetContentActive();
  const [error, setError] = useState<string | null>(null);

  const isCreator = item.creator === address;

  async function handleToggle() {
    setError(null);
    try {
      await setActive.mutateAsync({
        contentId: BigInt(item.id),
        creator: item.creator,
        active: !item.active,
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Couldn’t update visibility. Try again.');
    }
  }

  return (
    <div className="content-manage-row">
      <div className="cmr-lead">
        <div className="cmr-id-line">
          <span className="cmr-id">#{item.id}</span>
          {item.active ? (
            <span className="pill ok">
              <Icon name="check" size={11} /> LIVE
            </span>
          ) : (
            <span className="pill warn">
              <Icon name="eye-off" size={11} /> HIDDEN
            </span>
          )}
        </div>
        <div className="cmr-meta">
          <code title={item.sha256}>{item.sha256.slice(0, 8)}…</code>
          <span aria-hidden>·</span>
          <span>
            {item.epochReads} {item.epochReads === 1 ? 'read' : 'reads'} this cycle
          </span>
        </div>
        {error ? (
          <p className="error" style={{ margin: '6px 0 0' }}>
            {error}
          </p>
        ) : null}
      </div>

      {isCreator ? (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleToggle}
          disabled={setActive.isPending}
          aria-label={item.active ? `Hide content #${item.id}` : `Show content #${item.id}`}
        >
          {setActive.isPending ? (
            'Saving…'
          ) : item.active ? (
            <>
              <Icon name="eye-off" size={14} /> Hide
            </>
          ) : (
            <>
              <Icon name="eye" size={14} /> Show
            </>
          )}
        </Button>
      ) : (
        <span className="cmr-note">Creator only</span>
      )}
    </div>
  );
}

/**
 * Manager content-management surface (the "update content" flow). Lists everything the wallet has
 * published and lets the creator hide or re-show each item on-chain. Sits between Publish and
 * Earnings in the manager panel: publish it, manage it, get paid for it.
 */
export function ManagerContentPanel() {
  const myContent = useMyContent();
  const items = myContent.data ?? [];
  const liveCount = items.filter((c) => c.active).length;

  return (
    <section className="card">
      <h2>Your content</h2>

      {myContent.isLoading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
          <Skeleton className="h-12 w-full rounded-md" />
          <Skeleton className="h-12 w-full rounded-md" />
        </div>
      ) : items.length > 0 ? (
        <>
          <p className="hint" style={{ marginTop: 0 }}>
            {liveCount} live · {items.length - liveCount} hidden. Hiding pulls a file from members’
            libraries — it stays on-chain and keeps its reads, and you can show it again anytime.
          </p>
          <div className="content-manage-list">
            {items.map((item) => (
              <ContentRow key={item.id} item={item} />
            ))}
          </div>
        </>
      ) : (
        <p className="hint" style={{ display: 'flex', gap: 6, alignItems: 'center', marginTop: 0 }}>
          <Icon name="upload" size={15} />
          Nothing published yet. Your PDFs appear here to manage once you publish them.
        </p>
      )}
    </section>
  );
}
