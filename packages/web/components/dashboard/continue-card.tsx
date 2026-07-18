'use client';

import { useMemo, type ReactNode } from 'react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Progress } from '@/components/ui/progress';
import { useContentList } from '@/services/content';
import { useProgressList } from '@/services/progress';

const TYPE_LABELS: Record<string, string> = {
  PDF: 'PDF',
  COURSE: 'COURSE',
  VIDEO: 'VIDEO',
  EBOOK: 'EBOOK',
  LINK: 'EXTERNAL LINK',
};

/** "Continue where you left off" hero (DESIGN.md-style `.card`, prototype/dashboard.html
 *  `#continue-card`): the member's most-recently-viewed item, with a progress indicator and
 *  a Resume CTA into the content detail route. `fallback` renders once loading resolves and
 *  there's genuinely nothing to resume — e.g. a freshly subscribed member with no reads yet —
 *  instead of this collapsing to nothing and leaving a dead gap on the page. */
export function ContinueCard({ fallback = null }: { fallback?: ReactNode } = {}) {
  const progress = useProgressList();
  const content = useContentList();

  const last = useMemo(() => {
    const items = progress.data?.items ?? [];
    if (items.length === 0) return null;
    return [...items].sort((a, b) => {
      const at = new Date(a.lastViewedAt ?? a.updatedAt).getTime();
      const bt = new Date(b.lastViewedAt ?? b.updatedAt).getTime();
      return bt - at;
    })[0];
  }, [progress.data]);

  const item = useMemo(() => {
    if (!last) return null;
    return content.data?.items.find((c) => c.contentId === last.contentId) ?? null;
  }, [last, content.data]);

  const isLoading = progress.isLoading || content.isLoading;

  // Still loading: render nothing rather than flashing the fallback before data arrives.
  if (isLoading) {
    return null;
  }

  // Loaded, but nothing to resume: hand off to the caller's fallback (or nothing, if none given).
  if (!last || !item) {
    return <>{fallback}</>;
  }

  const modulesTotal = item.modules?.length ?? 0;
  const doneModules = last.doneModules?.length ?? 0;
  const pct = modulesTotal > 0 ? Math.round((doneModules / modulesTotal) * 100) : (last.pct ?? 0);
  const progressLabel = modulesTotal > 0 ? `${doneModules} of ${modulesTotal} modules done` : `${pct}% viewed`;

  return (
    <section className="card">
      <div className="label">CONTINUE WHERE YOU LEFT OFF</div>
      <div className="content-type" style={{ marginTop: 10 }}>{TYPE_LABELS[item.contentType] ?? item.contentType}</div>
      <h2 style={{ margin: '2px 0 4px' }}>{item.title}</h2>
      <div className="content-meta">
        {item.communityName ?? 'Independent creators'} · {progressLabel}
      </div>
      <Progress value={pct} style={{ margin: 'var(--space-3) 0' }} />
      <div className="row tight">
        <Button asChild type="button">
          <Link href={`/dashboard/content/${item.contentId}`}>
            <Icon name="arrow-right" size={15} /> {pct >= 100 ? 'Review' : 'Resume'}
          </Link>
        </Button>
      </div>
    </section>
  );
}
