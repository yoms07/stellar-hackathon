'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Skeleton } from '@/components/ui/skeleton';
import { ApiError } from '@/services/api/http';
import { useContentList, useHasRead, useOpenContent } from '@/services/content';
import type { ContentListItem } from '@/services/content';
import { useSubscriptionStatus } from '@/services/subscription';

const TYPE_LABELS: Record<ContentListItem['contentType'], string> = {
  PDF: 'PDF',
  COURSE: 'COURSE',
  VIDEO: 'VIDEO',
  EBOOK: 'EBOOK',
  LINK: 'EXTERNAL LINK',
};

/** One content row: type/title/community meta, locked/unlocked badge + open button. Download
 *  flow, PLAN.md §2. The Open CTA (gold, the design system's one primary action) is reserved
 *  for content the member can actually unlock — i.e. an active subscription. While inactive it
 *  degrades to a secondary "Subscribe to open" so a locked row never wears a green-light button. */
export function ContentRow({ item }: { item: ContentListItem }) {
  const status = useSubscriptionStatus();
  const hasRead = useHasRead(item.contentId);
  const open = useOpenContent(item.contentId);
  const [notice, setNotice] = useState<string | null>(null);

  const isActive = status.data?.isActive ?? false;

  async function handleOpen() {
    setNotice(null);
    // No active subscription: don't fire a doomed download — point the member at the CTA above.
    if (!isActive) {
      setNotice('Become a member first (Membership card above) to open this.');
      return;
    }
    try {
      const res = await open.mutateAsync();
      window.open(res.url, '_blank', 'noopener,noreferrer');
    } catch (e) {
      if (e instanceof ApiError && e.code === 'SUB_INACTIVE') {
        setNotice('Your membership isn’t active. Subscribe to open this.');
      } else if (e instanceof ApiError) {
        setNotice('Your read is recorded on-chain, but the file couldn’t be fetched just now. Try again in a moment.');
      } else {
        setNotice(e instanceof Error ? e.message : 'Couldn’t open this. Please try again.');
      }
    }
  }

  return (
    <div className="benefit-line content-line">
      <div className="item-lead">
        <div className="lead-text">
          <div className="content-type">{TYPE_LABELS[item.contentType]}</div>
          <Link href={`/dashboard/content/${item.contentId}`} className="content-title" style={{ display: 'block' }}>
            {item.title}
          </Link>
          <div className="content-meta">
            {hasRead.data ? (
              <span className="pill accent">
                <Icon name="unlock" size={12} /> UNLOCKED
              </span>
            ) : (
              <span className="pill">
                <Icon name="lock" size={12} /> LOCKED
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="row tight" style={{ marginTop: 0 }}>
        <Button
          type="button"
          size="sm"
          variant={isActive ? 'default' : 'outline'}
          onClick={handleOpen}
          disabled={open.isPending || status.isLoading}
        >
          {open.isPending ? (
            'Opening…'
          ) : isActive ? (
            <>
              <Icon name="download" size={14} /> Open
            </>
          ) : (
            'Subscribe to open'
          )}
        </Button>
      </div>
      {notice ? <p className="hint" style={{ gridColumn: '1 / -1' }}>{notice}</p> : null}
    </div>
  );
}

/** Overlapping-circle-free single avatar: partner logo, or an initial on an accent tint when
 *  the manager hasn't set one up yet (D-010's `communityLogo` is nullable). */
function CommunityAvatar({ name, logo }: { name: string; logo: string | null }) {
  if (logo) {
    return (
      <span className="avatar">
        <img src={logo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </span>
    );
  }
  return <span className="avatar">{name.charAt(0).toUpperCase()}</span>;
}

/** One partner's items, headed by its avatar + name (DESIGN.md "Partner communities cluster",
 *  Coinbase learning-rewards grouping pattern — see prototype/dashboard.html `.lib-group`). */
function LibraryGroup({
  name,
  logo,
  wallet,
  items,
}: {
  name: string;
  logo: string | null;
  wallet: string | null;
  items: ContentListItem[];
}) {
  const head = (
    <>
      <CommunityAvatar name={name} logo={logo} />
      <div>
        <div className="content-title">{name}</div>
        <div className="content-meta">{items.length} {items.length === 1 ? 'item' : 'items'} included</div>
      </div>
    </>
  );

  return (
    <div className="lib-group">
      {wallet ? (
        <Link href={`/community/${wallet}`} className="row tight lib-head">
          {head}
        </Link>
      ) : (
        <div className="row tight lib-head">{head}</div>
      )}
      {items.map((item) => (
        <ContentRow key={item.contentId} item={item} />
      ))}
    </div>
  );
}

/** Content library, grouped by community (member panel). Reads `GET /content` — see
 *  `useContentList`. Items with no `communityName` (manager hasn't set up a brand yet, D-010)
 *  fall into one "Independent creators" group rather than being dropped. */
export function ContentGrid() {
  const list = useContentList();
  const items = list.data?.items ?? [];

  const groups = useMemo(() => {
    const byName = new Map<
      string,
      { name: string; logo: string | null; wallet: string | null; items: ContentListItem[] }
    >();
    for (const item of items) {
      const name = item.communityName ?? 'Independent creators';
      const existing = byName.get(name);
      if (existing) {
        existing.items.push(item);
      } else {
        byName.set(name, {
          name,
          logo: item.communityLogo,
          wallet: item.communityName ? item.creatorWallet : null,
          items: [item],
        });
      }
    }
    return Array.from(byName.values());
  }, [items]);

  return (
    <section className="card">
      <h2>Library</h2>
      {list.isLoading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Skeleton className="h-12 w-full rounded-md" />
          <Skeleton className="h-12 w-full rounded-md" />
        </div>
      ) : groups.length > 0 ? (
        <div>
          {groups.map((group) => (
            <LibraryGroup
              key={group.name}
              name={group.name}
              logo={group.logo}
              wallet={group.wallet}
              items={group.items}
            />
          ))}
        </div>
      ) : (
        <p className="hint" style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <Icon name="sparkle" size={15} />
          Nothing here yet. New content shows up the moment a community publishes it.
        </p>
      )}
    </section>
  );
}
