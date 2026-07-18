'use client';

import Link from 'next/link';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { ApiError } from '@/services/api/http';
import { useContentList, useOpenContent, useUpdateProgress } from '@/services/content';
import type { ContentListItem } from '@/services/content';
import { useProgressList } from '@/services/progress';

const TYPE_LABELS: Record<ContentListItem['contentType'], string> = {
  PDF: 'PDF',
  COURSE: 'COURSE',
  VIDEO: 'VIDEO',
  EBOOK: 'EBOOK',
  LINK: 'EXTERNAL LINK',
};

/** Community avatar: logo image, or an initial on an accent tint (D-010's `communityLogo` is
 *  nullable) — same rendering as `content-grid.tsx`'s `CommunityAvatar`, duplicated locally
 *  since it's a two-line presentational bit, not worth a shared export yet. */
function CommunityAvatar({ name, logo }: { name: string; logo: string | null }) {
  if (logo) {
    return (
      <span className="avatar">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </span>
    );
  }
  return <span className="avatar">{(name || '?').charAt(0).toUpperCase()}</span>;
}

/** Course module row: dot/number, title, and a Mark done / Undo toggle. */
function ModuleRow({
  index,
  title,
  done,
  onToggle,
  pending,
}: {
  index: number;
  title: string;
  done: boolean;
  onToggle: () => void;
  pending: boolean;
}) {
  return (
    <div
      className="row"
      style={{ paddingBottom: 'var(--space-2)', borderBottom: '1px solid var(--color-border-medium)' }}
    >
      <div className="row tight" style={{ alignItems: 'center' }}>
        <span className={done ? 'pill accent' : 'pill'}>
          {done ? <Icon name="check" size={12} /> : index + 1}
        </span>
        <span>{title}</span>
      </div>
      <Button type="button" variant="ghost" size="sm" onClick={onToggle} disabled={pending}>
        {done ? 'Undo' : 'Mark done'}
      </Button>
    </div>
  );
}

/**
 * Screen 7 (prototype `content.html?p=&i=`) reimplemented as a real route: rail (community,
 * PROGRESS card, CERTIFICATE card for courses, back link) + body (module list for courses,
 * a single Mark as read / Open action for everything else). Gating (wallet + subscription) is
 * the page's job, same as `/dashboard` — this view assumes both are already satisfied.
 */
export function ContentDetailView({ contentId }: { contentId: string }) {
  const list = useContentList();
  const progressList = useProgressList();
  const open = useOpenContent(contentId);
  const updateProgress = useUpdateProgress(contentId);
  const [notice, setNotice] = useState<string | null>(null);

  const item = list.data?.items.find((i) => i.contentId === contentId);
  const progress = progressList.data?.items.find((p) => p.contentId === contentId);

  if (list.isLoading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        <Skeleton className="h-8 w-1/3 rounded-md" />
        <Skeleton className="h-40 w-full rounded-md" />
      </div>
    );
  }

  if (!item) {
    return (
      <section className="card center">
        <h2>Content not found</h2>
        <p className="hint">This item may have been unpublished.</p>
        <Link className="btn ghost" href="/dashboard">
          Back to dashboard
        </Link>
      </section>
    );
  }

  const doneModules = progress?.doneModules ?? [];
  const modulesTotal = item.modules?.length ?? 0;
  const isCourse = item.contentType === 'COURSE' && modulesTotal > 0;
  const pct = isCourse
    ? modulesTotal > 0
      ? Math.round((doneModules.length / modulesTotal) * 100)
      : 0
    : (progress?.pct ?? 0);
  const certEarned = isCourse && doneModules.length === modulesTotal;

  async function toggleModule(idx: number) {
    const next = doneModules.includes(idx)
      ? doneModules.filter((m) => m !== idx)
      : [...doneModules, idx];
    await updateProgress.mutateAsync({ doneModules: next });
  }

  async function handleMarkReadAndOpen() {
    setNotice(null);
    try {
      await updateProgress.mutateAsync({ pct: 100 });
      const res = await open.mutateAsync();
      window.open(res.url, '_blank', 'noopener,noreferrer');
    } catch (e) {
      if (e instanceof ApiError && e.code === 'SUB_INACTIVE') {
        setNotice('Your membership isn’t active. Subscribe to open this.');
      } else if (e instanceof ApiError) {
        setNotice('Your read is recorded, but the file couldn’t be fetched just now. Try again in a moment.');
      } else {
        setNotice(e instanceof Error ? e.message : 'Couldn’t open this. Please try again.');
      }
    }
  }

  const busy = updateProgress.isPending || open.isPending;

  return (
    <div className="grid grid-cols-1 gap-[var(--space-4)] lg:grid-cols-[320px_1fr] lg:items-start">
      {/* Rail */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        <section className="card">
          <div className="row">
            <div className="row tight" style={{ alignItems: 'center' }}>
              <CommunityAvatar name={item.communityName ?? 'Independent creators'} logo={item.communityLogo} />
              <h2 style={{ margin: 0, fontSize: 16 }}>{item.communityName ?? 'Independent creators'}</h2>
            </div>
            <span className="content-meta">Unlocked</span>
          </div>
          <p className="hint" style={{ marginTop: 'var(--space-2)' }}>
            {TYPE_LABELS[item.contentType]}
          </p>
        </section>

        <section className="card">
          <div className="label">PROGRESS</div>
          <div className="balance">{pct}%</div>
          <Progress value={pct} />
          <p className="content-meta" style={{ marginTop: 'var(--space-2)' }}>
            {isCourse
              ? `${doneModules.length} of ${modulesTotal} modules done`
              : pct === 100
                ? 'Done. Nice.'
                : 'Not started yet.'}
          </p>
        </section>

        {isCourse ? (
          <section className="card">
            <div className="label">CERTIFICATE</div>
            <div className="row" style={{ marginTop: 'var(--space-2)' }}>
              <span className="content-meta" style={{ marginTop: 0 }}>
                {certEarned ? 'Course complete. Certificate is yours.' : 'Finish every module to earn it.'}
              </span>
              <span className={certEarned ? 'pill accent' : 'pill'}>
                <Icon name={certEarned ? 'check' : 'lock'} size={12} />
                {certEarned ? 'EARNED' : 'LOCKED'}
              </span>
            </div>
          </section>
        ) : null}

        <Link href="/dashboard" className="hint">
          ← Back to dashboard
        </Link>
      </div>

      {/* Body */}
      <section className="card">
        <div className="content-type">{TYPE_LABELS[item.contentType]}</div>
        <h2 style={{ marginTop: 'var(--space-1)' }}>{item.title}</h2>
        {item.description ? <p className="hint">{item.description}</p> : null}

        {isCourse ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', marginTop: 'var(--space-4)' }}>
            {item.modules!.map((m, i) => (
              <ModuleRow
                key={`${m.title}-${i}`}
                index={i}
                title={m.title}
                done={doneModules.includes(i)}
                onToggle={() => toggleModule(i)}
                pending={updateProgress.isPending}
              />
            ))}
          </div>
        ) : (
          <div style={{ marginTop: 'var(--space-4)' }}>
            <Button type="button" onClick={handleMarkReadAndOpen} disabled={busy}>
              {busy ? (
                'Opening…'
              ) : pct === 100 ? (
                <>
                  <Icon name="download" size={14} /> Open again
                </>
              ) : (
                <>
                  <Icon name="download" size={14} /> Mark as read &amp; open
                </>
              )}
            </Button>
            {notice ? <p className="hint" style={{ marginTop: 'var(--space-2)' }}>{notice}</p> : null}
          </div>
        )}
      </section>
    </div>
  );
}
