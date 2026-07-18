'use client';

import { Icon } from '@/components/ui/icon';
import { Skeleton } from '@/components/ui/skeleton';
import { formatTokenAmount } from '@/lib/contracts';
import { timeAgo } from '@/lib/time';
import { useActivityList } from '@/services/activity';
import type { ActivityItem } from '@/services/activity';

const KIND_LABEL: Record<ActivityItem['type'], string> = {
  subscribed: 'Subscribed',
  accessed: 'Opened content',
  claimed: 'Withdrew earnings',
};

function detailFor(item: ActivityItem): string {
  if (item.type === 'accessed') return item.contentId ? `Content #${item.contentId}` : 'Content';
  if (item.amount) return `${formatTokenAmount(BigInt(item.amount))} USDC`;
  return '';
}

/** Last ~5 personal on-chain events (My Activity rail, prototype/dashboard.html `#my-activity`).
 *  `GET /me/activity` is event-sourced from chain, newest first, capped at 20 — slice to 5. */
export function ActivityRail() {
  const activity = useActivityList();
  const items = (activity.data?.items ?? []).slice(0, 5);

  return (
    <section className="card">
      <div className="label">MY ACTIVITY</div>
      {activity.isLoading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
          <Skeleton className="h-6 w-full rounded-md" />
          <Skeleton className="h-6 w-full rounded-md" />
        </div>
      ) : items.length > 0 ? (
        <div style={{ marginTop: 4 }}>
          {items.map((item) => (
            <div className="feed-row" key={item.txHash}>
              <div className="feed-main">
                <div className="feed-kind">{KIND_LABEL[item.type]}</div>
                <div className="feed-detail">{detailFor(item)}</div>
              </div>
              <span className="feed-when">{timeAgo(item.at)}</span>
            </div>
          ))}
        </div>
      ) : (
        <p className="hint" style={{ display: 'flex', gap: 6, alignItems: 'center', marginTop: 8 }}>
          <Icon name="sparkle" size={15} />
          Nothing yet. Open something from your library.
        </p>
      )}
    </section>
  );
}
